import { configFactory as developmentConfigFactory } from './development';
import { Config } from './production';

export const configFactory = (env: string): Config => {
  return developmentConfigFactory(env);
};
