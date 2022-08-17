import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';
import * as digitalocean from '@pulumi/digitalocean';
import { createContainerRegistry } from './src/build';
import { buildDockerImage, directoryChecksum, pushDockerImage } from './src/build';
import { createMongoDbCluster, createMongoDbFirewall } from './src/mongodb';
import { createVpc } from './src/network';
import { createK8sCluster, createK8sExternalHttpService, createK8sHttpDeployment, createK8sInternalHttpService, createK8sProvider } from './src/k8s';

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
  nginxIp: pulumi.Output<string>,
): {
  deployment: k8s.apps.v1.Deployment;
  internalService: k8s.core.v1.Service;
} => {
  const name = 'swagger-ui';

  const labels = { appClass: name };

  const swaggerJsonUrl = pulumi.interpolate`https://${nginxIp}/openapi`;

  const deployment = createK8sHttpDeployment(k8sProvider, labels, 'swaggerapi/swagger-ui', [
    { name: 'BASE_URL', value: '/swagger' },
    { name: 'SWAGGER_JSON_URL', value: swaggerJsonUrl },
  ], 8080, '/swagger');

  const internalService = createK8sInternalHttpService(k8sProvider, labels, 8080);

  return { deployment, internalService };
};

const nginxFactory = (
  k8sProvider: k8s.Provider,
  directory: string,
  containerRegistry: digitalocean.ContainerRegistry,
  imageTag: string,
): {
  deployment: k8s.apps.v1.Deployment;
  externalService: k8s.core.v1.Service;
} => {
  const name = 'nginx';

  buildDockerImage(directory, name, imageTag);

  const image = pushDockerImage(name, imageTag, containerRegistry);

  const labels = { appClass: name };

  const deployment = createK8sHttpDeployment(k8sProvider, labels, image, [
    { name: 'SERVER_PORT', value: '10443' },
    { name: 'NODE_SERVER_HOST', value: 'node' },
    { name: 'NODE_SERVER_PORT', value: '10080' },
    { name: 'SWAGGER_SERVER_HOST', value: 'swagger-ui' },
    { name: 'SWAGGER_SERVER_PORT', value: '8080' },
  ], 10443, '/swagger', 'HTTPS');

  const externalService = createK8sExternalHttpService(k8sProvider, labels, 10443, 443);

  return { deployment, externalService };
};

const directory = `${process.cwd()}/../`;

const region = digitalocean.Region.FRA1;

const imageTag = directoryChecksum(directory);

const containerRegistry = createContainerRegistry(region);

const vpc = createVpc(region);

const k8sCluster = createK8sCluster(region, vpc);
const k8sProvider = createK8sProvider(k8sCluster);

nodeFactory(k8sProvider, directory, containerRegistry, imageTag, k8sCluster, region, vpc);

const nginx = nginxFactory(k8sProvider, directory, containerRegistry, imageTag);

export const nginxIp = nginx.externalService.status.loadBalancer.ingress[0].ip;

swaggerUiFactory(k8sProvider, nginxIp);
