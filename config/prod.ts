import { DestinationStream, LoggerOptions } from 'pino';
import { createWriteStream, realpathSync, WriteStream } from 'fs';
import { ConfigDelegator, ConfigFactory } from '@chubbyts/chubbyts-dic-config/dist/dic-config';
import {
  acceptNegotiationMiddlewareServiceFactory,
  acceptNegotiatorServiceFactory,
  apiErrorMiddlewareServiceFactory,
  cleanDirectoriesCommandServiceFactory,
  contentTypeNegotiationMiddlewareServiceFactory,
  contentTypeNegotiatorServiceFactory,
  decoderServiceFactory,
  encoderServiceFactory,
  errorMiddlewareServiceFactory,
  loggerServiceFactory,
  matchServiceFactory,
  middlewaresServiceFactory,
  mongoClientServiceFactory,
  pingHandlerServiceFactory,
  requestFactoryServiceFactory,
  responseFactoryServiceFactory,
  routeMatcherMiddlewareServiceFactory,
  routesServiceFactory,
  serverRequestFactoryServiceFactory,
  streamFactoryServiceFactory,
  streamFromResourceFactoryServiceFactory,
  uriFactoryServiceFactory,
} from '../src/service-factory';
import {
  petCreateHandlerServiceFactory,
  petFindByIdServiceFactory,
  petResolveListServiceFactory,
  petListHandlerServiceFactory,
  petPersistServiceFactory,
  petReadHandlerServiceFactory,
  petUpdateHandlerServiceFactory,
  petDeleteHandlerServiceFactory,
  petRemoveServiceFactory,
  petRoutesServiceDelegator,
} from '../src/pet/service-factory';
import { IndexesByCollection } from '@chubbyts/chubbyts-mongodb/dist/mongo';

export type Config = {
  debug: boolean;
  dependencies: {
    factories: Map<string, ConfigFactory>;
    delegators: Map<string, Array<ConfigDelegator>>;
  };
  directories: Map<string, string>;
  mongodb: {
    uri: string;
    indexes: IndexesByCollection;
  };
  pino: {
    options: Omit<LoggerOptions, 'level'> & { level: 'fatal' | 'error' | 'warn' | 'info' | 'debug' };
    stream: DestinationStream;
  };
  server: {
    host: string;
    port: number;
  };
};

const rootDir = realpathSync(__dirname + '/..');

export default (_env: string): Config => {
  const cacheDir = rootDir + '/var/cache';
  const logDir = rootDir + '/var/log';

  let logStream: WriteStream | undefined;

  return {
    debug: false,
    dependencies: {
      factories: new Map<string, ConfigFactory>([
        ['acceptNegotiationMiddleware', acceptNegotiationMiddlewareServiceFactory],
        ['acceptNegotiator', acceptNegotiatorServiceFactory],
        ['apiErrorMiddleware', apiErrorMiddlewareServiceFactory],
        ['cleanDirectoriesCommand', cleanDirectoriesCommandServiceFactory],
        ['contentTypeNegotiationMiddleware', contentTypeNegotiationMiddlewareServiceFactory],
        ['contentTypeNegotiator', contentTypeNegotiatorServiceFactory],
        ['decoder', decoderServiceFactory],
        ['encoder', encoderServiceFactory],
        ['errorMiddleware', errorMiddlewareServiceFactory],
        ['logger', loggerServiceFactory],
        ['match', matchServiceFactory],
        ['middlewares', middlewaresServiceFactory],
        ['mongoClient', mongoClientServiceFactory],
        ['petCreateHandler', petCreateHandlerServiceFactory],
        ['petDeleteHandler', petDeleteHandlerServiceFactory],
        ['petFindById', petFindByIdServiceFactory],
        ['petListHandler', petListHandlerServiceFactory],
        ['petPersist', petPersistServiceFactory],
        ['petReadHandler', petReadHandlerServiceFactory],
        ['petRemove', petRemoveServiceFactory],
        ['petResolveList', petResolveListServiceFactory],
        ['petUpdateHandler', petUpdateHandlerServiceFactory],
        ['pingHandler', pingHandlerServiceFactory],
        ['requestFactory', requestFactoryServiceFactory],
        ['responseFactory', responseFactoryServiceFactory],
        ['routeMatcherMiddleware', routeMatcherMiddlewareServiceFactory],
        ['routes', routesServiceFactory],
        ['serverRequestFactory', serverRequestFactoryServiceFactory],
        ['streamFactory', streamFactoryServiceFactory],
        ['streamFromResourceFactory', streamFromResourceFactoryServiceFactory],
        ['uriFactory', uriFactoryServiceFactory],
      ]),
      delegators: new Map([['routes', [petRoutesServiceDelegator]]]),
    },
    directories: new Map([
      ['cache', cacheDir],
      ['log', logDir],
    ]),
    mongodb: {
      uri: process.env.MONGO_URI ?? 'mongodb://root:root@localhost:27017/pet?authMechanism=DEFAULT&authSource=admin',
      indexes: {
        pet: [
          {
            key: { id: 1 },
            name: 'pet.id',
            unique: true,
          },
          {
            key: { name: 1 },
            name: 'pet.name',
          },
        ],
      },
    },
    pino: {
      options: {
        name: 'demo',
        level: 'info',
      },
      stream: {
        write: (msg: string): void => {
          if (!logStream) {
            logStream = createWriteStream(logDir + '/application.log', { flags: 'a' });
          }

          logStream.write(msg);
        },
      },
    },
    server: {
      host: process.env.SERVER_HOST ?? '0.0.0.0',
      port: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT, 10) : 8080,
    },
  };
};
