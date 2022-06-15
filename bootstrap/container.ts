import { existsSync, mkdirSync } from 'fs';
import { Config } from '../config/prod';
import { Container } from '@chubbyts/chubbyts-dic-types/dist/container';
import { createContainerByConfigFactory } from '@chubbyts/chubbyts-dic-config/dist/dic-config';

export default (env: string): Container => {
  const config: Config = require(`../config/${env}`).default(env);

  config.directories.forEach((directory) => {
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }
  });

  const containerByConfigFactory = createContainerByConfigFactory(config);

  return containerByConfigFactory();
};
