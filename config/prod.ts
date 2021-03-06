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
  corsMiddlewareServiceFactory,
  decoderServiceFactory,
  encoderServiceFactory,
  errorMiddlewareServiceFactory,
  generatePathServiceFactory,
  loggerServiceFactory,
  matchServiceFactory,
  middlewaresServiceFactory,
  mongoClientServiceFactory,
  pingHandlerServiceFactory,
  requestFactoryServiceFactory,
  responseFactoryServiceFactory,
  routeMatcherMiddlewareServiceFactory,
  routesByNameServiceFactory,
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
  petEncoderServiceFactory,
  petListEncoderServiceFactory,
  petDecoderServiceFactory,
} from '../src/pet/service-factory';
import { IndexesByCollection } from '@chubbyts/chubbyts-mongodb/dist/mongo';
import { Method } from '@chubbyts/chubbyts-http-types/dist/message';

export type Config = {
  cors: {
    allowCredentials: boolean;
    allowHeaders: Array<string>;
    allowMethods: Array<Method>;
    allowOrigins: {
      createAllowOriginExact?: Array<string>;
      createAllowOriginRegex?: Array<RegExp>;
    };
    exposeHeaders: Array<string>;
    maxAge: number;
  };
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
    cors: {
      allowCredentials: false,
      allowHeaders: ['Accept', 'Content-Type'],
      allowMethods: [Method.DELETE, Method.GET, Method.POST, Method.PUT],
      allowOrigins: {},
      exposeHeaders: [],
      maxAge: 7200,
    },
    debug: false,
    dependencies: {
      factories: new Map<string, ConfigFactory>([
        ['acceptNegotiationMiddleware', acceptNegotiationMiddlewareServiceFactory],
        ['acceptNegotiator', acceptNegotiatorServiceFactory],
        ['apiErrorMiddleware', apiErrorMiddlewareServiceFactory],
        ['cleanDirectoriesCommand', cleanDirectoriesCommandServiceFactory],
        ['contentTypeNegotiationMiddleware', contentTypeNegotiationMiddlewareServiceFactory],
        ['contentTypeNegotiator', contentTypeNegotiatorServiceFactory],
        ['corsMiddleware', corsMiddlewareServiceFactory],
        ['decoder', decoderServiceFactory],
        ['encoder', encoderServiceFactory],
        ['errorMiddleware', errorMiddlewareServiceFactory],
        ['generatePath', generatePathServiceFactory],
        ['logger', loggerServiceFactory],
        ['match', matchServiceFactory],
        ['middlewares', middlewaresServiceFactory],
        ['mongoClient', mongoClientServiceFactory],
        ['petCreateHandler', petCreateHandlerServiceFactory],
        ['petDecoder', petDecoderServiceFactory],
        ['petDeleteHandler', petDeleteHandlerServiceFactory],
        ['petEncoder', petEncoderServiceFactory],
        ['petFindById', petFindByIdServiceFactory],
        ['petListEncoder', petListEncoderServiceFactory],
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
        ['routesByName', routesByNameServiceFactory],
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
      uri: process.env.MONGO_URI as string,
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
        name: 'chubbyts-petstore',
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
      host: process.env.SERVER_HOST as string,
      port: parseInt(process.env.SERVER_PORT as string, 10),
    },
  };
};
