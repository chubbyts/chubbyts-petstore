import type { Config } from './production.js';
import { configFactory as productionConfigFactory } from './production.js';

export const configFactory = (env: string): Config => {
  const config = productionConfigFactory(env);

  return {
    ...config,
    cors: {
      ...config.cors,
      allowOrigins: { createAllowOriginRegex: [/^https?:\/\/(localhost|127\.\d+.\d+.\d+)(:\d+)?$/] },
    },
    debug: true,
    pino: {
      ...config.pino,
      options: {
        ...config.pino.options,
        level: 'debug',
      },
    },
  };
};
