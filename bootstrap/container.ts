import { existsSync, mkdirSync } from 'fs';
import type { Container } from '@chubbyts/chubbyts-dic-types/dist/container';
import { createContainerByConfigFactory } from '@chubbyts/chubbyts-dic-config/dist/dic-config';
import type { Config } from '../config/production.js';

export const containerFactory = async (env: string): Promise<Container> => {
  const config: Config = (await import(`../config/${env}.js`)).configFactory(env);

  config.directories.forEach((directory) => {
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }
  });

  const containerByConfigFactory = createContainerByConfigFactory(config);

  return containerByConfigFactory();
};
