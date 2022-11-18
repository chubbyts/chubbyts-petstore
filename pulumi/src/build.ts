import * as pulumi from '@pulumi/pulumi';
import * as digitalocean from '@pulumi/digitalocean';
import * as docker from '@pulumi/docker';

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

type DockerCredentials = {
  auths: {
    [host: string]: {
      auth: string;
    };
  };
};

export const createAndPushImage = (
  directory: string,
  name: string,
  containerRegistry: digitalocean.ContainerRegistry,
  containerRegistryDockerCredentials: digitalocean.ContainerRegistryDockerCredentials,
): pulumi.Output<string> => {
  const localImageName = `${name}`;
  const imageName = pulumi.interpolate`${containerRegistry.endpoint}/${localImageName}`;

  return containerRegistryDockerCredentials.dockerCredentials.apply((dockerCredentials) => {
    const parsedDockerCredentials = JSON.parse(dockerCredentials) as DockerCredentials;

    const server = Object.keys(parsedDockerCredentials.auths)[0];
    const auth = parsedDockerCredentials.auths[server].auth;
    const username = Buffer.from(auth, 'base64').toString('utf-8').split(':')[0];
    const password = username;

    return new docker.Image(name, {
      imageName,
      localImageName,
      build: {
        context: `${directory}/${name}`,
        dockerfile: `${directory}/${name}/docker/production/Dockerfile`,
      },
      registry: {
        server,
        username,
        password,
      },
    });
  }).imageName;
};
