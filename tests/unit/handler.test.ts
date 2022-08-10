import { describe, expect, test } from '@jest/globals';
import { ServerRequest, Response } from '@chubbyts/chubbyts-http-types/dist/message';
import { createPingHandler } from '../../src/handler';
import { ResponseFactory } from '@chubbyts/chubbyts-http-types/dist/message-factory';
import { Duplex } from 'stream';
import { Db, Document, MongoClient, MongoError } from 'mongodb';

describe('createPingHandler', () => {
  test('pingable db', async () => {
    const end = jest.fn((givenChunk) => {
      const data = JSON.parse(givenChunk);

      expect(data).toEqual({
        datetime: expect.any(String),
        database: true,
      });
    });

    const body = { end } as unknown as Duplex;

    const request = {} as ServerRequest;
    const response = { body } as Response;

    const command: Db['command'] = jest.fn(async (givenDocument: Document) => {
      expect(givenDocument).toMatchInlineSnapshot(`
        Object {
          "ping": 1,
        }
      `);

      return {
        key1: 'value1',
        ok: 1,
        key2: 'value2',
      };
    });

    const db = jest.fn((givenDbName) => {
      expect(givenDbName).toBe(undefined);

      return { command } as Db;
    });

    const mongoClient = { db } as unknown as MongoClient;

    const responseFactory: ResponseFactory = jest.fn((givenStatus: number, givenReasonPhrase?: string) => {
      expect(givenStatus).toBe(200);
      expect(givenReasonPhrase).toBe(undefined);

      return response;
    });

    const pingHandler = createPingHandler(mongoClient, responseFactory);

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
    expect(command).toHaveBeenCalledTimes(1);
    expect(db).toHaveBeenCalledTimes(1);
    expect(responseFactory).toHaveBeenCalledTimes(1);
  });

  test('not pingable db', async () => {
    const end = jest.fn((givenChunk) => {
      const data = JSON.parse(givenChunk);

      expect(data).toEqual({
        datetime: expect.any(String),
        database: false,
      });
    });

    const body = { end } as unknown as Duplex;

    const request = {} as ServerRequest;
    const response = { body } as Response;

    const command: Db['command'] = jest.fn(async (givenDocument: Document) => {
      expect(givenDocument).toMatchInlineSnapshot(`
        Object {
          "ping": 1,
        }
      `);

      throw new MongoError('unknown error');
    });

    const db = jest.fn((givenDbName) => {
      expect(givenDbName).toBe(undefined);

      return { command } as Db;
    });

    const mongoClient = { db } as unknown as MongoClient;

    const responseFactory: ResponseFactory = jest.fn((givenStatus: number, givenReasonPhrase?: string) => {
      expect(givenStatus).toBe(200);
      expect(givenReasonPhrase).toBe(undefined);

      return response;
    });

    const pingHandler = createPingHandler(mongoClient, responseFactory);

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
    expect(command).toHaveBeenCalledTimes(1);
    expect(db).toHaveBeenCalledTimes(1);
    expect(responseFactory).toHaveBeenCalledTimes(1);
  });
});
