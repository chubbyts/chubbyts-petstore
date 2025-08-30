import { PassThrough } from 'stream';
import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { Container } from '@chubbyts/chubbyts-dic-types/dist/container';
import { describe, expect, test } from 'vitest';
import { useObjectMock } from '@chubbyts/chubbyts-function-mock/dist/object-mock';
import { useFunctionMock } from '@chubbyts/chubbyts-function-mock/dist/function-mock';
import type { Handler } from '@chubbyts/chubbyts-http-types/dist/handler';
import type { Response, ServerRequest } from '@chubbyts/chubbyts-http-types/dist/message';
import type { ResponseFactory } from '@chubbyts/chubbyts-http-types/dist/message-factory';
import {
  acceptNegotiationMiddlewareServiceFactory,
  acceptNegotiatorServiceFactory,
  apiErrorMiddlewareServiceFactory,
  cleanDirectoriesCommandServiceFactory,
  contentTypeNegotiationMiddlewareServiceFactory,
  contentTypeNegotiatorServiceFactory,
  corsMiddlewareServiceFactory,
  dbServiceFactory,
  decoderServiceFactory,
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
  requestFactoryServiceFactory,
  responseFactoryServiceFactory,
  routeMatcherMiddlewareServiceFactory,
  routesByNameServiceFactory,
  routesServiceFactory,
  serverRequestFactoryServiceFactory,
  streamFactoryServiceFactory,
  streamFromResourceFactoryServiceFactory,
  uriFactoryServiceFactory,
} from '../../src/service-factory.js';
import { routeTestingResolveAllLazyMiddlewaresAndHandlers } from '../utils/route.js';

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
        return: new Map(),
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
    test('with allowOrigins: createAllowOriginExact', async () => {
      const requestBody = new PassThrough();

      const request = {
        method: 'OPTIONS',
        headers: { origin: ['http://localhost:80'] },
        body: requestBody,
      } as unknown as ServerRequest;

      const responseBody = new PassThrough();

      const response = {
        headers: {},
        body: responseBody,
      } as unknown as Response;

      const [handler, handlerMocks] = useFunctionMock<Handler>([]);

      const [responseFactory, responseFactoryMocks] = useFunctionMock<ResponseFactory>([
        { parameters: [204], return: response },
      ]);

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
          return: responseFactory,
        },
      ]);

      const corsMiddleware = corsMiddlewareServiceFactory(container);

      expect(corsMiddleware).toBeInstanceOf(Function);

      const middlewareResponse = await corsMiddleware(request, handler);

      expect({ ...middlewareResponse, body: undefined }).toMatchInlineSnapshot(`
        {
          "body": undefined,
          "headers": {
            "access-control-allow-credentials": [
              "false",
            ],
            "access-control-allow-origin": [
              "http://localhost:80",
            ],
            "access-control-max-age": [
              "7200",
            ],
          },
        }
      `);

      expect(handlerMocks.length).toBe(0);
      expect(responseFactoryMocks.length).toBe(0);
      expect(containerMocks.length).toBe(0);
    });

    test('with allowOrigins: createAllowOriginRegex', async () => {
      const requestBody = new PassThrough();

      const request = {
        method: 'OPTIONS',
        headers: { origin: ['http://localhost:80'] },
        body: requestBody,
      } as unknown as ServerRequest;

      const responseBody = new PassThrough();

      const response = {
        headers: {},
        body: responseBody,
      } as unknown as Response;

      const [handler, handlerMocks] = useFunctionMock<Handler>([]);

      const [responseFactory, responseFactoryMocks] = useFunctionMock<ResponseFactory>([
        { parameters: [204], return: response },
      ]);

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
          return: responseFactory,
        },
      ]);

      const corsMiddleware = corsMiddlewareServiceFactory(container);

      expect(corsMiddleware).toBeInstanceOf(Function);

      const middlewareResponse = await corsMiddleware(request, handler);

      expect({ ...middlewareResponse, body: undefined }).toMatchInlineSnapshot(`
        {
          "body": undefined,
          "headers": {
            "access-control-allow-credentials": [
              "false",
            ],
            "access-control-allow-origin": [
              "http://localhost:80",
            ],
            "access-control-max-age": [
              "7200",
            ],
          },
        }
      `);

      expect(handlerMocks.length).toBe(0);
      expect(responseFactoryMocks.length).toBe(0);
      expect(containerMocks.length).toBe(0);
    });

    test('without allowOrigins', async () => {
      const requestBody = new PassThrough();

      const request = {
        method: 'OPTIONS',
        headers: { origin: ['http://localhost:80'] },
        body: requestBody,
      } as unknown as ServerRequest;

      const responseBody = new PassThrough();

      const response = {
        headers: {},
        body: responseBody,
      } as unknown as Response;

      const [handler, handlerMocks] = useFunctionMock<Handler>([]);

      const [responseFactory, responseFactoryMocks] = useFunctionMock<ResponseFactory>([
        { parameters: [204], return: response },
      ]);

      const [container, containerMocks] = useObjectMock<Container>([
        {
          name: 'get',
          parameters: ['config'],
          return: {
            cors: {
              allowOrigins: {},
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
          return: responseFactory,
        },
      ]);

      const corsMiddleware = corsMiddlewareServiceFactory(container);

      expect(corsMiddleware).toBeInstanceOf(Function);

      const middlewareResponse = await corsMiddleware(request, handler);

      expect({ ...middlewareResponse, body: undefined }).toMatchInlineSnapshot(`
        {
          "body": undefined,
          "headers": {},
        }
      `);

      expect(handlerMocks.length).toBe(0);
      expect(responseFactoryMocks.length).toBe(0);
      expect(containerMocks.length).toBe(0);
    });
  });

  test('dbServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['config'],
        return: { postgres: '' },
      },
    ]);

    expect(dbServiceFactory(container)).toBeInstanceOf(Object);

    expect(containerMocks.length).toBe(0);
  });

  test('decoderServiceFactory', () => {
    const decoder = decoderServiceFactory();

    expect(decoder).toBeInstanceOf(Object);

    expect(decoder.contentTypes).toMatchInlineSnapshot(`
      [
        "application/json",
        "application/jsonx+xml",
        "application/x-www-form-urlencoded",
        "application/x-yaml",
      ]
    `);
  });

  test('encoderServiceFactory', () => {
    const encoder = encoderServiceFactory();

    expect(encoder).toBeInstanceOf(Object);

    expect(encoder.contentTypes).toMatchInlineSnapshot(`
      [
        "application/json",
        "application/jsonx+xml",
        "application/x-www-form-urlencoded",
        "application/x-yaml",
      ]
    `);
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
    const time = (Date.now() / 1000).toString();
    const timeStartsWith = time.split('.')[0].substring(0, time.split('.')[0].length - 2);
    const timePattern = new RegExp(`^${timeStartsWith}[0-9]{2,3}(.[0-9]{1,3}|)$`);

    const [write, writeMocks] = useFunctionMock<(msg: string) => void>([
      {
        callback: (givenMessage: string): void => {
          const parsedGivenMessage = JSON.parse(givenMessage);

          expect({ ...parsedGivenMessage, time: (parsedGivenMessage as { time: number }).time.toString() }).toEqual({
            level: 'info',
            level_number: 30,
            time: expect.stringMatching(timePattern),
            pid: expect.any(Number),
            hostname: expect.any(String),
            context: 'context',
            message: 'message',
          });
        },
      },
    ]);

    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['config'],
        return: {
          pino: {
            options: {},
            stream: { write },
          },
        },
      },
    ]);

    const logger = loggerServiceFactory(container);

    expect(logger).toBeInstanceOf(Object);

    logger.info('message', { context: 'context' });

    expect(writeMocks.length).toBe(0);
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
    const openApiRegistry = openApiRegistryServiceFactory();

    expect(openApiRegistry).toBeInstanceOf(OpenAPIRegistry);

    expect(
      new OpenApiGeneratorV3(openApiRegistry.definitions).generateDocument({
        openapi: '3.0.0',
        info: {
          version: '1.0.0',
          title: 'Petstore',
          license: {
            name: 'MIT',
          },
        },
      }),
    ).toMatchInlineSnapshot(`
      {
        "components": {
          "parameters": {},
          "schemas": {},
        },
        "info": {
          "license": {
            "name": "MIT",
          },
          "title": "Petstore",
          "version": "1.0.0",
        },
        "openapi": "3.0.0",
        "paths": {
          "/ping": {
            "get": {
              "operationId": "ping",
              "responses": {
                "200": {
                  "content": {
                    "application/json": {
                      "schema": {
                        "description": "Ping",
                        "properties": {
                          "data": {
                            "type": "string",
                          },
                        },
                        "required": [
                          "data",
                        ],
                        "type": "object",
                      },
                    },
                  },
                  "description": "Ping response with current date",
                },
              },
              "tags": [
                "system",
              ],
            },
          },
        },
      }
    `);
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

    const dummyHandler = async () => response;

    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['pingHandler'],
        return: dummyHandler,
      },
      {
        name: 'get',
        parameters: ['openApiHandler'],
        return: dummyHandler,
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

    await routeTestingResolveAllLazyMiddlewaresAndHandlers(routes, request, response);

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
