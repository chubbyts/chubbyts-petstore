import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import * as digitalocean from '@pulumi/digitalocean';
import {
  createAndPushImage,
  createContainerRegistry,
  createContainerRegistryDockerReadCredentials,
  createContainerRegistryDockerReadWriteCredentials,
} from './src/build';
import { createMongoDbCluster, createMongoDbFirewall, resolveMongoDbUri } from './src/mongodb';
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
  createK8sDockerRegistrySecret,
} from './src/k8s';
import { realpathSync } from 'fs';

const nodeFactory = (
  k8sProvider: k8s.Provider,
  directory: string,
  containerRegistry: digitalocean.ContainerRegistry,
  containerRegistryDockerCredentials: digitalocean.ContainerRegistryDockerCredentials,
  k8sCluster: digitalocean.KubernetesCluster,
  region: digitalocean.Region,
  vpc: digitalocean.Vpc,
): void => {
  const name = 'node';

  const image = createAndPushImage(name, directory, containerRegistry, containerRegistryDockerCredentials);

  const mongoDbCluster = createMongoDbCluster(region, vpc);

  createMongoDbFirewall(mongoDbCluster, k8sCluster);

  const labels = { appClass: name };

  createK8sHttpDeployment(
    k8sProvider,
    labels,
    image,
    [
      { name: 'NODE_ENV', value: 'production' },
      { name: 'MONGO_URI', value: resolveMongoDbUri(mongoDbCluster) },
      { name: 'SERVER_HOST', value: '0.0.0.0' },
      { name: 'SERVER_PORT', value: '10080' },
    ],
    10080,
    '/ping',
  );

  createK8sInternalHttpService(k8sProvider, labels, 10080);
};

const swaggerUiFactory = (k8sProvider: k8s.Provider): void => {
  const name = 'swagger-ui';

  const labels = { appClass: name };

  createK8sHttpDeployment(
    k8sProvider,
    labels,
    'swaggerapi/swagger-ui',
    [
      { name: 'BASE_URL', value: '/swagger' },
      { name: 'URLS', value: "[ { url: '/openapi' } ]" },
    ],
    8080,
    '/swagger',
    1,
  );

  createK8sInternalHttpService(k8sProvider, labels, 8080);
};

const directory = realpathSync(`${process.cwd()}/../`);

let config = new pulumi.Config();

const region = digitalocean.Region.FRA1;

const containerRegistry = createContainerRegistry(region);
const containerRegistryDockerReadWriteCredentials =
  createContainerRegistryDockerReadWriteCredentials(containerRegistry);
const containerRegistryDockerReadCredentials = createContainerRegistryDockerReadCredentials(containerRegistry);

const vpc = createVpc(region);

const k8sCluster = createK8sCluster(region, vpc);
const k8sProvider = createK8sProvider(k8sCluster);

createK8sDockerRegistrySecret(k8sProvider, containerRegistryDockerReadCredentials);

nodeFactory(
  k8sProvider,
  directory,
  containerRegistry,
  containerRegistryDockerReadWriteCredentials,
  k8sCluster,
  region,
  vpc,
);

swaggerUiFactory(k8sProvider);

const helmCertManager = installK8sHelmCertManager(k8sProvider);

createK8sCertManager(k8sProvider, helmCertManager, config.require('certManagerEmail'));

const helmIngressNginxController = installK8sHelmIngressNginxController(k8sProvider);

const ingress = createK8sIngressNginx(
  k8sProvider,
  helmIngressNginxController,
  [
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
                  number: 10080,
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
                  number: 10080,
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
                  number: 10080,
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
  { 'nginx.ingress.kubernetes.io/configuration-snippet': 'rewrite ^/$ /swagger redirect;' },
);

export const ingressIp = ingress.status.loadBalancer.ingress[0].ip;
