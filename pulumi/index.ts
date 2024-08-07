import { realpathSync } from 'fs';
import * as pulumi from '@pulumi/pulumi';
import type * as k8s from '@pulumi/kubernetes';
import * as digitalocean from '@pulumi/digitalocean';
import {
  createAndPushImage,
  createContainerRegistry,
  createContainerRegistryDockerReadCredentials,
  createContainerRegistryDockerReadWriteCredentials,
} from './src/build';
import {
  createMongoDbCluster,
  createMongoDbDatabase,
  createMongoDbDatabaseUser,
  createMongoDbFirewall,
  resolveMongoDbUri,
} from './src/mongodb';
import { createVpc } from './src/network';
import {
  installK8sHelmCertManager,
  createK8sIngressNginx,
  installK8sHelmIngressNginxController,
  createK8sCluster,
  createK8sHttpDeployment,
  createK8sInternalHttpService,
  createK8sProvider,
  createK8sCertManager,
  installK8sDockerRegistrySecret,
  createK8sTokenKubeconfig,
  installK8sHelmMetricsServer,
  installK8sHelmKubernetesDashboard,
} from './src/k8s';
import { createOpensearchCluster, createOpensearchFirewall } from './src/opensearch';

type NodeFactoryProps = {
  k8sProvider: k8s.Provider;
  context: string;
  containerRegistry: digitalocean.ContainerRegistry;
  containerRegistryDockerReadWriteCredentials: digitalocean.ContainerRegistryDockerCredentials;
  mongoDbCluster: digitalocean.DatabaseCluster;
  opensearchCluster: digitalocean.DatabaseCluster;
  config: pulumi.Config;
  stack: string;
};

const nodeFactory = ({
  k8sProvider,
  context,
  containerRegistry,
  containerRegistryDockerReadWriteCredentials,
  mongoDbCluster,
  opensearchCluster,
  stack,
}: NodeFactoryProps): void => {
  const name = 'node';

  const labels = { appClass: name };

  const image = createAndPushImage({
    context,
    name,
    stack,
    containerRegistry,
    containerRegistryDockerReadWriteCredentials,
  });

  const fluentdImage = createAndPushImage({
    context,
    name: `${name}-fluentd`,
    stack,
    containerRegistry,
    containerRegistryDockerReadWriteCredentials,
  });

  const mongoDbDatabase = createMongoDbDatabase({ mongoDbCluster, name });
  const mongoDbDatabaseUser = createMongoDbDatabaseUser({ mongoDbCluster, name });

  createK8sHttpDeployment({
    k8sProvider,
    labels,
    image,
    env: [
      { name: 'NODE_ENV', value: 'production' },
      { name: 'MONGO_URI', value: resolveMongoDbUri({ mongoDbCluster, mongoDbDatabase, mongoDbDatabaseUser }) },
      { name: 'SERVER_HOST', value: '0.0.0.0' },
      { name: 'SERVER_PORT', value: '1234' },
    ],
    port: 1234,
    path: '/ping',
    replicas: 1,
    fluentdImage,
    fluentdEnv: [
      { name: 'STACK', value: stack },
      {
        name: 'OPENSEARCH_HOSTS',
        value: pulumi.interpolate`${opensearchCluster.privateHost}:${opensearchCluster.port}`,
      },
      { name: 'OPENSEARCH_USER', value: opensearchCluster.user },
      { name: 'OPENSEARCH_PASSWORD', value: opensearchCluster.password },
      { name: 'OPENSEARCH_SSL_VERIFY', value: 'true' },
    ],
    resources: {
      requests: {
        memory: '100Mi',
      },
      limits: {
        memory: '150Mi',
      },
    },
  });

  createK8sInternalHttpService({ k8sProvider, labels, port: 1234 });
};

type SwaggerUiFactoryProps = {
  k8sProvider: k8s.Provider;
};

const swaggerUiFactory = ({ k8sProvider }: SwaggerUiFactoryProps): void => {
  const name = 'swagger-ui';

  const labels = { appClass: name };

  createK8sHttpDeployment({
    k8sProvider,
    labels,
    image: 'swaggerapi/swagger-ui:v5.17.14',
    env: [
      { name: 'BASE_URL', value: '/swagger' },
      { name: 'URLS', value: "[ { url: '/openapi' } ]" },
    ],
    port: 8080,
    path: '/swagger',
    replicas: 1,
    resources: {
      requests: {
        memory: '50Mi',
      },
      limits: {
        memory: '50Mi',
      },
    },
  });

  createK8sInternalHttpService({ k8sProvider, labels, port: 8080 });
};

