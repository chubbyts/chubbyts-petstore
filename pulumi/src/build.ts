import * as pulumi from '@pulumi/pulumi';
import * as digitalocean from '@pulumi/digitalocean';
import * as docker from '@pulumi/docker';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

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

const calculateChecksum = (cwd: string): string => {
  const ignorePaths = readFileSync(`${cwd}/.dockerignore`, 'utf-8')
    .split('\n')
    .map((line) => {
      line = line.trim();

      if (line[line.length - 1] === '/') {
        line = line.substring(0, line.length - 2);
      }

      return line;
    })
    .filter((line) => line !== '' && line !== '/' && line[0] !== '#')
    .map((ignorePath) => `-path ./${ignorePath}`)
    .join(' -o ');

  const command = `find . \\( ${ignorePaths} \\) -prune -o -type f -exec sha1sum {} + | LC_ALL=C sort | sha1sum | cut -c 1-40`;

  const output = execSync(command, { cwd, encoding: 'utf-8' });

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
  const checksum = calculateChecksum(context);
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
