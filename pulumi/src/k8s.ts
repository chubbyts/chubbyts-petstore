import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';
import * as digitalocean from '@pulumi/digitalocean';

export const createK8sCluster = (
  region: digitalocean.Region,
  vpc: digitalocean.Vpc,
  size: string = digitalocean.DropletSlug.DropletS2VCPU2GB,
  nodeCount: number = 2,
): digitalocean.KubernetesCluster => {
  return new digitalocean.KubernetesCluster('k8s-cluster', {
    nodePool: {
      name: 'default',
      size,
      nodeCount,
    },
    region,
    version: '1.24.4-do.0',
    vpcUuid: vpc.id,
  });
};

// https://github.com/pulumi/pulumi-digitalocean/issues/78#issuecomment-639669865
export const createK8sTokenKubeconfig = (
  cluster: digitalocean.KubernetesCluster,
  user: pulumi.Input<string>,
  apiToken: pulumi.Input<string>,
): pulumi.Output<string> => {
  return pulumi.interpolate`apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${cluster.kubeConfigs[0].clusterCaCertificate}
    server: ${cluster.endpoint}
  name: ${cluster.name}
contexts:
- context:
    cluster: ${cluster.name}
    user: ${cluster.name}-${user}
  name: ${cluster.name}
current-context: ${cluster.name}
kind: Config
users:
- name: ${cluster.name}-${user}
  user:
    token: ${apiToken}
`;
}

export const createK8sProvider = (kubeconfig: pulumi.Input<string>): k8s.Provider => {
  return new k8s.Provider('k8s-provider', { kubeconfig });
};

export const createK8sDockerRegistrySecret = (
  provider: k8s.Provider,
  registryDockerCredentials: digitalocean.ContainerRegistryDockerCredentials,
): k8s.core.v1.Secret => {
  return new k8s.core.v1.Secret(
    'do-docker-registry-secret',
    {
      type: 'kubernetes.io/dockerconfigjson',
      metadata: {
        name: 'do-docker-registry-secret',
      },
      stringData: {
        '.dockerconfigjson': registryDockerCredentials.dockerCredentials,
      },
    },
    { provider },
  );
};

export const createK8sHttpDeployment = (
  provider: k8s.Provider,
  labels: { appClass: string },
  image: pulumi.Input<string>,
  env: pulumi.Input<Array<{ name: string; value: string | pulumi.Output<string> }>>,
  port: number,
  path: string,
  replicas: number = 2,
): k8s.apps.v1.Deployment => {
  return new k8s.apps.v1.Deployment(
    `${labels.appClass}-deployment`,
    {
      metadata: { labels },
      spec: {
        replicas,
        minReadySeconds: 15,
        selector: { matchLabels: labels },
        template: {
          metadata: { labels },
          spec: {
            containers: [
              {
                name: labels.appClass,
                image,
                imagePullPolicy: 'IfNotPresent',
                env,
                ports: [{ name: 'http', containerPort: port }],
                readinessProbe: {
                  httpGet: {
                    path,
                    port,
                    scheme: 'HTTP',
                  },
                },
                livenessProbe: {
                  httpGet: {
                    path,
                    port,
                    scheme: 'HTTP',
                  },
                },
              },
            ],
            imagePullSecrets: [{ name: 'do-docker-registry-secret' }],
          },
        },
      },
    },
    { provider },
  );
};

export const createK8sInternalHttpService = (
  provider: k8s.Provider,
  labels: { appClass: string },
  port: number,
): k8s.core.v1.Service => {
  return new k8s.core.v1.Service(
    `${labels.appClass}-internal-service`,
    {
      metadata: { name: labels.appClass, labels: labels },
      spec: {
        type: 'ClusterIP',
        ports: [{ name: 'http', port, targetPort: 'http' }],
        selector: labels,
      },
    },
    { provider },
  );
};

export const installK8sHelmIngressNginxController = (provider: k8s.Provider): k8s.helm.v3.Release => {
  // https://github.com/digitalocean/marketplace-kubernetes/tree/master/stacks/ingress-nginx
  // https://raw.githubusercontent.com/digitalocean/marketplace-kubernetes/master/stacks/ingress-nginx/values.yml
  return new k8s.helm.v3.Release(
    'helm-ingress-nginx',
    {
      chart: 'ingress-nginx',
      version: '4.2.4',
      repositoryOpts: {
        repo: 'https://kubernetes.github.io/ingress-nginx',
      },
      namespace: 'ingress-nginx',
      createNamespace: true,
      values: {
        controller: {
          replicaCount: 2,
          service: {
            type: 'LoadBalancer',
          },
          metrics: {
            enabled: true,
          },
          podAnnotations: {
            controller: {
              metrics: {
                service: {
                  servicePort: '9090',
                },
              },
            },
            'prometheus.io/port': '10254',
            'prometheus.io/scrape': 'true',
          },
        },
      },
    },
    { provider },
  );
};

export const installK8sHelmCertManager = (provider: k8s.Provider): k8s.helm.v3.Release => {
  // https://github.com/digitalocean/marketplace-kubernetes/tree/master/stacks/cert-manager
  // https://raw.githubusercontent.com/digitalocean/marketplace-kubernetes/master/stacks/cert-manager/values.yml
  return new k8s.helm.v3.Release(
    'helm-cert-manager',
    {
      chart: 'cert-manager',
      version: '1.9.1',
      repositoryOpts: {
        repo: 'https://charts.jetstack.io',
      },
      namespace: 'cert-manager',
      createNamespace: true,
      values: {
        installCRDs: true,
        prometheus: {
          enabled: false,
        },
      },
    },
    { provider },
  );
};

export const createK8sIngressNginx = (
  provider: k8s.Provider,
  helm: k8s.helm.v3.Release,
  rules: Array<k8s.types.input.networking.v1.IngressRule>,
  annotations: { [key: string]: string } = {},
): k8s.networking.v1.Ingress => {
  return new k8s.networking.v1.Ingress(
    'nginx-ingress',
    {
      metadata: {
        name: 'nginx-ingress',
        annotations: {
          'cert-manager.io/cluster-issuer': 'letsencrypt-prod',
          'kubernetes.io/ingress.class': 'nginx',
          'nginx.ingress.kubernetes.io/proxy-body-size': '0',
          'nginx.ingress.kubernetes.io/proxy-read-timeout': '600',
          'nginx.ingress.kubernetes.io/proxy-send-timeout': '600',
          ...annotations,
          helmId: helm.id,
        },
      },
      spec: {
        rules,
        tls: [
          {
            hosts: rules.filter((rule) => rule.host !== undefined).map((rule) => rule.host) as Array<string>,
            secretName: 'letsencrypt-tls',
          },
        ],
      },
    },
    { provider },
  );
};

export const createK8sCertManager = (
  provider: k8s.Provider,
  helm: k8s.helm.v3.Release,
  email: string,
): k8s.apiextensions.CustomResource => {
  return new k8s.apiextensions.CustomResource(
    'cert-manager',
    {
      apiVersion: 'cert-manager.io/v1',
      kind: 'ClusterIssuer',
      metadata: {
        name: 'letsencrypt-prod',
        namespace: 'cert-manager',
        annotations: {
          helmId: helm.id,
        },
      },
      spec: {
        acme: {
          server: 'https://acme-v02.api.letsencrypt.org/directory',
          email,
          privateKeySecretRef: {
            name: 'letsencrypt-prod',
          },
          solvers: [
            {
              http01: {
                ingress: {
                  class: 'nginx',
                },
              },
            },
          ],
        },
      },
    },
    { provider },
  );
};
