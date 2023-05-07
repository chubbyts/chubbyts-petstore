import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';
import * as digitalocean from '@pulumi/digitalocean';

type CreateK8sClusterProps = {
  region: digitalocean.Region;
  vpc: digitalocean.Vpc;
  nodeCount: number;
  size?: string;
};

export const createK8sCluster = ({
  region,
  vpc,
  size = digitalocean.DropletSlug.DropletS2VCPU2GB,
  nodeCount,
}: CreateK8sClusterProps): digitalocean.KubernetesCluster => {
  return new digitalocean.KubernetesCluster('k8s-cluster', {
    nodePool: {
      name: 'default',
      size,
      nodeCount,
    },
    region,
    version: '1.26.3-do.0',
    autoUpgrade: true,
    vpcUuid: vpc.id,
  });
};

type CreateK8sTokenKubeconfigProps = {
  k8sCluster: digitalocean.KubernetesCluster;
  user: pulumi.Input<string>;
  apiToken: pulumi.Input<string>;
};

// https://github.com/pulumi/pulumi-digitalocean/issues/78#issuecomment-639669865
export const createK8sTokenKubeconfig = ({
  k8sCluster,
  user,
  apiToken,
}: CreateK8sTokenKubeconfigProps): pulumi.Output<string> => {
  return pulumi.interpolate`apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${k8sCluster.kubeConfigs[0].clusterCaCertificate}
    server: ${k8sCluster.endpoint}
  name: ${k8sCluster.name}
contexts:
- context:
    cluster: ${k8sCluster.name}
    user: ${k8sCluster.name}-${user}
  name: ${k8sCluster.name}
current-context: ${k8sCluster.name}
kind: Config
users:
- name: ${k8sCluster.name}-${user}
  user:
    token: ${apiToken}
`;
};

type CreateK8sProviderProps = {
  k8sTokenKubeConfig: pulumi.Input<string>;
};

export const createK8sProvider = ({ k8sTokenKubeConfig }: CreateK8sProviderProps): k8s.Provider => {
  return new k8s.Provider('k8s-provider', { kubeconfig: k8sTokenKubeConfig });
};

type InstallK8sDockerRegistrySecretProps = {
  k8sProvider: k8s.Provider;
  containerRegistryDockerReadCredentials: digitalocean.ContainerRegistryDockerCredentials;
};

export const installK8sDockerRegistrySecret = ({
  k8sProvider,
  containerRegistryDockerReadCredentials,
}: InstallK8sDockerRegistrySecretProps): k8s.core.v1.Secret => {
  return new k8s.core.v1.Secret(
    'do-docker-registry-secret',
    {
      type: 'kubernetes.io/dockerconfigjson',
      metadata: {
        name: 'do-docker-registry-secret',
      },
      stringData: {
        '.dockerconfigjson': containerRegistryDockerReadCredentials.dockerCredentials,
      },
    },
    { provider: k8sProvider },
  );
};

type Resources = { requests: { memory: string }; limits: { memory: string } };

type CreateK8sHttpStatefulSetProps = {
  k8sProvider: k8s.Provider;
  labels: { appClass: string };
  image: pulumi.Input<string>;
  env: pulumi.Input<Array<{ name: string; value: string | pulumi.Output<string> }>>;
  port: number;
  path: string;
  volumes: Array<{ name: string; mountPath: string; storage: string }>;
  replicas: number;
  resources?: Resources;
};

export const createK8sHttpStatefulSet = ({
  k8sProvider,
  labels,
  image,
  env,
  port,
  path,
  volumes,
  replicas,
  resources = undefined,
}: CreateK8sHttpStatefulSetProps): k8s.apps.v1.StatefulSet => {
  return new k8s.apps.v1.StatefulSet(
    `${labels.appClass}-stateful-set`,
    {
      metadata: { labels },
      spec: {
        replicas,
        minReadySeconds: 15,
        selector: { matchLabels: labels },
        serviceName: labels.appClass,
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
                volumeMounts: volumes.map((volume) => ({ name: volume.name, mountPath: volume.mountPath })),
                resources,
              },
            ],
            initContainers: volumes.map((volume) => ({
              name: `${volume.name}-permission-fix`,
              image: 'busybox',
              command: ['/bin/chmod', '-R', '777', volume.mountPath],
              volumeMounts: [{ name: volume.name, mountPath: volume.mountPath }],
            })),
            imagePullSecrets: [{ name: 'do-docker-registry-secret' }],
          },
        },
        volumeClaimTemplates: volumes.map((volume) => ({
          metadata: { name: volume.name },
          spec: {
            accessModes: ['ReadWriteOnce'],
            resources: {
              requests: {
                storage: volume.storage,
              },
            },
          },
        })),
      },
    },
    { provider: k8sProvider },
  );
};

