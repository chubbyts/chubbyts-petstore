import production, { Config } from './production';

export default (env: string): Config => {
  const config = production(env);

  return {
    ...config,
    cors: {
      ...config.cors,
      allowOrigins: { createAllowOriginRegex: [/^https?\:\/\/(localhost|127\.\d+.\d+.\d+)(\:\d+)?$/] },
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
