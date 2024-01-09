import type { Stream } from 'stream';
import { PassThrough } from 'stream';
import { describe, expect, test } from '@jest/globals';
import type { ServerRequest, Response } from '@chubbyts/chubbyts-http-types/dist/message';
import type { ResponseFactory } from '@chubbyts/chubbyts-http-types/dist/message-factory';
import type { OpenAPIComponentObject } from '@asteasolutions/zod-to-openapi/dist/openapi-registry';
import { useFunctionMock } from '@chubbyts/chubbyts-function-mock/dist/function-mock';
import { createOpenApiHandler, createPingHandler } from '../../src/handler';

export const getStream = async (stream: Stream): Promise<string> => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line functional/no-let
    let data = '';

    stream.on('data', (chunk) => (data += chunk));
    stream.on('end', () => resolve(data));
    stream.on('error', (error) => reject(error));
  });
};

describe('handler', () => {
  test('createPingHandler', async () => {
    const request = {} as unknown as ServerRequest;

    const responseBody = new PassThrough();

    const response = {
      headers: {},
      body: responseBody,
    } as unknown as Response;

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
      },
    });

    expect(JSON.parse(await getStream(response.body))).toEqual({ datetime: expect.any(String) });

    expect(responseFactoryMocks.length).toBe(0);
  });

  test('createOpenApiHandler', async () => {
    const request = {} as unknown as ServerRequest;

    const responseBody = new PassThrough();

    const response = {
      headers: {},
      body: responseBody,
    } as unknown as Response;

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

    const pingHandler = createOpenApiHandler(openApiObject, responseFactory);

    expect(await pingHandler(request)).toEqual({
      ...response,
      headers: {
        'content-type': ['application/json'],
        'cache-control': ['no-cache, no-store, must-revalidate'],
        pragma: ['no-cache'],
        expires: ['0'],
      },
    });

    expect(JSON.parse(await getStream(response.body))).toEqual({
      openapi: '3.0.0',
      info: { version: '1.0.0', title: 'Petstore', license: { name: 'MIT' } },
      servers: [{ url: 'https://localhost' }],
      components: { schemas: {}, parameters: {} },
      paths: {},
    });

    expect(responseFactoryMocks.length).toBe(0);
  });
});
