import { describe, expect, test } from '@jest/globals';
import { ServerRequest, Response } from '@chubbyts/chubbyts-http-types/dist/message';
import { createOpenApiHandler, createPingHandler } from '../../src/handler';
import { ResponseFactory } from '@chubbyts/chubbyts-http-types/dist/message-factory';
import { Duplex } from 'stream';
import { OpenAPIComponentObject } from '@asteasolutions/zod-to-openapi/dist/openapi-registry';

describe('handler', () => {
  test('createPingHandler', async () => {
    const end = jest.fn((givenChunk) => {
      const data = JSON.parse(givenChunk);

      expect(data).toEqual({ datetime: expect.any(String) });
    });

    const body = { end } as unknown as Duplex;

    const request = {} as ServerRequest;
    const response = { body } as Response;

    const responseFactory: ResponseFactory = jest.fn((givenStatus: number, givenReasonPhrase?: string) => {
      expect(givenStatus).toBe(200);
      expect(givenReasonPhrase).toBeUndefined();

      return response;
    });

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

    expect(end).toHaveBeenCalledTimes(1);
    expect(responseFactory).toHaveBeenCalledTimes(1);
  });

  test('createOpenApiHandler', async () => {
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

    const end = jest.fn((givenChunk) => {
      const data = JSON.parse(givenChunk);

      expect(data).toEqual(openApiObject);
    });

    const body = { end } as unknown as Duplex;

    const request = {} as ServerRequest;
    const response = { body } as Response;

    const responseFactory: ResponseFactory = jest.fn((givenStatus: number, givenReasonPhrase?: string) => {
      expect(givenStatus).toBe(200);
      expect(givenReasonPhrase).toBeUndefined();

      return response;
    });

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

    expect(end).toHaveBeenCalledTimes(1);
    expect(responseFactory).toHaveBeenCalledTimes(1);
  });
});
