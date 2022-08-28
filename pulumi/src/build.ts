import * as pulumi from '@pulumi/pulumi';
import * as digitalocean from '@pulumi/digitalocean';
import * as docker from '@pulumi/docker';
import { execSync } from 'child_process';

export const createContainerRegistry = (region: digitalocean.Region): digitalocean.ContainerRegistry => {
  return new digitalocean.ContainerRegistry('container-registry', {
    subscriptionTierSlug: 'basic',
    region,
  });
};

export const createContainerRegistryDockerReadCredentials = (
  registry: digitalocean.ContainerRegistry,
): digitalocean.ContainerRegistryDockerCredentials => {
  return new digitalocean.ContainerRegistryDockerCredentials('container-registry-credentials-read', {
    registryName: registry.name,
    write: false,
  });
};

export const createContainerRegistryDockerReadWriteCredentials = (
  registry: digitalocean.ContainerRegistry,
): digitalocean.ContainerRegistryDockerCredentials => {
  return new digitalocean.ContainerRegistryDockerCredentials('container-registry-credentials-read-write', {
    registryName: registry.name,
    write: true,
  });
};

export const directoryChecksum = (cwd: string): string => {
  const ignorePaths = [
    './.git',
    './.github',
    './.gitignore',
    './.stryker-tmp',
    './coverage',
    './database',
    './dist',
    './docker-compose.ci.yml',
    './docker-compose.yml',
    './docker/development',
    './LICENSE',
    './node_modules',
    './nodemon.json',
    './pulumi',
    './README.md',
    './sonar-project.properties',
    './var',
  ];

  const flatIgnorePaths = ignorePaths.map((ignorePath) => `-path ${ignorePath}`).join(' -o ');

  const output = execSync(
    `find . \\( ${flatIgnorePaths} \\) -prune -o -type f -exec sha1sum {} + | LC_ALL=C sort | sha1sum | cut -c 1-32`,
    {
      cwd,
      encoding: 'utf-8',
    },
  );

  return output.trim();
};

type DockerCredentials = {
  auths: {
    [host: string]: {
      auth: string;
    };
  };
};

export const createAndPushImage = (
  name: string,
  context: string,
  containerRegistry: digitalocean.ContainerRegistry,
  containerRegistryDockerCredentials: digitalocean.ContainerRegistryDockerCredentials,
): pulumi.Output<string> => {
  const checksum = directoryChecksum(context);
  const localImageName = `${name}:sha1-${checksum}`;
  const imageName = pulumi.interpolate`${containerRegistry.endpoint}/${localImageName}`;

  containerRegistryDockerCredentials.dockerCredentials.apply((dockerCredentials) => {
    const parsedDockerCredentials = JSON.parse(dockerCredentials) as DockerCredentials;

    const server = Object.keys(parsedDockerCredentials.auths)[0];
    const auth = parsedDockerCredentials.auths[server].auth;
    const username = Buffer.from(auth, 'base64').toString('utf-8').split(':')[0];
    const password = username;

    new docker.Image(name, {
      imageName,
      localImageName,
      build: {
        dockerfile: `${context}/docker/production/${name}/Dockerfile`,
        context,
      },
      registry: {
        server,
        username,
        password,
      },
    });
  });

  return imageName;
};