type CreateK8sHttpDeploymentProps = {
  k8sProvider: k8s.Provider;
  labels: { appClass: string };
  image: pulumi.Input<string>;
  env: pulumi.Input<Array<{ name: string; value: string | pulumi.Output<string> }>>;
  port: number;
  path: string;
  replicas: number;
  fluentdImage?: pulumi.Input<string>;
  fluentdEnv?: pulumi.Input<Array<{ name: string; value: string | pulumi.Output<string> }>>;
  resources?: Resources;
};

export const createK8sHttpDeployment = ({
  k8sProvider,
  labels,
  image,
  env,
  port,
  path,
  replicas,
  fluentdImage = undefined,
  fluentdEnv = [],
  resources = undefined,
}: CreateK8sHttpDeploymentProps): k8s.apps.v1.Deployment => {
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
                volumeMounts: [
                  {
                    name: 'var-log',
                    mountPath: '/app/var/log',
                  },
                ],
                resources,
              },
              ...(fluentdImage
                ? [
                    {
                      name: `${labels.appClass}-fluentd`,
                      image: fluentdImage,
                      env: fluentdEnv,
                      volumeMounts: [
                        {
                          name: 'var-log',
                          mountPath: '/app/var/log',
                        },
                      ],
                    },
                  ]
                : []),
            ],
            imagePullSecrets: [{ name: 'do-docker-registry-secret' }],
            volumes: [
              {
                name: 'var-log',
                emptyDir: {},
              },
            ],
          },
        },
      },
    },
    { provider: k8sProvider },
  );
};

type CreateK8sCronjobProps = {
  k8sProvider: k8s.Provider;
  labels: { appClass: string };
  cronjobName: string;
  schedule: string;
  command: string;
  image: pulumi.Input<string>;
  env: pulumi.Input<Array<{ name: string; value: string | pulumi.Output<string> }>>;
  fluentdImage?: pulumi.Input<string>;
  fluentdEnv?: pulumi.Input<Array<{ name: string; value: string | pulumi.Output<string> }>>;
};

export const createK8sCronjob = ({
  k8sProvider,
  labels,
  cronjobName,
  schedule,
  command,
  image,
  env,
  fluentdImage = undefined,
  fluentdEnv = [],
}: CreateK8sCronjobProps): k8s.batch.v1.CronJob => {
  return new k8s.batch.v1.CronJob(
    `${labels.appClass}-cronjob-${cronjobName}`,
    {
      metadata: { labels: labels },
      spec: {
        schedule,
        concurrencyPolicy: 'Forbid',
        jobTemplate: {
          spec: {
            template: {
              spec: {
                containers: [
                  {
                    name: `${labels.appClass}-cronjob-${cronjobName}`,
                    image,
                    env,
                    imagePullPolicy: 'IfNotPresent',
                    command: [
                      '/bin/bash',
                      '-c',
                      `${command}; while ! nc -z localhost 24444; do sleep 0.1; done; sleep 5; curl http://localhost:24444/api/processes.flushBuffersAndKillWorkers`,
                    ],
                    volumeMounts: [
                      {
                        name: 'var-log',
                        mountPath: '/app/var/log',
                      },
                    ],
                  },
                  ...(fluentdImage
                    ? [
                        {
                          name: `${labels.appClass}-cronjob-${cronjobName}-fluentd`,
                          image: fluentdImage,
                          env: fluentdEnv,
                          readinessProbe: {
                            httpGet: {
                              path: '/',
                              port: 24444,
                              scheme: 'HTTP',
                            },
                          },
                          livenessProbe: {
                            httpGet: {
                              path: '/',
                              port: 24444,
                              scheme: 'HTTP',
                            },
                          },
                          volumeMounts: [
                            {
                              name: 'var-log',
                              mountPath: '/app/var/log',
                            },
                          ],
                        },
                      ]
                    : []),
                ],
                imagePullSecrets: [{ name: 'do-docker-registry-secret' }],
                restartPolicy: 'Never',
                volumes: [
                  {
                    name: 'var-log',
                    emptyDir: {},
                  },
                ],
              },
            },
          },
        },
      },
    },
    { provider: k8sProvider },
  );
};

type CreateK8sInternalHttpServiceProps = {
  k8sProvider: k8s.Provider;
  labels: { appClass: string };
  port: number;
};

export const createK8sInternalHttpService = ({
  k8sProvider,
  labels,
  port,
}: CreateK8sInternalHttpServiceProps): k8s.core.v1.Service => {
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
    { provider: k8sProvider },
  );
};

type InstallK8sHelmMetricsServerProps = {
  k8sProvider: k8s.Provider;
};

