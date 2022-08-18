import * as pulumi from '@pulumi/pulumi';
import * as digitalocean from '@pulumi/digitalocean';
import { execSync } from 'child_process';

export const directoryChecksum = (cwd: string): string => {
  const output = execSync(`find . -type d \\( -path ./.git -o -path ./.stryker-tmp -o -path ./coverage -o -path ./database -o -path ./dist -o -path ./node_modules -o -path ./pulumi -o -path ./var \\) -prune -o -type f -exec md5sum {} + | LC_ALL=C sort | md5sum | cut -c 1-32`, {
    cwd,
    encoding: 'utf-8',
  });

  return output.trim();
};

const dockerImageExists = (repositoryTag: string): boolean => {
  const output = execSync(`docker images -q ${repositoryTag}`, {
    encoding: 'utf-8',
  });

  return output.trim() !== '';
};

const dockerBuildx = (cwd: string, name: string, repositoryTag: string): string => {
  const output = execSync(`docker buildx build -f docker/production/${name}/Dockerfile -t ${repositoryTag} .`, {
    cwd,
    encoding: 'utf-8',
  });

  return output.trim();
};

const dockerTag = (repositoryTag: string, remoteRepositoryTag: pulumi.Input<string>): pulumi.Output<string> => {
  return pulumi.output(remoteRepositoryTag).apply(resolvedTemoteRepositoryTag => {
    const output = execSync(`docker tag ${repositoryTag} ${resolvedTemoteRepositoryTag}`, {
      encoding: 'utf-8',
    });

    return output.trim();
  });
};

const dockerPush = (remoteRepositoryTag: pulumi.Input<string>): pulumi.Output<string> => {
  return pulumi.output(remoteRepositoryTag).apply(resolvedTemoteRepositoryTag => {
    const output = execSync(`docker push ${resolvedTemoteRepositoryTag}`, {
      encoding: 'utf-8',
    });

    return output.trim();
  });
};

export const buildDockerImage = (directory: string, name: string, imageTag: string): void => {
  const repositoryTag = `${name}:${imageTag}`;

  if (dockerImageExists(repositoryTag)) {
    return;
  }

  console.log(dockerBuildx(directory, name, repositoryTag));
};

export const pushDockerImage = (name: string, imageTag: string, repository: digitalocean.ContainerRegistry): pulumi.Output<string> => {
  const repositoryTag = `${name}:${imageTag}`;
  const remoteRepositoryTag = pulumi.interpolate`${repository.endpoint}/${name}:${imageTag}`;

  dockerTag(repositoryTag, remoteRepositoryTag);
  dockerPush(remoteRepositoryTag);

  return remoteRepositoryTag;
};

export const createContainerRegistry = (region: digitalocean.Region): digitalocean.ContainerRegistry => {
  return new digitalocean.ContainerRegistry('container-registry', {
    subscriptionTierSlug: 'basic',
    region,
  });
};
