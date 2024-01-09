import * as digitalocean from '@pulumi/digitalocean';
import * as pulumi from '@pulumi/pulumi';

type CreateMongoDbClusterProps = {
  region: digitalocean.Region;
  vpc: digitalocean.Vpc;
  nodeCount?: number;
};

export const createMongoDbCluster = ({
  region,
  vpc,
  nodeCount = 1,
}: CreateMongoDbClusterProps): digitalocean.DatabaseCluster => {
  return new digitalocean.DatabaseCluster('mongo-cluster', {
    engine: 'mongodb',
    version: '6',
    region,
    size: digitalocean.DatabaseSlug.DB_1VPCU1GB,
    nodeCount,
    privateNetworkUuid: vpc.id,
  });
};

type CreateMongoDbFirewallProps = {
  mongoDbCluster: digitalocean.DatabaseCluster;
  k8sCluster: digitalocean.KubernetesCluster;
  whitelistIpAdresses?: Array<string>;
};

export const createMongoDbFirewall = ({
  mongoDbCluster,
  k8sCluster,
  whitelistIpAdresses = [],
}: CreateMongoDbFirewallProps) => {
  return new digitalocean.DatabaseFirewall('mongo-firewall', {
    clusterId: mongoDbCluster.id,
    rules: [
      { type: 'k8s', value: k8sCluster.id },
      ...whitelistIpAdresses.map((ipAddress) => ({ type: 'ip_addr', value: ipAddress })),
    ],
  });
};

type CreateMongoDbDatabaseProps = {
  mongoDbCluster: digitalocean.DatabaseCluster;
  name: string;
};

export const createMongoDbDatabase = ({
  mongoDbCluster,
  name,
}: CreateMongoDbDatabaseProps): digitalocean.DatabaseDb => {
  return new digitalocean.DatabaseDb(`mongo-database-${name}`, { clusterId: mongoDbCluster.id, name });
};

type CreateMongoDbDatabaseUserProps = {
  mongoDbCluster: digitalocean.DatabaseCluster;
  name: string;
};

export const createMongoDbDatabaseUser = ({
  mongoDbCluster,
  name,
}: CreateMongoDbDatabaseUserProps): digitalocean.DatabaseUser => {
  return new digitalocean.DatabaseUser(`mongo-database-user-${name}`, { clusterId: mongoDbCluster.id, name });
};

type ResolveMongoDbUriProps = {
  mongoDbCluster: digitalocean.DatabaseCluster;
  mongoDbDatabase: digitalocean.DatabaseDb;
  mongoDbDatabaseUser: digitalocean.DatabaseUser;
};

export const resolveMongoDbUri = ({
  mongoDbCluster,
  mongoDbDatabase,
  mongoDbDatabaseUser,
}: ResolveMongoDbUriProps): pulumi.Output<string> => {
  return pulumi.interpolate`mongodb+srv://${mongoDbDatabaseUser.name}:${mongoDbDatabaseUser.password}@${mongoDbCluster.privateHost}/${mongoDbDatabase.name}?tls=true&authSource=admin&replicaSet=${mongoDbCluster.name}`;
};
