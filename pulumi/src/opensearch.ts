import * as digitalocean from '@pulumi/digitalocean';

type CreateOpensearchClusterProps = {
  region: digitalocean.Region;
  vpc: digitalocean.Vpc;
  nodeCount?: number;
};

export const createOpensearchCluster = ({
  region,
  vpc,
  nodeCount = 1,
}: CreateOpensearchClusterProps): digitalocean.DatabaseCluster => {
  return new digitalocean.DatabaseCluster('opensearch-cluster', {
    engine: 'opensearch',
    version: '2',
    region,
    size: digitalocean.DatabaseSlug.DB_1VPCU2GB,
    nodeCount,
    privateNetworkUuid: vpc.id,
  });
};

type CreateOpensearchFirewallProps = {
  opensearchCluster: digitalocean.DatabaseCluster;
  k8sCluster: digitalocean.KubernetesCluster;
  whitelistIpAdresses?: Array<string>;
};

export const createOpensearchFirewall = ({
  opensearchCluster,
  k8sCluster,
  whitelistIpAdresses = [],
}: CreateOpensearchFirewallProps) => {
  return new digitalocean.DatabaseFirewall('opensearch-firewall', {
    clusterId: opensearchCluster.id,
    rules: [
      { type: 'k8s', value: k8sCluster.id },
      ...whitelistIpAdresses.map((ipAddress) => ({ type: 'ip_addr', value: ipAddress })),
    ],
  });
};
