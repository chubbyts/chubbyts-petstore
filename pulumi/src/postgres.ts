import * as digitalocean from '@pulumi/digitalocean';
import * as pulumi from '@pulumi/pulumi';

type CreatePostgresClusterProps = {
  region: digitalocean.Region;
  vpc: digitalocean.Vpc;
  nodeCount?: number;
};

export const createPostgresCluster = ({
  region,
  vpc,
  nodeCount = 1,
}: CreatePostgresClusterProps): digitalocean.DatabaseCluster => {
  return new digitalocean.DatabaseCluster('postgres-cluster', {
    engine: 'postgres',
    version: '17',
    region,
    size: digitalocean.DatabaseSlug.DB_1VPCU1GB,
    nodeCount,
    privateNetworkUuid: vpc.id,
  });
};

type CreatePostgresFirewallProps = {
  postgresCluster: digitalocean.DatabaseCluster;
  k8sCluster: digitalocean.KubernetesCluster;
  whitelistIpAdresses?: Array<string>;
};

export const createPostgresFirewall = ({
  postgresCluster,
  k8sCluster,
  whitelistIpAdresses = [],
}: CreatePostgresFirewallProps) => {
  return new digitalocean.DatabaseFirewall('postgres-firewall', {
    clusterId: postgresCluster.id,
    rules: [
      { type: 'k8s', value: k8sCluster.id },
      ...whitelistIpAdresses.map((ipAddress) => ({ type: 'ip_addr', value: ipAddress })),
    ],
  });
};

type CreatePostgresDatabaseProps = {
  postgresCluster: digitalocean.DatabaseCluster;
  name: string;
};

export const createPostgresDatabase = ({
  postgresCluster,
  name,
}: CreatePostgresDatabaseProps): digitalocean.DatabaseDb => {
  return new digitalocean.DatabaseDb(`postgres-database-${name}`, { clusterId: postgresCluster.id, name });
};

type CreatePostgresDatabaseUserProps = {
  postgresCluster: digitalocean.DatabaseCluster;
  name: string;
};

export const createPostgresDatabaseUser = ({
  postgresCluster,
  name,
}: CreatePostgresDatabaseUserProps): digitalocean.DatabaseUser => {
  return new digitalocean.DatabaseUser(`postgres-database-user-${name}`, { clusterId: postgresCluster.id, name });
};

type ResolvePostgresUriProps = {
  postgresCluster: digitalocean.DatabaseCluster;
  postgresDatabase: digitalocean.DatabaseDb;
  postgresDatabaseUser: digitalocean.DatabaseUser;
};

export const resolvePostgresUri = ({
  postgresCluster,
  postgresDatabase,
  postgresDatabaseUser,
}: ResolvePostgresUriProps): pulumi.Output<string> => {
  return pulumi.interpolate`postgres://${postgresDatabaseUser.name}:${postgresDatabaseUser.password}@${postgresCluster.privateHost}/${postgresDatabase.name}`;
};
