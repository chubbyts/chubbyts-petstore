import * as digitalocean from '@pulumi/digitalocean';

type CreateVpcProps = {
  region: digitalocean.Region;
  ipRange: string;
};

export const createVpc = ({ region, ipRange }: CreateVpcProps): digitalocean.Vpc => {
  return new digitalocean.Vpc('vpc', {
    ipRange,
    region,
  });
};
