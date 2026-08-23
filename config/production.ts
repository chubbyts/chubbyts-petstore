import { createWriteStream, realpathSync } from 'fs';
import { URL } from 'url';
import type { DestinationStream, LoggerOptions } from 'pino';
import type { ConfigDelegator, ConfigFactory } from '@chubbyts/chubbyts-dic-config/dist/dic-config';
import type { IndexesByCollection } from '@chubbyts/chubbyts-mongodb/dist/mongo';
import type { OpenAPIObjectConfig } from '@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator.d.ts';
import type { OidcConfig } from '@chubbyts/chubbyts-undici-oidc/dist/service-factory';
import { oidcAuthenticationMiddlewareServiceFactory } from '@chubbyts/chubbyts-undici-oidc/dist/service-factory';
import {
  petCreateHandlerServiceFactory,
  petFindModelByIdServiceFactory,
  petResolveModelListServiceFactory,
  petListHandlerServiceFactory,
  petPersistModelServiceFactory,
  petReadHandlerServiceFactory,
  petUpdateHandlerServiceFactory,
  petDeleteHandlerServiceFactory,
  petRemoveModelServiceFactory,
  petRoutesServiceDelegator,
  petEnrichModelServiceFactory,
  petEnrichModelListServiceFactory,
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
  routeMatcherMiddlewareServiceFactory,
  routesByNameServiceFactory,
  routesServiceFactory,
} from '../src/service-factory.js';

export type Config = {
  chubbyts: {
    oidc: OidcConfig;
  };
  cors: {
    allowCredentials: boolean;
    allowHeaders: Array<string>;
    allowMethods: Array<string>;
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
    baseUrl?: string;
    requestBodyTimeoutMs?: number;
    responseSendTimeoutMs?: number;
  };
};

const rootDir = realpathSync(new URL('..', import.meta.url));

export const getRequiredEnv = (key: string): string => {
  const value = process.env[key];

  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const configFactory = (env: string): Config => {
  console.log(`Loading "${env}" config`);

  const cacheDir = rootDir + '/var/cache';
  const logDir = rootDir + '/var/log';

  const logStream = createWriteStream(logDir + '/application.log', { flags: 'a' });

  return {
    chubbyts: {
      oidc: {
        issuer: getRequiredEnv('OIDC_ISSUER'),
        audience: getRequiredEnv('OIDC_AUDIENCE'),
        realm: 'petstore',
      },
    },
    cors: {
      allowCredentials: false,
      allowHeaders: ['Accept', 'Authorization', 'Content-Type'],
      allowMethods: ['DELETE', 'GET', 'POST', 'PUT'],
      allowOrigins: {},
      // let a browser based frontend read the bearer challenge, to distinguish a missing (no error) from an invalid,
      // e.g. expired, token (error="invalid_token"), the concrete reason intentionally does not get reflected
      exposeHeaders: ['WWW-Authenticate'],
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
        ['oidcAuthenticationMiddleware', oidcAuthenticationMiddlewareServiceFactory()],
        ['openApiObject', openApiObjectServiceFactory],
        ['openApiHandler', openApiHandlerServiceFactory],
        ['openApiRegistry', openApiRegistryServiceFactory],
        ['petCreateHandler', petCreateHandlerServiceFactory],
        ['petDeleteHandler', petDeleteHandlerServiceFactory],
        ['petEnrichModelList', petEnrichModelListServiceFactory],
        ['petEnrichModel', petEnrichModelServiceFactory],
        ['petFindModelById', petFindModelByIdServiceFactory],
        ['petListHandler', petListHandlerServiceFactory],
        ['petPersistModel', petPersistModelServiceFactory],
        ['petReadHandler', petReadHandlerServiceFactory],
        ['petRemoveModel', petRemoveModelServiceFactory],
        ['petResolveModelList', petResolveModelListServiceFactory],
        ['petUpdateHandler', petUpdateHandlerServiceFactory],
        ['pingHandler', pingHandlerServiceFactory],
        ['routeMatcherMiddleware', routeMatcherMiddlewareServiceFactory],
        ['routes', routesServiceFactory],
        ['routesByName', routesByNameServiceFactory],
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
      uri: getRequiredEnv('MONGO_URI'),
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
      host: getRequiredEnv('SERVER_HOST'),
      port: parseInt(getRequiredEnv('SERVER_PORT'), 10),
      baseUrl: process.env.SERVER_BASE_URL || undefined,
      requestBodyTimeoutMs: undefined,
      responseSendTimeoutMs: undefined,
    },
  };
};
