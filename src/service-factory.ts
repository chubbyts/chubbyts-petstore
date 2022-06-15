import { Container } from '@chubbyts/chubbyts-dic-types/dist/container';
import { Middleware } from '@chubbyts/chubbyts-http-types/dist/middleware';
import { createLazyMiddleware } from '@chubbyts/chubbyts-framework/dist/middleware/lazy-middleware';
import { createErrorMiddleware } from '@chubbyts/chubbyts-framework/dist/middleware/error-middleware';
import { createRouteMatcherMiddleware } from '@chubbyts/chubbyts-framework/dist/middleware/route-matcher-middleware';
import {
  RequestFactory,
  ResponseFactory,
  ServerRequestFactory,
  StreamFactory,
  StreamFromResourceFactory,
  UriFactory,
} from '@chubbyts/chubbyts-http-types/dist/message-factory';
import { Config } from '../config/prod';
import { createLogger, Logger } from '@chubbyts/chubbyts-log-types/dist/log';
import { Match } from '@chubbyts/chubbyts-framework/dist/router/route-matcher';
import {
  createRequestFactory,
  createResponseFactory,
  createServerRequestFactory,
  createStreamFactory,
  createStreamFromResourceFactory,
  createUriFactory,
} from '@chubbyts/chubbyts-http/dist/message-factory';
import { createPinoAdapter } from '@chubbyts/chubbyts-pino-adapter/dist/pino-adapter';
import { createPathToRegexpRouteMatcher } from '@chubbyts/chubbyts-framework-router-path-to-regexp/dist/path-to-regexp-router';
import pino from 'pino';
import { createRoutesByName } from '@chubbyts/chubbyts-framework/dist/router/routes';
import { createLazyHandler } from '@chubbyts/chubbyts-framework/dist/handler/lazy-handler';
import { createGetRoute, Route } from '@chubbyts/chubbyts-framework/dist/router/route';
import { createPingHandler } from './handler';
import { CleanDirectoriesCommand, createCleanDirectoriesCommand } from './command';
import { MongoClient } from 'mongodb';
import { createAcceptNegotiationMiddleware } from '@chubbyts/chubbyts-api/dist/middleware/accept-negotiation-middleware';
import { createContentTypeNegotiationMiddleware } from '@chubbyts/chubbyts-api/dist/middleware/content-type-negotiation-middleware';
import { createErrorMiddleware as createApiErrorMiddleware } from '@chubbyts/chubbyts-api/dist/middleware/error-middleware';
import { createAcceptNegotiator } from '@chubbyts/chubbyts-negotiation/dist/accept-negotiator';
import { createContentTypeNegotiator } from '@chubbyts/chubbyts-negotiation/dist/content-type-negotiator';
import { Negotiator } from '@chubbyts/chubbyts-negotiation/dist/negotiation';
import { createDecoder, Decoder } from '@chubbyts/chubbyts-decode-encode/dist/decoder';
import { createJsonTypeDecoder } from '@chubbyts/chubbyts-decode-encode/dist/decoder/json-type-decoder';
import { createJsonxTypeDecoder } from '@chubbyts/chubbyts-decode-encode/dist/decoder/jsonx-type-decoder';
import { createUrlEncodedTypeDecoder } from '@chubbyts/chubbyts-decode-encode/dist/decoder/url-encoded-type-decoder';
import { createYamlTypeDecoder } from '@chubbyts/chubbyts-decode-encode/dist/decoder/yaml-type-decoder';
import { createEncoder, Encoder } from '@chubbyts/chubbyts-decode-encode/dist/encoder';
import { createJsonTypeEncoder } from '@chubbyts/chubbyts-decode-encode/dist/encoder/json-type-encoder';
import { createJsonxTypeEncoder } from '@chubbyts/chubbyts-decode-encode/dist/encoder/jsonx-type-encoder';
import { createUrlEncodedTypeEncoder } from '@chubbyts/chubbyts-decode-encode/dist/encoder/url-encoded-type-encoder';
import { createYamlTypeEncoder } from '@chubbyts/chubbyts-decode-encode/dist/encoder/yaml-type-encoder';
import { mapToHttpError } from './map-to-http-error';

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
    mapToHttpError,
    container.get<Config>('config').debug,
    container.get<Logger>('logger'),
  );
};

export const cleanDirectoriesCommandServiceFactory = (container: Container): CleanDirectoriesCommand => {
  return createCleanDirectoriesCommand(container.get<Config>('config').directories);
};

export const contentTypeNegotiationMiddlewareServiceFactory = (container: Container) => {
  return createContentTypeNegotiationMiddleware(container.get<Negotiator>('contentTypeNegotiator'));
};

export const contentTypeNegotiatorServiceFactory = (container: Container) => {
  return createContentTypeNegotiator(container.get<Decoder>('decoder').contentTypes);
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

export const loggerServiceFactory = (container: Container): Logger => {
  const { options, stream } = container.get<Config>('config').pino;

  return createLogger(createPinoAdapter(pino(options, stream)));
};

export const matchServiceFactory = (container: Container): Match => {
  return createPathToRegexpRouteMatcher(createRoutesByName(container.get<Array<Route>>('routes')));
};

export const middlewaresServiceFactory = (container: Container): Array<Middleware> => {
  const m = (name: string) => createLazyMiddleware(container, name);

  return [m('errorMiddleware'), m('routeMatcherMiddleware')];
};

export const mongoClientServiceFactory = async (container: Container): Promise<MongoClient> => {
  // @todo: add indices creation
  return MongoClient.connect(container.get<Config>('config').mongodb.uri);
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
  ];
};

export const serverRequestFactoryServiceFactory = (container: Container): ServerRequestFactory => {
  return createServerRequestFactory(container.get<RequestFactory>('requestFactory'));
};

export const streamFactoryServiceFactory = (): StreamFactory => {
  return createStreamFactory();
};

export const streamFromResourceFactoryServiceFactory = (): StreamFromResourceFactory => {
  return createStreamFromResourceFactory();
};

export const uriFactoryServiceFactory = (): UriFactory => {
  return createUriFactory();
};
