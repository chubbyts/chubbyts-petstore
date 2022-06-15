import { describe, expect, test } from '@jest/globals';
import { ServerRequest, Response } from '@chubbyts/chubbyts-http-types/dist/message';
import { createPingHandler } from '../../src/handler';
import { ResponseFactory } from '@chubbyts/chubbyts-http-types/dist/message-factory';
import { Duplex } from 'stream';

describe('handler', () => {
  test('createPingHandler', async () => {
    const end = jest.fn((givenChunk) => {
      expect(JSON.parse(givenChunk)).toHaveProperty('datetime');
    });

    const body = { end } as unknown as Duplex;

    const request = {} as ServerRequest;
    const response = { body } as Response;

    const responseFactory: ResponseFactory = jest.fn((givenStatus: number, givenReasonPhrase?: string) => {
      expect(givenStatus).toBe(200);
      expect(givenReasonPhrase).toBe(undefined);

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
});
