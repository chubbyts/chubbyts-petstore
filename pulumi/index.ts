import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import * as digitalocean from '@pulumi/digitalocean';
import { createContainerRegistry, createContainerRegistryDockerCredentials } from './src/build';
import { buildDockerImage, directoryChecksum, pushDockerImage } from './src/build';
import { createMongoDbCluster, createMongoDbFirewall } from './src/mongodb';
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

const nodeFactory = (
  k8sProvider: k8s.Provider,
  directory: string,
  containerRegistry: digitalocean.ContainerRegistry,
  imageTag: string,
  k8sCluster: digitalocean.KubernetesCluster,
  region: digitalocean.Region,
  vpc: digitalocean.Vpc,
): void => {
  const name = 'node';

  buildDockerImage(directory, name, imageTag);

  const image = pushDockerImage(name, imageTag, containerRegistry);

  const mongoDbCluster = createMongoDbCluster(region, vpc);

  createMongoDbFirewall(mongoDbCluster, k8sCluster);

  const labels = { appClass: name };

  const mongoUri = pulumi
    .all([mongoDbCluster.user, mongoDbCluster.password, mongoDbCluster.privateHost, mongoDbCluster.database])
    .apply(
      ([user, password, host, db]) =>
        `mongodb+srv://${user}:${password}@${host}/${db}?authMechanism=DEFAULT&authSource=admin`,
    );

  const deployment = createK8sHttpDeployment(
    k8sProvider,
    labels,
    containerRegistry,
    image,
    [
      { name: 'NODE_ENV', value: 'production' },
      { name: 'MONGO_URI', value: mongoUri },
      { name: 'SERVER_HOST', value: '0.0.0.0' },
      { name: 'SERVER_PORT', value: '10080' },
    ],
    10080,
    '/ping',
  );

  const internalService = createK8sInternalHttpService(k8sProvider, labels, 10080);
};

const swaggerUiFactory = (k8sProvider: k8s.Provider): void => {
  const name = 'swagger-ui';

  const labels = { appClass: name };

  const deployment = createK8sHttpDeployment(
    k8sProvider,
    labels,
    containerRegistry,
    'swaggerapi/swagger-ui',
    [
      { name: 'BASE_URL', value: '/swagger' },
      { name: 'URLS', value: "[ { url: '/openapi' } ]" },
    ],
    8080,
    '/swagger',
  );

  const internalService = createK8sInternalHttpService(k8sProvider, labels, 8080);
};

const directory = `${process.cwd()}/../`;

let config = new pulumi.Config();

const region = digitalocean.Region.FRA1;

const imageTag = directoryChecksum(directory);

const containerRegistry = createContainerRegistry(region);
const containerRegistryDockerCredentials = createContainerRegistryDockerCredentials(containerRegistry);

const vpc = createVpc(region);

const k8sCluster = createK8sCluster(region, vpc);
const k8sProvider = createK8sProvider(k8sCluster);

createK8sDockerRegistrySecret(k8sProvider, containerRegistry, containerRegistryDockerCredentials);

nodeFactory(k8sProvider, directory, containerRegistry, imageTag, k8sCluster, region, vpc);
swaggerUiFactory(k8sProvider);

const helmCertManager = installK8sHelmCertManager(k8sProvider);

createK8sCertManager(k8sProvider, helmCertManager, config.require('certManagerEmail'));

const helmIngressNginxController = installK8sHelmIngressNginxController(k8sProvider);

const ingress = createK8sIngressNginx(k8sProvider, helmIngressNginxController, [
  {
    host: 'chubbyts-petstore.dev',
    http: {
      paths: [
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
        {
          path: '/',
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
      ],
    },
  },
]);

export const ingressIp = ingress.status.loadBalancer.ingress[0].ip;
