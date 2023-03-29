import { existsSync, mkdirSync } from 'fs';
import type { Container } from '@chubbyts/chubbyts-dic-types/dist/container';
import { createContainerByConfigFactory } from '@chubbyts/chubbyts-dic-config/dist/dic-config';
import type { Config } from '../config/production';

export const containerFactory = (env: string): Container => {
  /* eslint-disable @typescript-eslint/no-var-requires */
  const config: Config = require(`../config/${env}`).configFactory(env);

  config.directories.forEach((directory) => {
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true });
    }
  });

  const containerByConfigFactory = createContainerByConfigFactory(config);

  return containerByConfigFactory();
};
