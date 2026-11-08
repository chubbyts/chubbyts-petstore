import { describe, expect, test } from 'vitest';
import type { OpenAPIComponentObject } from '@asteasolutions/zod-to-openapi/dist/openapi-registry.d.ts';
import type { Body, Response, ServerRequest } from '@chubbyts/chubbyts-http-types/message';
import type { BodyFactory, ResponseFactory } from '@chubbyts/chubbyts-http-types/message-factory';
import { useFunctionMock } from '@chubbyts/chubbyts-function-mock/function-mock';
import { createOpenApiHandler, createPingHandler } from '../../src/handler.js';

const createResponse = (): Response =>
  ({
    status: 200,
    reasonPhrase: 'OK',
    protocolVersion: '1.1',
    headers: { 'some-header': ['some-value'] },
    body: {} as Body,
  }) as Response;

const expectedHeaders = {
  'some-header': ['some-value'],
  'content-type': ['application/json'],
  'cache-control': ['no-cache, no-store, must-revalidate'],
  pragma: ['no-cache'],
  expires: ['0'],
};

describe('handler', () => {
  test('createPingHandler', async () => {
    const serverRequest = {} as ServerRequest;
    const body = {} as Body;
    const response = createResponse();

    const [responseFactory, responseFactoryMocks] = useFunctionMock<ResponseFactory>([
      { parameters: [200], return: response },
    ]);

    const [bodyFactory, bodyFactoryMocks] = useFunctionMock<BodyFactory>([
      {
        callback: (content: string) => {
          expect(JSON.parse(content)).toEqual({ datetime: expect.any(String) });

          return body;
        },
      },
    ]);

    const pingHandler = createPingHandler(responseFactory, bodyFactory);

    expect(await pingHandler(serverRequest)).toEqual({ ...response, headers: expectedHeaders, body });

    expect(responseFactoryMocks).toHaveLength(0);
    expect(bodyFactoryMocks).toHaveLength(0);
  });

  test('createOpenApiHandler', async () => {
    const serverRequest = {} as ServerRequest;
    const body = {} as Body;
    const response = createResponse();

    const openApiObject: OpenAPIComponentObject = {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Petstore',
        license: {
          name: 'MIT',
        },
      },
      servers: [
        {
          url: 'https://localhost',
        },
      ],
      components: {
        schemas: {},
        parameters: {},
      },
      paths: {},
    };

    const [responseFactory, responseFactoryMocks] = useFunctionMock<ResponseFactory>([
      { parameters: [200], return: response },
    ]);

    const [bodyFactory, bodyFactoryMocks] = useFunctionMock<BodyFactory>([
      {
        callback: (content: string) => {
          expect(JSON.parse(content)).toEqual({
            openapi: '3.0.0',
            info: { version: '1.0.0', title: 'Petstore', license: { name: 'MIT' } },
            servers: [{ url: 'https://localhost' }],
            components: { schemas: {}, parameters: {} },
            paths: {},
          });

          return body;
        },
      },
    ]);

    const openApiHandler = createOpenApiHandler(openApiObject, responseFactory, bodyFactory);

    expect(await openApiHandler(serverRequest)).toEqual({ ...response, headers: expectedHeaders, body });

    expect(responseFactoryMocks).toHaveLength(0);
    expect(bodyFactoryMocks).toHaveLength(0);
  });
});
