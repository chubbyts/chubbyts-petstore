import { createWriteStream, realpathSync } from 'fs';
import { URL } from 'url';
import type { DestinationStream, LoggerOptions } from 'pino';
import type { ConfigDelegator, ConfigFactory } from '@chubbyts/chubbyts-dic-config/dist/dic-config';
import type { IndexesByCollection } from '@chubbyts/chubbyts-mongodb/dist/mongo';
import { Method } from '@chubbyts/chubbyts-http-types/dist/message';
import type { OpenAPIObjectConfig } from '@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator.ts';
import {
  petCreateHandlerServiceFactory,
  petFindOneByIdServiceFactory,
  petResolveListServiceFactory,
  petListHandlerServiceFactory,
  petPersistServiceFactory,
  petReadHandlerServiceFactory,
  petUpdateHandlerServiceFactory,
  petDeleteHandlerServiceFactory,
  petRemoveServiceFactory,
  petRoutesServiceDelegator,
  petEnrichModelServiceFactory,
  petEnrichListServiceFactory,
  petOpenApiRegistryServiceDelegator,
} from '../src/pet/service-factory.js';
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
  openApiHandlerServiceFactory,
  openApiObjectServiceFactory,
  openApiRegistryServiceFactory,
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
} from '../src/service-factory.js';

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
  openApi: OpenAPIObjectConfig;
  pino: {
    options: LoggerOptions;
    stream: DestinationStream;
  };
  server: {
    host: string;
    port: number;
  };
};

const rootDir = realpathSync(new URL('..', import.meta.url));

export const configFactory = (env: string): Config => {
  console.log(`Loading "${env}" config`);

  const cacheDir = rootDir + '/var/cache';
  const logDir = rootDir + '/var/log';

  const logStream = createWriteStream(logDir + '/application.log', { flags: 'a' });

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
        ['openApiObject', openApiObjectServiceFactory],
        ['openApiHandler', openApiHandlerServiceFactory],
        ['openApiRegistry', openApiRegistryServiceFactory],
        ['petCreateHandler', petCreateHandlerServiceFactory],
        ['petDeleteHandler', petDeleteHandlerServiceFactory],
        ['petEnrichList', petEnrichListServiceFactory],
        ['petEnrichModel', petEnrichModelServiceFactory],
        ['petFindOneById', petFindOneByIdServiceFactory],
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
      delegators: new Map([
        ['openApiRegistry', [petOpenApiRegistryServiceDelegator]],
        ['routes', [petRoutesServiceDelegator]],
      ]),
    },
    directories: new Map([
      ['cache', cacheDir],
      ['log', logDir],
    ]),
    mongodb: {
      uri: process.env.MONGO_URI as string,
      indexes: {
        pets: [
          {
            key: { id: 1 },
            name: 'pets.id',
            unique: true,
          },
          {
            key: { name: 1 },
            name: 'pets.name',
          },
          {
            key: { tag: 1 },
            name: 'pets.tag',
            unique: true,
            sparse: true,
          },
        ],
      },
    },
    openApi: {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Petstore',
        license: {
          name: 'MIT',
        },
      },
    },
    pino: {
      options: {
        name: 'chubbyts-petstore',
        level: 'info',
      },
      stream: {
        write: (msg: string): void => {
          logStream.write(msg);
          console.log(msg);
        },
      },
    },
    server: {
      host: process.env.SERVER_HOST as string,
      port: parseInt(process.env.SERVER_PORT as string, 10),
    },
  };
};
