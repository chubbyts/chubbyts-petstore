import type { Duplex } from 'stream';
import { describe, expect, test } from '@jest/globals';
import type { ServerRequest, Response } from '@chubbyts/chubbyts-http-types/dist/message';
import type { ResponseFactory } from '@chubbyts/chubbyts-http-types/dist/message-factory';
import type { OpenAPIComponentObject } from '@asteasolutions/zod-to-openapi/dist/openapi-registry';
import { useObjectMock } from '@chubbyts/chubbyts-function-mock/dist/object-mock';
import { useFunctionMock } from '@chubbyts/chubbyts-function-mock/dist/function-mock';
import { createOpenApiHandler, createPingHandler } from '../../src/handler';

describe('handler', () => {
  test('createPingHandler', async () => {
    const request = {} as ServerRequest;

    const [responseBody, responseBodyMocks] = useObjectMock<Duplex>([
      {
        name: 'end',
        callback: (givenChunk) => {
          const data = JSON.parse(givenChunk);

          expect(data).toEqual({
            datetime: expect.any(String),
          });

          return responseBody;
        },
      },
    ]);

    const [response, responseMocks] = useObjectMock<Response>([
      { name: 'body', value: responseBody },
      { name: 'headers', value: { 'some-header': ['some-value'] } },
    ]);

    const [responseFactory, responseFactoryMocks] = useFunctionMock<ResponseFactory>([
      { parameters: [200], return: response },
    ]);

    const pingHandler = createPingHandler(responseFactory);

    expect(await pingHandler(request)).toEqual({
      ...response,
      headers: {
        'content-type': ['application/json'],
        'cache-control': ['no-cache, no-store, must-revalidate'],
        pragma: ['no-cache'],
        expires: ['0'],
        'some-header': ['some-value'],
      },
    });

    expect(responseBodyMocks.length).toBe(0);
    expect(responseMocks.length).toBe(0);
    expect(responseFactoryMocks.length).toBe(0);
  });

  test('createOpenApiHandler', async () => {
    const request = {} as ServerRequest;

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

    const [responseBody, responseBodyMocks] = useObjectMock<Duplex>([
      {
        name: 'end',
        callback: (givenChunk) => {
          const data = JSON.parse(givenChunk);

          expect(data).toEqual(openApiObject);

          return responseBody;
        },
      },
    ]);

    const [response, responseMocks] = useObjectMock<Response>([
      { name: 'body', value: responseBody },
      { name: 'headers', value: { 'some-header': ['some-value'] } },
    ]);

    const [responseFactory, responseFactoryMocks] = useFunctionMock<ResponseFactory>([
      { parameters: [200], return: response },
    ]);

    const pingHandler = createOpenApiHandler(openApiObject, responseFactory);

    expect(await pingHandler(request)).toEqual({
      ...response,
      headers: {
        'content-type': ['application/json'],
        'cache-control': ['no-cache, no-store, must-revalidate'],
        pragma: ['no-cache'],
        expires: ['0'],
        'some-header': ['some-value'],
      },
    });

    expect(responseBodyMocks.length).toBe(0);
    expect(responseMocks.length).toBe(0);
    expect(responseFactoryMocks.length).toBe(0);
  });
});
