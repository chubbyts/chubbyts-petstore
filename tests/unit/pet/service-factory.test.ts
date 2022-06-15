import { Container } from '@chubbyts/chubbyts-dic-types/dist/container';
import { describe, expect, test } from '@jest/globals';
import { MongoClient } from 'mongodb';
import {
  petCreateHandlerServiceFactory,
  petDeleteHandlerServiceFactory,
  petFindByIdServiceFactory,
  petListHandlerServiceFactory,
  petPersistServiceFactory,
  petReadHandlerServiceFactory,
  petRemoveServiceFactory,
  petResolveListServiceFactory,
  petRoutesServiceDelegator,
  petUpdateHandlerServiceFactory,
} from '../../../src/pet/service-factory';

const createGetMock = (givenCalls: Array<[string, unknown]>) => {
  const calls = [...givenCalls];

  return (givenId: string) => {
    const call = calls.shift();
    if (!call) {
      fail('Missing call');
    }

    const [id, service] = call;

    expect(givenId).toBe(id);

    return service;
  };
};

describe('service-factory', () => {
  test('petListHandlerServiceFactory', async () => {
    const calls: Array<[string, unknown]> = [
      ['petResolveList', () => undefined],
      ['responseFactory', () => undefined],
      ['encoder', {}],
    ];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(await petListHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('petCreateHandlerServiceFactory', async () => {
    const calls: Array<[string, unknown]> = [
      ['decoder', {}],
      ['petPersist', () => undefined],
      ['responseFactory', () => undefined],
      ['encoder', {}],
    ];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(await petCreateHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('petReadHandlerServiceFactory', async () => {
    const calls: Array<[string, unknown]> = [
      ['petFindById', () => undefined],
      ['responseFactory', () => undefined],
      ['encoder', {}],
    ];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(await petReadHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('petUpdateHandlerServiceFactory', async () => {
    const calls: Array<[string, unknown]> = [
      ['petFindById', () => undefined],
      ['decoder', {}],
      ['petPersist', () => undefined],
      ['responseFactory', () => undefined],
      ['encoder', {}],
    ];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(await petUpdateHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('petDeleteHandlerServiceFactory', async () => {
    const calls: Array<[string, unknown]> = [
      ['petFindById', () => undefined],
      ['petRemove', () => undefined],
      ['responseFactory', () => undefined],
    ];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(await petDeleteHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('petResolveListServiceFactory', async () => {
    const calls: Array<[string, unknown]> = [['mongoClient', {}]];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(await petResolveListServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('petFindByIdServiceFactory', async () => {
    const calls: Array<[string, unknown]> = [['mongoClient', {}]];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(await petFindByIdServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('petPersistServiceFactory', async () => {
    const calls: Array<[string, unknown]> = [['mongoClient', {}]];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(await petPersistServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('petRemoveServiceFactory', async () => {
    const calls: Array<[string, unknown]> = [['mongoClient', {}]];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    expect(await petRemoveServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('petRoutesServiceDelegator', () => {
    const calls: Array<[string, unknown]> = [];

    const get = jest.fn(createGetMock(calls));

    const container = { get } as unknown as Container;

    const routes = petRoutesServiceDelegator(container, 'name', () => []);

    expect(routes).toBeInstanceOf(Array);

    expect(routes).toMatchInlineSnapshot(`
      Array [
        Object {
          "_route": "Route",
          "attributes": Object {},
          "handler": [Function],
          "method": "GET",
          "middlewares": Array [
            [Function],
            [Function],
          ],
          "name": "pet_list",
          "path": "/api/pets",
          "pathOptions": Object {},
        },
        Object {
          "_route": "Route",
          "attributes": Object {},
          "handler": [Function],
          "method": "POST",
          "middlewares": Array [
            [Function],
            [Function],
            [Function],
          ],
          "name": "pet_create",
          "path": "/api/pets",
          "pathOptions": Object {},
        },
        Object {
          "_route": "Route",
          "attributes": Object {},
          "handler": [Function],
          "method": "GET",
          "middlewares": Array [
            [Function],
            [Function],
          ],
          "name": "pet_read",
          "path": "/api/pets/:id",
          "pathOptions": Object {},
        },
        Object {
          "_route": "Route",
          "attributes": Object {},
          "handler": [Function],
          "method": "PUT",
          "middlewares": Array [
            [Function],
            [Function],
            [Function],
          ],
          "name": "pet_update",
          "path": "/api/pets/:id",
          "pathOptions": Object {},
        },
        Object {
          "_route": "Route",
          "attributes": Object {},
          "handler": [Function],
          "method": "DELETE",
          "middlewares": Array [
            [Function],
            [Function],
          ],
          "name": "pet_delete",
          "path": "/api/pets/:id",
          "pathOptions": Object {},
        },
      ]
    `);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });
});
