import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { Container } from '@chubbyts/chubbyts-dic-types/dist/container';
import { describe, expect, test } from 'vitest';
import { useObjectMock } from '@chubbyts/chubbyts-function-mock/dist/object-mock';
import { useFunctionMock } from '@chubbyts/chubbyts-function-mock/dist/function-mock';
import type { Handler } from '@chubbyts/chubbyts-undici-server/dist/server';
import { Response, ServerRequest } from '@chubbyts/chubbyts-undici-server/dist/server';
import {
  acceptNegotiationMiddlewareServiceFactory,
  apiErrorMiddlewareServiceFactory,
  cleanDirectoriesCommandServiceFactory,
  contentTypeNegotiationMiddlewareServiceFactory,
  dbServiceFactory,
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

    expect(containerMocks).toHaveLength(0);
  });

  test('apiErrorMiddlewareServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
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

    expect(containerMocks).toHaveLength(0);
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

    expect(containerMocks).toHaveLength(0);
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

    expect(containerMocks).toHaveLength(0);
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

    expect(containerMocks).toHaveLength(0);
  });

  test('dbServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['config'],
        return: { postgres: '' },
      },
    ]);

    const db = dbServiceFactory(container);

    expect(db).toBeInstanceOf(Object);
    expect(db.query.pets).toBeInstanceOf(Object);
    expect(db.query.petsVaccinations).toBeInstanceOf(Object);

    expect(containerMocks).toHaveLength(0);
  });

  test('errorMiddlewareServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
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

    expect(containerMocks).toHaveLength(0);
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

    expect(writeMocks).toHaveLength(0);
    expect(containerMocks).toHaveLength(0);
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

    expect(containerMocks).toHaveLength(0);
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

    expect(handlerMocks).toHaveLength(0);
    expect(containerMocks).toHaveLength(0);
  });

  test('openApiHandlerServiceFactory', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['openApiObject'],
        return: {},
      },
    ]);

    expect(openApiHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks).toHaveLength(0);
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

    expect(containerMocks).toHaveLength(0);
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
          "securitySchemes": {
            "bearerAuth": {
              "bearerFormat": "JWT",
              "scheme": "bearer",
              "type": "http",
            },
          },
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
    expect(pingHandlerServiceFactory()).toBeInstanceOf(Function);
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

    expect(containerMocks).toHaveLength(0);
  });

  test('routesServiceFactory', async () => {
    const serverRequest = new ServerRequest('https://example.com/');
    const response = new Response();

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

    await routeTestingResolveAllLazyMiddlewaresAndHandlers(routes, serverRequest, response);

    expect(containerMocks).toHaveLength(0);
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

    expect(containerMocks).toHaveLength(0);
  });
});
