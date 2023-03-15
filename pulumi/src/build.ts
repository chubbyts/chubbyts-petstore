import * as pulumi from '@pulumi/pulumi';
import * as digitalocean from '@pulumi/digitalocean';
import * as docker from '@pulumi/docker';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

export const calculateTag = (context: string): string => {
  const ignorePaths = readFileSync(`${context}/.dockerignore`, 'utf-8')
    .split('\n')
    .map((line) => {
      line = line.trim();

      if (line[line.length - 1] === '/') {
        line = line.substring(0, line.length - 2);
      }

      return line;
    })
    .filter((line) => line !== '' && line[0] !== '#')
    .map((ignorePath) => `-path ./${ignorePath}`)
    .join(' -o ');

  const command = `find . \\( ${ignorePaths} \\) -prune -o -type f -exec sha1sum {} + | LC_ALL=C sort | sha1sum | cut -c 1-40`;

  const output = execSync(command, { cwd: context, encoding: 'utf-8' });

  return output.trim();
};

type createContainerRegistryProps = {
  region: digitalocean.Region;
  stack: string;
};

export const createContainerRegistry = ({
  region,
  stack,
}: createContainerRegistryProps): digitalocean.ContainerRegistry => {
  if (stack !== 'dev') {
    const staging = new pulumi.StackReference('chubbyts-petstore/dev');

    return digitalocean.ContainerRegistry.get('container-registry', staging.getOutput('containerRegistryId'));
  }

  return new digitalocean.ContainerRegistry('container-registry', {
    subscriptionTierSlug: 'basic',
    region,
  });
};

type CreateContainerRegistryDockerReadCredentialsProps = {
  containerRegistry: digitalocean.ContainerRegistry;
};

export const createContainerRegistryDockerReadCredentials = ({
  containerRegistry,
}: CreateContainerRegistryDockerReadCredentialsProps): digitalocean.ContainerRegistryDockerCredentials => {
  return new digitalocean.ContainerRegistryDockerCredentials('container-registry-credentials-read', {
    registryName: containerRegistry.name,
    write: false,
  });
};

type CreateContainerRegistryDockerReadWriteCredentials = {
  containerRegistry: digitalocean.ContainerRegistry;
};

export const createContainerRegistryDockerReadWriteCredentials = ({
  containerRegistry,
}: CreateContainerRegistryDockerReadWriteCredentials): digitalocean.ContainerRegistryDockerCredentials => {
  return new digitalocean.ContainerRegistryDockerCredentials('container-registry-credentials-read-write', {
    registryName: containerRegistry.name,
    write: true,
  });
};

type DockerCredentials = {
  auths: {
    [host: string]: {
      auth: string;
    };
  };
};

type CreateAndPushImageProps = {
  name: string;
  tag: string;
  context: string;
  containerRegistry: digitalocean.ContainerRegistry;
  containerRegistryDockerReadWriteCredentials: digitalocean.ContainerRegistryDockerCredentials;
};

export const createAndPushImage = ({
  name,
  tag,
  context,
  containerRegistry,
  containerRegistryDockerReadWriteCredentials,
}: CreateAndPushImageProps): pulumi.Output<string> => {
  const imageName = pulumi.interpolate`${containerRegistry.endpoint}/${name}:${tag}`;

  return containerRegistryDockerReadWriteCredentials.dockerCredentials.apply((dockerCredentials): string => {
    const parsedDockerCredentials = JSON.parse(dockerCredentials) as DockerCredentials;

    const server = Object.keys(parsedDockerCredentials.auths)[0];
    const auth = parsedDockerCredentials.auths[server].auth;
    const [username, password] = Buffer.from(auth, 'base64').toString('utf-8').split(':');

    return new docker.Image(name, {
      imageName,
      build: {
        context,
        dockerfile: `docker/production/${name}/Dockerfile`,
        platform: 'linux/amd64',
      },
      registry: {
        server,
        username,
        password,
      },
    }).imageName as unknown as string;
  });
};
