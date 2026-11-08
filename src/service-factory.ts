import type { Container } from '@chubbyts/chubbyts-dic-types/container';
import { createLazyMiddleware } from '@chubbyts/chubbyts-framework/middleware/lazy-middleware';
import { createErrorMiddleware } from '@chubbyts/chubbyts-framework/middleware/error-middleware';
import { createRouteMatcherMiddleware } from '@chubbyts/chubbyts-framework/middleware/route-matcher-middleware';
import type { Logger } from '@chubbyts/chubbyts-log-types/log';
import { createLogger } from '@chubbyts/chubbyts-log-types/log';
import type { Match } from '@chubbyts/chubbyts-framework/router/route-matcher';
import type { GeneratePath } from '@chubbyts/chubbyts-framework/router/url-generator';
import { createPinoAdapter } from '@chubbyts/chubbyts-pino-adapter/pino-adapter';
import {
  createPathToRegexpGeneratePath,
  createPathToRegexpMatch,
} from '@chubbyts/chubbyts-framework-router-path-to-regexp/path-to-regexp-router';
import {
  createBodyFactory,
  createRequestFactory,
  createResponseFactory,
  createServerRequestFactory,
  createUriFactory,
} from '@chubbyts/chubbyts-http/message-factory';
import { createResponseHelpers, createServerRequestHelpers } from '@chubbyts/chubbyts-http/message-helper';
import type {
  BodyFactory,
  RequestFactory,
  ResponseFactory,
  ServerRequestFactory,
  UriFactory,
} from '@chubbyts/chubbyts-http-types/message-factory';
import type { ResponseHelpers, ServerRequestHelpers } from '@chubbyts/chubbyts-http-types/message-helper';
import type { Middleware } from '@chubbyts/chubbyts-http-types/middleware';
import { pino } from 'pino';
import type { RoutesByName } from '@chubbyts/chubbyts-framework/router/routes-by-name';
import { createRoutesByName } from '@chubbyts/chubbyts-framework/router/routes-by-name';
import { createLazyHandler } from '@chubbyts/chubbyts-framework/handler/lazy-handler';
import type { Route } from '@chubbyts/chubbyts-framework/router/route';
import { createGetRoute } from '@chubbyts/chubbyts-framework/router/route';
import { MongoClient } from 'mongodb';
import { upsertIndexes } from '@chubbyts/chubbyts-mongodb/mongo';
import { extendZodWithOpenApi, OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import type { OpenAPIComponentObject } from '@asteasolutions/zod-to-openapi/dist/openapi-registry.d.ts';
import type { Config } from '../config/production.js';
import { createCleanDirectoriesCommand } from './command.js';
import type { CleanDirectoriesCommand } from './command.js';
import { createOpenApiHandler, createPingHandler } from './handler.js';

extendZodWithOpenApi(z);

export const bodyFactoryServiceFactory = (): BodyFactory => createBodyFactory();

export const cleanDirectoriesCommandServiceFactory = (container: Container): CleanDirectoriesCommand =>
  createCleanDirectoriesCommand(container.get<Config>('config').directories, container.get<Logger>('logger'));

export const errorMiddlewareServiceFactory = (container: Container): Middleware =>
  createErrorMiddleware(
    container.get<ResponseFactory>('responseFactory'),
    container.get<BodyFactory>('bodyFactory'),
    container.get<Config>('config').debug,
    container.get<Logger>('logger'),
  );

export const generatePathServiceFactory = (container: Container): GeneratePath =>
  createPathToRegexpGeneratePath(container.get<RoutesByName>('routesByName'));

export const loggerServiceFactory = (container: Container): Logger => {
  const { options, stream } = container.get<Config>('config').pino;

  return createLogger(
    createPinoAdapter(
      pino(
        {
          timestamp: () => `,"time":${(Date.now() / 1000).toString()}`,
          messageKey: 'message',
          formatters: {
            level: (label: string, number: number) => ({ level: label, level_number: number }),
          },
          ...options,
        },
        stream,
      ),
    ),
  );
};

export const matchServiceFactory = (container: Container): Match =>
  createPathToRegexpMatch(container.get<RoutesByName>('routesByName'));

export const middlewaresServiceFactory = (container: Container): Array<Middleware> => {
  const m = (name: string) => createLazyMiddleware(container, name);

  return [m('errorMiddleware'), m('corsMiddleware'), m('routeMatcherMiddleware')];
};

export const mongoClientServiceFactory = async (container: Container): Promise<MongoClient> => {
  const mongoConfig = container.get<Config>('config').mongodb;
  const mongoClient = await MongoClient.connect(mongoConfig.uri);
  await upsertIndexes(mongoClient, mongoConfig.indexes);

  return mongoClient;
};

export const openApiHandlerServiceFactory = (container: Container) =>
  createOpenApiHandler(
    container.get<OpenAPIComponentObject>('openApiObject'),
    container.get<ResponseFactory>('responseFactory'),
    container.get<BodyFactory>('bodyFactory'),
  );

export const openApiObjectServiceFactory = (container: Container): OpenAPIComponentObject => {
  const openApi = container.get<Config>('config').openApi;
  const generator = new OpenApiGeneratorV3(container.get<OpenAPIRegistry>('openApiRegistry').definitions);

  return generator.generateDocument(openApi);
};

export const openApiRegistryServiceFactory = (): OpenAPIRegistry => {
  const registry = new OpenAPIRegistry();

  registry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });

  registry.registerPath({
    path: '/ping',
    method: 'get',
    operationId: 'ping',
    tags: ['system'],
    responses: {
      200: {
        description: 'Ping response with current date',
        content: {
          'application/json': {
            schema: z.object({ data: z.string() }).openapi({
              description: 'Ping',
            }),
          },
        },
      },
    },
  });

  return registry;
};

export const pingHandlerServiceFactory = (container: Container) =>
  createPingHandler(container.get<ResponseFactory>('responseFactory'), container.get<BodyFactory>('bodyFactory'));

export const requestFactoryServiceFactory = (container: Container): RequestFactory =>
  createRequestFactory(container.get<UriFactory>('uriFactory'), container.get<BodyFactory>('bodyFactory'));

export const responseFactoryServiceFactory = (container: Container): ResponseFactory =>
  createResponseFactory(container.get<BodyFactory>('bodyFactory'));

export const responseHelpersServiceFactory = (): ResponseHelpers => createResponseHelpers();

export const routeMatcherMiddlewareServiceFactory = (container: Container): Middleware =>
  createRouteMatcherMiddleware(container.get<Match>('match'));

export const routesServiceFactory = (container: Container): Array<Route> => {
  const h = (name: string) => createLazyHandler(container, name);

  return [
    createGetRoute({
      path: '/ping',
      name: 'ping',
      handler: h('pingHandler'),
    }),
    createGetRoute({
      path: '/openapi',
      name: 'openapi',
      handler: h('openApiHandler'),
    }),
  ];
};

export const routesByNameServiceFactory = (container: Container): RoutesByName =>
  createRoutesByName(container.get<Array<Route>>('routes'));

export const serverRequestFactoryServiceFactory = (container: Container): ServerRequestFactory =>
  createServerRequestFactory(container.get<RequestFactory>('requestFactory'));

export const serverRequestHelpersServiceFactory = (): ServerRequestHelpers => createServerRequestHelpers();

export const uriFactoryServiceFactory = (): UriFactory => createUriFactory();
