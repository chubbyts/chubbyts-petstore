import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';
import * as digitalocean from '@pulumi/digitalocean';

export const createK8sCluster = (region: digitalocean.Region, vpc: digitalocean.Vpc, size: string = digitalocean.DropletSlug.DropletS2VCPU2GB, nodeCount: number = 2): digitalocean.KubernetesCluster => {
  return new digitalocean.KubernetesCluster('k8s-cluster', {
    nodePool: {
      name: 'default',
      size,
      nodeCount,
    },
    region,
    version: '1.23.9-do.0',
    vpcUuid: vpc.id,
  });
};

export const createK8sProvider = (cluster: digitalocean.KubernetesCluster): k8s.Provider => {
  return new k8s.Provider('k8s-provider', { kubeconfig: cluster.kubeConfigs[0].rawConfig });
};

export const createK8sHttpDeployment = (
  provider: k8s.Provider,
  labels: { appClass: string; },
  image: pulumi.Input<string>,
  env: pulumi.Input<Array<{ name: string, value: string | pulumi.Output<string>; }>>,
  port: number,
  path: string,
  scheme: 'HTTP' | 'HTTPS' = 'HTTP',
): k8s.apps.v1.Deployment => {
  return new k8s.apps.v1.Deployment(`${labels.appClass}-deployment`, {
    metadata: { labels },
    spec: {
      replicas: 2,
      selector: { matchLabels: labels },
      template: {
        metadata: { labels },
        spec: {
          containers: [{
            name: labels.appClass,
            image,
            imagePullPolicy: 'IfNotPresent',
            env,
            ports: [{ name: 'http', containerPort: port }],
            readinessProbe: {
              httpGet: {
                path,
                port,
                scheme
              },
            },
            livenessProbe: {
              httpGet: {
                path,
                port,
                scheme
              },
            },
          }],
        }
      }
    },
  }, { provider });
};

export const createK8sInternalHttpService = (
  provider: k8s.Provider,
  labels: { appClass: string; },
  port: number,
): k8s.core.v1.Service => {
  return new k8s.core.v1.Service(`${labels.appClass}-internal-service`, {
    metadata: { name: labels.appClass, labels: labels },
    spec: {
      type: 'ClusterIP',
      ports: [{ name: 'http', port, targetPort: 'http' }],
      selector: labels,
    },
  }, { provider });
};

export const createK8sExternalHttpService = (
  provider: k8s.Provider,
  labels: { appClass: string; },
  port: number,
  externalPort: number,
): k8s.core.v1.Service => {
  return new k8s.core.v1.Service(`${labels.appClass}-public-service`, {
    metadata: { labels: labels },
    spec: {
      type: 'LoadBalancer',
      ports: [{ name: 'http', port: externalPort, targetPort: port, protocol: 'TCP' }],
      selector: labels,
    },
  }, { provider });
};

export const installHelmIngressNginxController = (provider: k8s.Provider): k8s.helm.v3.Release => {
  // https://github.com/digitalocean/marketplace-kubernetes/tree/master/stacks/ingress-nginx
  // https://raw.githubusercontent.com/digitalocean/marketplace-kubernetes/master/stacks/ingress-nginx/values.yml
  return new k8s.helm.v3.Release('helm-ingress-nginx', {
    chart: 'ingress-nginx',
    version: '4.2.1',
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
  }, { provider });
};

export const installHelmCertManager = (provider: k8s.Provider): k8s.helm.v3.Release => {
  // https://github.com/digitalocean/marketplace-kubernetes/tree/master/stacks/cert-manager
  // https://raw.githubusercontent.com/digitalocean/marketplace-kubernetes/master/stacks/cert-manager/values.yml
  return new k8s.helm.v3.Release('helm-cert-manager', {
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
      }
    },
  }, { provider });
};

export const createIngressNginx = (provider: k8s.Provider, paths: Array<k8s.types.input.networking.v1.HTTPIngressPath>): k8s.networking.v1.Ingress => {
  return new k8s.networking.v1.Ingress('nginx-ingress', {
    metadata: {
      name: 'nginx-ingress',
      annotations: {
        'cert-manager.io/cluster-issuer': 'letsencrypt-prod',
        'kubernetes.io/ingress.class': 'nginx',
      }
    },
    spec: {
      rules: [
        {
          host: 'chubbyts-petstore.dev',
          http: {
            paths,
          },
        },
      ],
      tls: [
        {
          hosts: ['chubbyts-petstore.dev'],
          secretName: 'chubbyts-petstore-tls'
        },
      ],
    },
  }, { provider });
};

export const createCertManager = (provider: k8s.Provider, email: string): k8s.apiextensions.CustomResource => {
  return new k8s.apiextensions.CustomResource('cert-manager', {
    apiVersion: 'cert-manager.io/v1',
    kind: 'ClusterIssuer',
    metadata: {
      name: 'letsencrypt-prod',
      namespace: 'cert-manager',
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
  }, { provider });
};
