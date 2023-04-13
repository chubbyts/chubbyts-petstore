import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { Container } from '@chubbyts/chubbyts-dic-types/dist/container';
import { describe, expect, test } from '@jest/globals';
import { MongoClient } from 'mongodb';
import { useObjectMock } from '@chubbyts/chubbyts-function-mock/dist/object-mock';
import { useFunctionMock } from '@chubbyts/chubbyts-function-mock/dist/function-mock';
import type { Handler } from '@chubbyts/chubbyts-http-types/dist/handler';
import type { ServerRequest } from '@chubbyts/chubbyts-http-types/dist/message';
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
} from '../../src/service-factory';

// eslint-disable-next-line functional/immutable-data
MongoClient.connect = async () => ({} as MongoClient);

describe('service-factory', () => {
  test('acceptNegotiationMiddlewareServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['acceptNegotiator'],
        return: {},
      },
    ]);

    expect(acceptNegotiationMiddlewareServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('acceptNegotiatorServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['encoder'],
        return: { contentTypes: ['application/json'] },
      },
    ]);

    expect(acceptNegotiatorServiceFactory(container)).toBeInstanceOf(Object);

    expect(containerMocks.length).toBe(0);
  });

  test('apiErrorMiddlewareServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['responseFactory'],
        return: () => undefined,
      },
      {
        name: 'get',
        parameters: ['encoder'],
        return: {},
      },
      {
        name: 'get',
        parameters: ['config'],
        return: { debug: true },
      },
      {
        name: 'get',
        parameters: ['logger'],
        return: {},
      },
    ]);

    expect(apiErrorMiddlewareServiceFactory(container)).toBeInstanceOf(Object);

    expect(containerMocks.length).toBe(0);
  });

  test('generatePathServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['routesByName'],
        return: () => new Map(),
      },
    ]);

    expect(generatePathServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('cleanDirectoriesCommandServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['config'],
        return: { directories: new Map([]) },
      },
      {
        name: 'get',
        parameters: ['logger'],
        return: {},
      },
    ]);

    expect(cleanDirectoriesCommandServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('contentTypeNegotiationMiddlewareServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['contentTypeNegotiator'],
        return: {},
      },
    ]);

    expect(contentTypeNegotiationMiddlewareServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('contentTypeNegotiatorServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['decoder'],
        return: { contentTypes: ['application/json'] },
      },
    ]);

    expect(contentTypeNegotiatorServiceFactory(container)).toBeInstanceOf(Object);

    expect(containerMocks.length).toBe(0);
  });

  describe('corsMiddlewareServiceFactory', () => {
    test('with createAllowOriginExact', () => {
      const [container, containerMocks] = useObjectMock<Container>([
        {
          name: 'get',
          parameters: ['config'],
          return: {
            cors: {
              allowOrigins: {
                createAllowOriginExact: ['http://localhost:80'],
              },
              allowMethods: [],
              allowHeaders: [],
              exposeHeaders: [],
              allowCredentials: false,
              maxAge: 7200,
            },
          },
        },
        {
          name: 'get',
          parameters: ['responseFactory'],
          return: () => undefined,
        },
      ]);

      expect(corsMiddlewareServiceFactory(container)).toBeInstanceOf(Function);

      expect(containerMocks.length).toBe(0);
    });

    test('with createAllowOriginRegex', () => {
      const [container, containerMocks] = useObjectMock<Container>([
        {
          name: 'get',
          parameters: ['config'],
          return: {
            cors: {
              allowOrigins: {
                createAllowOriginRegex: [/^http?:\/\/localhost(:\d+)?$/],
              },
              allowMethods: [],
              allowHeaders: [],
              exposeHeaders: [],
              allowCredentials: false,
              maxAge: 7200,
            },
          },
        },
        {
          name: 'get',
          parameters: ['responseFactory'],
          return: () => undefined,
        },
      ]);

      expect(corsMiddlewareServiceFactory(container)).toBeInstanceOf(Function);

      expect(containerMocks.length).toBe(0);
    });
  });

  test('decoderServiceFactory', () => {
    expect(decoderServiceFactory()).toBeInstanceOf(Object);
  });

  test('encoderServiceFactory', () => {
    expect(encoderServiceFactory()).toBeInstanceOf(Object);
  });

  test('errorMiddlewareServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['responseFactory'],
        return: () => null,
      },
      {
        name: 'get',
        parameters: ['config'],
        return: { debug: true },
      },
      {
        name: 'get',
        parameters: ['logger'],
        return: {},
      },
    ]);

    expect(errorMiddlewareServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('loggerServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['config'],
        return: {
          pino: {
            options: {},
            stream: { write: () => null },
          },
        },
      },
    ]);

    expect(loggerServiceFactory(container)).toBeInstanceOf(Object);

    expect(containerMocks.length).toBe(0);
  });

  test('matchServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['routesByName'],
        return: new Map(),
      },
    ]);

    expect(matchServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('middlewaresServiceFactory', async () => {
    const request = {} as ServerRequest;
    const response = {} as Response;

    const [handler, handlerMocks] = useFunctionMock<Handler>([]);

    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['errorMiddleware'],
        return: async () => response,
      },
      {
        name: 'get',
        parameters: ['corsMiddleware'],
        return: async () => response,
      },
      {
        name: 'get',
        parameters: ['routeMatcherMiddleware'],
        return: async () => response,
      },
    ]);

    const middlewares = middlewaresServiceFactory(container);

    expect(middlewares).toBeInstanceOf(Array);

    expect(middlewares).toMatchInlineSnapshot(`
      [
        [Function],
        [Function],
        [Function],
      ]
    `);

    expect(await Promise.all(middlewares.map((middleware) => middleware(request, handler)))).toEqual(
      middlewares.map(() => response),
    );

    expect(handlerMocks.length).toBe(0);
    expect(containerMocks.length).toBe(0);
  });

  test('mongoClientServiceFactory', async () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['config'],
        return: {
          mongodb: {
            uri: 'mongodb://localhost',
            indexes: {},
          },
        },
      },
    ]);

    const middlewares = await mongoClientServiceFactory(container);

    expect(middlewares).toBeInstanceOf(Object);

    expect(containerMocks.length).toBe(0);
  });

  test('openApiHandlerServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['openApiObject'],
        return: {},
      },
      {
        name: 'get',
        parameters: ['responseFactory'],
        return: () => undefined,
      },
    ]);

    expect(openApiHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('openApiObjectServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['config'],
        return: { openApi: {} },
      },
      {
        name: 'get',
        parameters: ['openApiRegistry'],
        return: { definitions: { sort: () => null, forEach: () => null } },
      },
    ]);

    expect(openApiObjectServiceFactory(container)).toBeInstanceOf(Object);

    expect(containerMocks.length).toBe(0);
  });

  test('openApiRegistryServiceFactory', () => {
    expect(openApiRegistryServiceFactory()).toBeInstanceOf(OpenAPIRegistry);
  });

  test('pingHandlerServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['responseFactory'],
        return: () => null,
      },
    ]);

    expect(pingHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('requestFactoryServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['uriFactory'],
        return: () => null,
      },
      {
        name: 'get',
        parameters: ['streamFactory'],
        return: () => null,
      },
    ]);

    expect(requestFactoryServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('responseFactoryServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['streamFactory'],
        return: () => null,
      },
    ]);

    expect(responseFactoryServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('routeMatcherMiddlewareServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['match'],
        return: () => null,
      },
    ]);

    expect(routeMatcherMiddlewareServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('routesServiceFactory', async () => {
    const request = {} as ServerRequest;
    const response = {} as Response;

    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['pingHandler'],
        return: async () => response,
      },
      {
        name: 'get',
        parameters: ['openApiHandler'],
        return: async () => response,
      },
    ]);

    const routes = routesServiceFactory(container);

    expect(routes).toBeInstanceOf(Array);

    expect(routes).toMatchInlineSnapshot(`
      [
        {
          "_route": "Route",
          "attributes": {},
          "handler": [Function],
          "method": "GET",
          "middlewares": [],
          "name": "ping",
          "path": "/ping",
          "pathOptions": {},
        },
        {
          "_route": "Route",
          "attributes": {},
          "handler": [Function],
          "method": "GET",
          "middlewares": [],
          "name": "openapi",
          "path": "/openapi",
          "pathOptions": {},
        },
      ]
    `);

    expect(await Promise.all(routes.map((route) => route.handler(request)))).toEqual(routes.map(() => response));

    expect(containerMocks.length).toBe(0);
  });

  test('routesByNameServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['routes'],
        return: [],
      },
    ]);

    expect(routesByNameServiceFactory(container)).toBeInstanceOf(Map);

    expect(containerMocks.length).toBe(0);
  });

  test('serverRequestFactoryServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['requestFactory'],
        return: () => null,
      },
    ]);

    expect(serverRequestFactoryServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('streamFactoryServiceFactory', () => {
    expect(streamFactoryServiceFactory()).toBeInstanceOf(Function);
  });

  test('streamFromResourceFactoryServiceFactory', () => {
    expect(streamFromResourceFactoryServiceFactory()).toBeInstanceOf(Function);
  });

  test('uriFactoryServiceFactory', () => {
    expect(uriFactoryServiceFactory()).toBeInstanceOf(Function);
  });
});
