import * as digitalocean from '@pulumi/digitalocean';
import type * as pulumi from '@pulumi/pulumi';
import type { input as inputs } from '@pulumi/digitalocean/types';

type CreateSpacesBucketProps = {
  bucketName: string;
  region: digitalocean.Region;
  corsRules?: pulumi.Input<pulumi.Input<inputs.SpacesBucketCorsRule>[]>;
};

export const createSpacesBucket = ({
  bucketName,
  region,
  corsRules = undefined,
}: CreateSpacesBucketProps): digitalocean.SpacesBucket => {
  return new digitalocean.SpacesBucket(`${bucketName}-space-bucket`, {
    name: bucketName,
    region,
    acl: 'public-read',
    corsRules,
  });
};
