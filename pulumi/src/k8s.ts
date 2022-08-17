import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';
import * as digitalocean from '@pulumi/digitalocean';

export const createK8sCluster = (region: digitalocean.Region, vpc: digitalocean.Vpc): digitalocean.KubernetesCluster => {
  return new digitalocean.KubernetesCluster('k8s-cluster', {
    nodePool: {
      name: 'default',
      size: digitalocean.DropletSlug.DropletS1VCPU2GB,
      nodeCount: 1,
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
      replicas: 1,
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
