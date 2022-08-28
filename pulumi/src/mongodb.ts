import * as digitalocean from '@pulumi/digitalocean';
import * as pulumi from '@pulumi/pulumi';

export const createMongoDbCluster = (
  region: digitalocean.Region,
  vpc: digitalocean.Vpc,
): digitalocean.DatabaseCluster => {
  return new digitalocean.DatabaseCluster('mongo-cluster', {
    engine: 'mongodb',
    version: '5',
    region,
    size: digitalocean.DatabaseSlug.DB_1VPCU1GB,
    nodeCount: 1, // or 3
    privateNetworkUuid: vpc.id,
  });
};

export const resolveMongoDbUri = (mongoDbCluster: digitalocean.DatabaseCluster): pulumi.Output<string> => {
  return pulumi.interpolate`mongodb+srv://${mongoDbCluster.user}:${mongoDbCluster.password}@${mongoDbCluster.privateHost}/petstore?tls=true&authSource=admin&replicaSet=${mongoDbCluster.name}`;
};

export const createMongoDbFirewall = (
  mongoDbCluster: digitalocean.DatabaseCluster,
  k8sCluster: digitalocean.KubernetesCluster,
) => {
  return new digitalocean.DatabaseFirewall('mongo-firewall', {
    clusterId: mongoDbCluster.id,
    rules: [{ type: 'k8s', value: k8sCluster.id }],
  });
};