export const installK8sHelmMetricsServer = ({ k8sProvider }: InstallK8sHelmMetricsServerProps): k8s.helm.v3.Release => {
  // https://github.com/digitalocean/marketplace-kubernetes/tree/master/stacks/metrics-server
  // https://raw.githubusercontent.com/digitalocean/marketplace-kubernetes/master/stacks/metrics-server/values.yml
  return new k8s.helm.v3.Release(
    'helm-metrics-server',
    {
      chart: 'metrics-server',
      version: '3.10.0',
      repositoryOpts: {
        repo: 'https://kubernetes-sigs.github.io/metrics-server',
      },
      namespace: 'metrics-server',
      createNamespace: true,
      values: {
        replicas: 2,
        apiService: {
          create: true,
        },
      },
    },
    { provider: k8sProvider },
  );
};

type InstallK8sHelmIngressNginxControllerProps = {
  k8sProvider: k8s.Provider;
  doLoadbalancerHostname: string;
};

export const installK8sHelmIngressNginxController = ({
  k8sProvider,
  doLoadbalancerHostname,
}: InstallK8sHelmIngressNginxControllerProps): k8s.helm.v3.Release => {
  // https://github.com/digitalocean/marketplace-kubernetes/tree/master/stacks/ingress-nginx
  // https://raw.githubusercontent.com/digitalocean/marketplace-kubernetes/master/stacks/ingress-nginx/values.yml
  // https://docs.digitalocean.com/products/kubernetes/how-to/configure-load-balancers/#protocol
  return new k8s.helm.v3.Release(
    'helm-ingress-nginx',
    {
      chart: 'ingress-nginx',
      version: '4.6.0',
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
            annotations: {
              'service.beta.kubernetes.io/do-loadbalancer-hostname': doLoadbalancerHostname,
              'service.beta.kubernetes.io/do-loadbalancer-enable-proxy-protocol': 'true',
            },
          },
          publishService: {
            enable: true,
          },
          config: {
            'use-forward-headers': 'true',
            'compute-full-forward-for': 'true',
            'use-proxy-protocol': 'true',
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
    { provider: k8sProvider },
  );
};

type InstallK8sHelmCertManagerProps = {
  k8sProvider: k8s.Provider;
};

export const installK8sHelmCertManager = ({ k8sProvider }: InstallK8sHelmCertManagerProps): k8s.helm.v3.Release => {
  // https://github.com/digitalocean/marketplace-kubernetes/tree/master/stacks/cert-manager
  // https://raw.githubusercontent.com/digitalocean/marketplace-kubernetes/master/stacks/cert-manager/values.yml
  return new k8s.helm.v3.Release(
    'helm-cert-manager',
    {
      chart: 'cert-manager',
      version: '1.11.1',
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
    { provider: k8sProvider },
  );
};

type CreateK8sIngressNginxProps = {
  k8sProvider: k8s.Provider;
  helmIngressNginxController: k8s.helm.v3.Release;
  rules: Array<k8s.types.input.networking.v1.IngressRule>;
  addWwwAliasForHosts?: Array<string>;
  annotations?: { [key: string]: string };
};

export const createK8sIngressNginx = ({
  k8sProvider,
  helmIngressNginxController,
  rules,
  addWwwAliasForHosts = [],
  annotations = {},
}: CreateK8sIngressNginxProps): k8s.networking.v1.Ingress => {
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
          'nginx.ingress.kubernetes.io/from-to-www-redirect': 'true',
          ...annotations,
          helmId: helmIngressNginxController.id,
        },
      },
      spec: {
        rules,
        tls: [
          {
            hosts: [
              ...(rules.filter((rule) => rule.host !== undefined).map((rule) => rule.host) as Array<string>),
              ...addWwwAliasForHosts.map((host) => `www.${host}`),
            ],
            secretName: 'letsencrypt-tls',
          },
        ],
      },
    },
    { provider: k8sProvider },
  );
};

type CreateK8sCertManagerProps = {
  k8sProvider: k8s.Provider;
  helmCertManager: k8s.helm.v3.Release;
  email: string;
};

// IMPORTANT: Make sure that all domains that are provided by the ingress resolve to the cluster, otherwise the certificated cannot be issued
export const createK8sCertManager = ({
  k8sProvider,
  helmCertManager,
  email,
}: CreateK8sCertManagerProps): k8s.apiextensions.CustomResource => {
  return new k8s.apiextensions.CustomResource(
    'cert-manager',
    {
      apiVersion: 'cert-manager.io/v1',
      kind: 'ClusterIssuer',
      metadata: {
        name: 'letsencrypt-prod',
        namespace: 'cert-manager',
        annotations: {
          helmId: helmCertManager.id,
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
    { provider: k8sProvider },
  );
};