const config = new pulumi.Config();
const digitaloceanConfig = new pulumi.Config('digitalocean');

const region = digitalocean.Region.FRA1;
const stack = pulumi.getStack();

const context = realpathSync(`${process.cwd()}/../`);

// setup container registry
const containerRegistry = createContainerRegistry({ region, stack });
const containerRegistryDockerReadWriteCredentials = createContainerRegistryDockerReadWriteCredentials({
  containerRegistry,
});
const containerRegistryDockerReadCredentials = createContainerRegistryDockerReadCredentials({ containerRegistry });

// setup vpc
const vpc = createVpc({ region, ipRange: config.require('ip-range') });

// setup k8s cluster
const k8sCluster = createK8sCluster({ region, vpc, nodeCount: parseInt(config.require('k8s-node-count')) });
const k8sTokenKubeConfig = createK8sTokenKubeconfig({
  k8sCluster,
  user: 'admin',
  apiToken: digitaloceanConfig.require('token'),
});
const k8sProvider = createK8sProvider({ k8sTokenKubeConfig });
installK8sDockerRegistrySecret({ k8sProvider, containerRegistryDockerReadCredentials });

// setup databases
const mongoDbCluster = createMongoDbCluster({ region, vpc, nodeCount: parseInt(config.require('mongodb-node-count')) });
createMongoDbFirewall({ mongoDbCluster, k8sCluster });

const opensearchCluster = createOpensearchCluster({
  region,
  vpc,
  nodeCount: parseInt(config.require('opensearch-node-count')),
});
createOpensearchFirewall({ opensearchCluster, k8sCluster });

nodeFactory({
  k8sProvider,
  context,
  containerRegistry,
  containerRegistryDockerReadWriteCredentials,
  mongoDbCluster,
  opensearchCluster,
  config,
  stack,
});

swaggerUiFactory({ k8sProvider });

// install metrics server
installK8sHelmMetricsServer({ k8sProvider });

// install ingress controller (make sure the entry exists)
const helmIngressNginxController = installK8sHelmIngressNginxController({
  k8sProvider,
  doLoadbalancerHostname: 'kube.chubbyts-petstore.dev',
});

const ingress = createK8sIngressNginx({
  k8sProvider,
  helmIngressNginxController,
  rules: [
    {
      host: 'chubbyts-petstore.dev',
      http: {
        paths: [
          {
            path: '/api',
            pathType: 'Prefix',
            backend: {
              service: {
                name: 'node',
                port: {
                  number: 1234,
                },
              },
            },
          },
          {
            path: '/openapi',
            pathType: 'Prefix',
            backend: {
              service: {
                name: 'node',
                port: {
                  number: 1234,
                },
              },
            },
          },
          {
            path: '/ping',
            pathType: 'Prefix',
            backend: {
              service: {
                name: 'node',
                port: {
                  number: 1234,
                },
              },
            },
          },
          {
            path: '/swagger',
            pathType: 'Prefix',
            backend: {
              service: {
                name: 'swagger-ui',
                port: {
                  number: 8080,
                },
              },
            },
          },
        ],
      },
    },
  ],
  annotations: { 'nginx.ingress.kubernetes.io/configuration-snippet': 'rewrite ^/$ /swagger redirect;' },
  addWwwAliasForHosts: ['chubbyts-petstore.dev'],
});

// install cert manager
const helmCertManager = installK8sHelmCertManager({ k8sProvider });

createK8sCertManager({ k8sProvider, helmCertManager, email: config.require('cert-manager-email') });

// install kubernetes dashboard
const kubernetesDashboard = installK8sHelmKubernetesDashboard({ k8sProvider });

export const containerRegistryId = containerRegistry.id;
export const dns = pulumi.interpolate`Make sure to add A-Record for ${
  ingress.status.loadBalancer.ingress[0].hostname
} pointing to the IP provided by the related load balancer: https://cloud.digitalocean.com/networking/load_balancers. Make sure to add CNAME's for ${ingress.spec.tls.apply(
  (tls) => tls.flatMap(({ hosts }) => hosts).join(', '),
)} pointing to ${ingress.status.loadBalancer.ingress[0].hostname}`;
