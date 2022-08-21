import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import * as digitalocean from '@pulumi/digitalocean';
import { createContainerRegistry } from './src/build';
import { buildDockerImage, directoryChecksum, pushDockerImage } from './src/build';
import { createMongoDbCluster, createMongoDbFirewall } from './src/mongodb';
import { createVpc } from './src/network';
import {
  installHelmCertManager,
  createIngressNginx,
  installHelmIngressNginxController,
  createK8sCluster,
  createK8sHttpDeployment,
  createK8sInternalHttpService,
  createK8sProvider,
  createCertManager
} from './src/k8s';

const nodeFactory = (
  k8sProvider: k8s.Provider,
  directory: string,
  containerRegistry: digitalocean.ContainerRegistry,
  imageTag: string,
  k8sCluster: digitalocean.KubernetesCluster,
  region: digitalocean.Region,
  vpc: digitalocean.Vpc,
): {
  deployment: k8s.apps.v1.Deployment;
  internalService: k8s.core.v1.Service;
} => {
  const name = 'node';

  buildDockerImage(directory, name, imageTag);

  const image = pushDockerImage(name, imageTag, containerRegistry);

  const mongoDbCluster = createMongoDbCluster(region, vpc);

  createMongoDbFirewall(mongoDbCluster, k8sCluster);

  const labels = { appClass: name };

  const mongoUri = pulumi.all([mongoDbCluster.user, mongoDbCluster.password, mongoDbCluster.privateHost, mongoDbCluster.database])
    .apply(([user, password, host, db]) => `mongodb+srv://${user}:${password}@${host}/${db}?authMechanism=DEFAULT&authSource=admin`);

  const deployment = createK8sHttpDeployment(k8sProvider, labels, image, [
    { name: 'NODE_ENV', value: 'production' },
    { name: 'MONGO_URI', value: mongoUri },
    { name: 'SERVER_HOST', value: '0.0.0.0' },
    { name: 'SERVER_PORT', value: '10080' },
  ], 10080, '/ping');

  const internalService = createK8sInternalHttpService(k8sProvider, labels, 10080);

  return { deployment, internalService };
};

const swaggerUiFactory = (
  k8sProvider: k8s.Provider,
): {
  deployment: k8s.apps.v1.Deployment;
  internalService: k8s.core.v1.Service;
} => {
  const name = 'swagger-ui';

  const labels = { appClass: name };

  const deployment = createK8sHttpDeployment(k8sProvider, labels, 'swaggerapi/swagger-ui', [
    { name: 'BASE_URL', value: '/swagger' },
    { name: 'URLS', value: '[ { url: \'/openapi\' } ]' },
  ], 8080, '/swagger');

  const internalService = createK8sInternalHttpService(k8sProvider, labels, 8080);

  return { deployment, internalService };
};

const directory = `${process.cwd()}/../`;

let config = new pulumi.Config();

const region = digitalocean.Region.FRA1;

const imageTag = directoryChecksum(directory);

const containerRegistry = createContainerRegistry(region);

const vpc = createVpc(region);

const k8sCluster = createK8sCluster(region, vpc);
const k8sProvider = createK8sProvider(k8sCluster);

nodeFactory(k8sProvider, directory, containerRegistry, imageTag, k8sCluster, region, vpc);
swaggerUiFactory(k8sProvider);

installHelmIngressNginxController(k8sProvider);
installHelmCertManager(k8sProvider);

createCertManager(k8sProvider, config.require('certManagerEmail'));

const ingress = createIngressNginx(k8sProvider, [
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
]);

export const ingressIp = ingress.status.loadBalancer.ingress[0].ip;
