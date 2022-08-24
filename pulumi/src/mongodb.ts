import * as digitalocean from '@pulumi/digitalocean';

export const createMongoDbCluster = (
  region: digitalocean.Region,
  vpc: digitalocean.Vpc,
): digitalocean.DatabaseCluster => {
  return new digitalocean.DatabaseCluster('mongo-cluster', {
    engine: 'mongodb',
    version: '4',
    region,
    size: digitalocean.DatabaseSlug.DB_1VPCU1GB,
    nodeCount: 1, // or 3
    privateNetworkUuid: vpc.id,
  });
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
