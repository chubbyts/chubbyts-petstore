import { createWriteStream, realpathSync } from 'fs';
import { URL } from 'url';
import type { DestinationStream, LoggerOptions } from 'pino';
import type { ConfigDelegator, ConfigFactory } from '@chubbyts/chubbyts-dic-config/dist/dic-config';
import type { OpenAPIObjectConfig } from '@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator.d.ts';
import type { CorsConfig } from '@chubbyts/chubbyts-undici-cors/dist/service-factory';
import { corsMiddlewareServiceFactory } from '@chubbyts/chubbyts-undici-cors/dist/service-factory';
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
  decoderServiceFactory,
  dbServiceFactory,
  encoderServiceFactory,
  errorMiddlewareServiceFactory,
  generatePathServiceFactory,
  loggerServiceFactory,
  matchServiceFactory,
  middlewaresServiceFactory,
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
    cors: CorsConfig;
    oidc: OidcConfig;
  };
  debug: boolean;
  dependencies: {
    factories: Map<string, ConfigFactory>;
    delegators: Map<string, Array<ConfigDelegator>>;
  };
  directories: Map<string, string>;
  openApi: OpenAPIObjectConfig;
  pino: {
    options: LoggerOptions;
    stream: DestinationStream;
  };
  postgres: string;
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
      oidc: {
        issuer: getRequiredEnv('OIDC_ISSUER'),
        audience: getRequiredEnv('OIDC_AUDIENCE'),
        realm: 'petstore',
      },
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
        ['corsMiddleware', corsMiddlewareServiceFactory()],
        ['decoder', decoderServiceFactory],
        ['db', dbServiceFactory],
        ['encoder', encoderServiceFactory],
        ['errorMiddleware', errorMiddlewareServiceFactory],
        ['generatePath', generatePathServiceFactory],
        ['logger', loggerServiceFactory],
        ['match', matchServiceFactory],
        ['middlewares', middlewaresServiceFactory],
        ['oidcAuthenticationMiddleware', oidcAuthenticationMiddlewareServiceFactory()],
        ['openApiHandler', openApiHandlerServiceFactory],
        ['openApiObject', openApiObjectServiceFactory],
        ['openApiRegistry', openApiRegistryServiceFactory],
        ['petCreateHandler', petCreateHandlerServiceFactory],
        ['petDeleteHandler', petDeleteHandlerServiceFactory],
        ['petEnrichModel', petEnrichModelServiceFactory],
        ['petEnrichModelList', petEnrichModelListServiceFactory],
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
    postgres: getRequiredEnv('POSTGRES_URI'),
    server: {
      host: getRequiredEnv('SERVER_HOST'),
      port: parseInt(getRequiredEnv('SERVER_PORT'), 10),
      baseUrl: process.env.SERVER_BASE_URL || undefined,
      requestBodyTimeoutMs: undefined,
      responseSendTimeoutMs: undefined,
    },
  };
};
