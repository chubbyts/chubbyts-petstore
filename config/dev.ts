import prod, { Config } from './prod';

export default (env: string): Config => {
  const config = prod(env);

  return {
    ...config,
    cors: {
      ...config.cors,
      allowOrigins: { createAllowOriginRegex: [/^http?\:\/\/localhost(\:\d+)?$/] },
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
