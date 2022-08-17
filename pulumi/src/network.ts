import * as digitalocean from '@pulumi/digitalocean';

export const createVpc = (region: digitalocean.Region): digitalocean.Vpc => {
  return new digitalocean.Vpc('vpc', {
    ipRange: '10.10.11.0/24',
    region,
  });
};
