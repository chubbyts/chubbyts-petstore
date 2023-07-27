import { configFactory as developmentConfigFactory } from './development.js';
import type { Config } from './production.js';

export const configFactory = (env: string): Config => {
  return developmentConfigFactory(env);
};
