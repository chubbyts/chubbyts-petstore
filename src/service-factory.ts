import type { Container } from '@chubbyts/chubbyts-dic-types/dist/container';
import type { Middleware } from '@chubbyts/chubbyts-http-types/dist/middleware';
import { createLazyMiddleware } from '@chubbyts/chubbyts-framework/dist/middleware/lazy-middleware';
import { createErrorMiddleware } from '@chubbyts/chubbyts-framework/dist/middleware/error-middleware';
import { createRouteMatcherMiddleware } from '@chubbyts/chubbyts-framework/dist/middleware/route-matcher-middleware';
import type {
  RequestFactory,
  ResponseFactory,
  ServerRequestFactory,
  StreamFactory,
  UriFactory,
} from '@chubbyts/chubbyts-http-types/dist/message-factory';
import type { Logger } from '@chubbyts/chubbyts-log-types/dist/log';
import { createLogger } from '@chubbyts/chubbyts-log-types/dist/log';
import type { Match } from '@chubbyts/chubbyts-framework/dist/router/route-matcher';
import type { GeneratePath } from '@chubbyts/chubbyts-framework/dist/router/url-generator';
import {
  createRequestFactory,
  createResponseFactory,
  createServerRequestFactory,
  createStreamFactory,
  createStreamFromResourceFactory,
  createUriFactory,
} from '@chubbyts/chubbyts-http/dist/message-factory';
import { createPinoAdapter } from '@chubbyts/chubbyts-pino-adapter/dist/pino-adapter';
import {
  createPathToRegexpRouteMatcher,
  createPathToRegexpPathGenerator,
} from '@chubbyts/chubbyts-framework-router-path-to-regexp/dist/path-to-regexp-router';
import { pino } from 'pino';
import type { RoutesByName } from '@chubbyts/chubbyts-framework/dist/router/routes-by-name';
import { createRoutesByName } from '@chubbyts/chubbyts-framework/dist/router/routes-by-name';
import { createLazyHandler } from '@chubbyts/chubbyts-framework/dist/handler/lazy-handler';
import type { Route } from '@chubbyts/chubbyts-framework/dist/router/route';
import { createGetRoute } from '@chubbyts/chubbyts-framework/dist/router/route';
import { MongoClient } from 'mongodb';
import { createAcceptNegotiationMiddleware } from '@chubbyts/chubbyts-api/dist/middleware/accept-negotiation-middleware';
import { createContentTypeNegotiationMiddleware } from '@chubbyts/chubbyts-api/dist/middleware/content-type-negotiation-middleware';
import { createErrorMiddleware as createApiErrorMiddleware } from '@chubbyts/chubbyts-api/dist/middleware/error-middleware';
import { createAcceptNegotiator } from '@chubbyts/chubbyts-negotiation/dist/accept-negotiator';
import { createContentTypeNegotiator } from '@chubbyts/chubbyts-negotiation/dist/content-type-negotiator';
import type { Negotiator } from '@chubbyts/chubbyts-negotiation/dist/negotiation';
import type { Decoder } from '@chubbyts/chubbyts-decode-encode/dist/decoder';
import { createDecoder } from '@chubbyts/chubbyts-decode-encode/dist/decoder';
import { createJsonTypeDecoder } from '@chubbyts/chubbyts-decode-encode/dist/decoder/json-type-decoder';
import { createJsonxTypeDecoder } from '@chubbyts/chubbyts-decode-encode/dist/decoder/jsonx-type-decoder';
import { createUrlEncodedTypeDecoder } from '@chubbyts/chubbyts-decode-encode/dist/decoder/url-encoded-type-decoder';
import { createYamlTypeDecoder } from '@chubbyts/chubbyts-decode-encode/dist/decoder/yaml-type-decoder';
import type { Encoder } from '@chubbyts/chubbyts-decode-encode/dist/encoder';
import { createEncoder } from '@chubbyts/chubbyts-decode-encode/dist/encoder';
import { createJsonTypeEncoder } from '@chubbyts/chubbyts-decode-encode/dist/encoder/json-type-encoder';
import { createJsonxTypeEncoder } from '@chubbyts/chubbyts-decode-encode/dist/encoder/jsonx-type-encoder';
import { createUrlEncodedTypeEncoder } from '@chubbyts/chubbyts-decode-encode/dist/encoder/url-encoded-type-encoder';
import { createYamlTypeEncoder } from '@chubbyts/chubbyts-decode-encode/dist/encoder/yaml-type-encoder';
import { upsertIndexes } from '@chubbyts/chubbyts-mongodb/dist/mongo';
import { createCorsMiddleware } from '@chubbyts/chubbyts-http-cors/dist/middleware';
import {
  createAllowOriginExact,
  createAllowOriginRegex,
  createHeadersNegotiator,
  createMethodNegotiator,
  createOriginNegotiator,
} from '@chubbyts/chubbyts-http-cors/dist/negotiation';
import { extendZodWithOpenApi, OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import type { OpenAPIComponentObject } from '@asteasolutions/zod-to-openapi/dist/openapi-registry.ts';
import type { Config } from '../config/production.js';
import { createCleanDirectoriesCommand } from './command.js';
import type { CleanDirectoriesCommand } from './command.js';
import { createOpenApiHandler, createPingHandler } from './handler.js';

export const acceptNegotiationMiddlewareServiceFactory = (container: Container) => {
  return createAcceptNegotiationMiddleware(container.get<Negotiator>('acceptNegotiator'));
};

export const acceptNegotiatorServiceFactory = (container: Container) => {
  return createAcceptNegotiator(container.get<Encoder>('encoder').contentTypes);
};

export const apiErrorMiddlewareServiceFactory = (container: Container) => {
  return createApiErrorMiddleware(
    container.get<ResponseFactory>('responseFactory'),
    container.get<Encoder>('encoder'),
    undefined,
    container.get<Config>('config').debug,
    container.get<Logger>('logger'),
  );
};

export const cleanDirectoriesCommandServiceFactory = (container: Container): CleanDirectoriesCommand => {
  return createCleanDirectoriesCommand(container.get<Config>('config').directories, container.get<Logger>('logger'));
};

export const contentTypeNegotiationMiddlewareServiceFactory = (container: Container): Middleware => {
  return createContentTypeNegotiationMiddleware(container.get<Negotiator>('contentTypeNegotiator'));
};

export const contentTypeNegotiatorServiceFactory = (container: Container): Negotiator => {
  return createContentTypeNegotiator(container.get<Decoder>('decoder').contentTypes);
};

export const corsMiddlewareServiceFactory = (container: Container) => {
  const cors = container.get<Config>('config').cors;

  return createCorsMiddleware(
    container.get<ResponseFactory>('responseFactory'),
    createOriginNegotiator([
      ...(cors.allowOrigins.createAllowOriginExact
        ? cors.allowOrigins.createAllowOriginExact.map(createAllowOriginExact)
        : []),
      ...(cors.allowOrigins.createAllowOriginRegex
        ? cors.allowOrigins.createAllowOriginRegex.map(createAllowOriginRegex)
        : []),
    ]),
    createMethodNegotiator(cors.allowMethods),
    createHeadersNegotiator(cors.allowHeaders),
    cors.exposeHeaders,
    cors.allowCredentials,
    cors.maxAge,
  );
};

export const decoderServiceFactory = (): Decoder => {
  return createDecoder([
    createJsonTypeDecoder(),
    createJsonxTypeDecoder(),
    createUrlEncodedTypeDecoder(),
    createYamlTypeDecoder(),
  ]);
};

export const encoderServiceFactory = (): Encoder => {
  return createEncoder([
    createJsonTypeEncoder(),
    createJsonxTypeEncoder(),
    createUrlEncodedTypeEncoder(),
    createYamlTypeEncoder(),
  ]);
};

export const errorMiddlewareServiceFactory = (container: Container): Middleware => {
  return createErrorMiddleware(
    container.get<ResponseFactory>('responseFactory'),
    container.get<Config>('config').debug,
    container.get<Logger>('logger'),
  );
};

export const generatePathServiceFactory = (container: Container): GeneratePath => {
  return createPathToRegexpPathGenerator(container.get<RoutesByName>('routesByName'));
};

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

export const matchServiceFactory = (container: Container): Match => {
  return createPathToRegexpRouteMatcher(container.get<RoutesByName>('routesByName'));
};

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

export const openApiHandlerServiceFactory = (container: Container) => {
  return createOpenApiHandler(
    container.get<OpenAPIComponentObject>('openApiObject'),
    container.get<ResponseFactory>('responseFactory'),
  );
};

export const openApiObjectServiceFactory = (container: Container): OpenAPIComponentObject => {
  const openApi = container.get<Config>('config').openApi;
  const generator = new OpenApiGeneratorV3(container.get<OpenAPIRegistry>('openApiRegistry').definitions);

  return generator.generateDocument(openApi);
};

export const openApiRegistryServiceFactory = (): OpenAPIRegistry => {
  extendZodWithOpenApi(z);

  const registry = new OpenAPIRegistry();

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

export const pingHandlerServiceFactory = (container: Container) => {
  return createPingHandler(container.get<ResponseFactory>('responseFactory'));
};

export const requestFactoryServiceFactory = (container: Container): RequestFactory => {
  return createRequestFactory(container.get<UriFactory>('uriFactory'), container.get<StreamFactory>('streamFactory'));
};

export const responseFactoryServiceFactory = (container: Container): ResponseFactory => {
  return createResponseFactory(container.get<StreamFactory>('streamFactory'));
};

export const routeMatcherMiddlewareServiceFactory = (container: Container): Middleware => {
  return createRouteMatcherMiddleware(container.get<Match>('match'));
};

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

export const routesByNameServiceFactory = (container: Container): RoutesByName => {
  return createRoutesByName(container.get<Array<Route>>('routes'));
};

export const serverRequestFactoryServiceFactory = (container: Container): ServerRequestFactory => {
  return createServerRequestFactory(container.get<RequestFactory>('requestFactory'));
};

export const streamFactoryServiceFactory = createStreamFactory;

export const streamFromResourceFactoryServiceFactory = createStreamFromResourceFactory;

export const uriFactoryServiceFactory = createUriFactory;
