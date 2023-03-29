import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { Container } from '@chubbyts/chubbyts-dic-types/dist/container';
import { describe, expect, jest, test } from '@jest/globals';
import type { Db, MongoClient } from 'mongodb';
import {
  petCreateHandlerServiceFactory,
  petDeleteHandlerServiceFactory,
  petEnrichListServiceFactory,
  petEnrichModelServiceFactory,
  petFindByIdServiceFactory,
  petListHandlerServiceFactory,
  petOpenApiRegistryServiceDelegator,
  petPersistServiceFactory,
  petReadHandlerServiceFactory,
  petRemoveServiceFactory,
  petResolveListServiceFactory,
  petRoutesServiceDelegator,
  petUpdateHandlerServiceFactory,
} from '../../../src/pet/service-factory';
import type { CallMock } from '../service-factory.test';
import { createContainerGetCallsMock } from '../service-factory.test';

describe('service-factory', () => {
  test('petCreateHandlerServiceFactory', async () => {
    const calls: Array<CallMock> = [
      ['decoder', {}],
      ['petPersist', () => undefined],
      ['responseFactory', () => undefined],
      ['encoder', {}],
      ['petEnrichModel', {}],
    ];

    const get = jest.fn(createContainerGetCallsMock(calls));

    const container = { get } as unknown as Container;

    expect(await petCreateHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('petDeleteHandlerServiceFactory', async () => {
    const calls: Array<CallMock> = [
      ['petFindById', () => undefined],
      ['petRemove', () => undefined],
      ['responseFactory', () => undefined],
    ];

    const get = jest.fn(createContainerGetCallsMock(calls));

    const container = { get } as unknown as Container;

    expect(await petDeleteHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('petEnrichModelServiceFactory', async () => {
    const calls: Array<CallMock> = [['generatePath', () => undefined]];

    const get = jest.fn(createContainerGetCallsMock(calls));

    const container = { get } as unknown as Container;

    expect(petEnrichModelServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('petEnrichListServiceFactory', async () => {
    const calls: Array<CallMock> = [['generatePath', () => undefined]];

    const get = jest.fn(createContainerGetCallsMock(calls));

    const container = { get } as unknown as Container;

    expect(petEnrichListServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('petFindByIdServiceFactory', async () => {
    const collection = jest.fn(() => ({}));

    const db = jest.fn(() => ({ collection } as unknown as Db));

    const mongoClient: MongoClient = { db } as unknown as MongoClient;

    const calls: Array<CallMock> = [['mongoClient', mongoClient]];

    const get = jest.fn(createContainerGetCallsMock(calls));

    const container = { get } as unknown as Container;

    expect(await petFindByIdServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
    expect(db).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledTimes(1);
  });

  test('petListHandlerServiceFactory', async () => {
    const calls: Array<CallMock> = [
      ['petResolveList', () => undefined],
      ['responseFactory', () => undefined],
      ['encoder', {}],
      ['petEnrichList', {}],
    ];

    const get = jest.fn(createContainerGetCallsMock(calls));

    const container = { get } as unknown as Container;

    expect(await petListHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('petPersistServiceFactory', async () => {
    const collection = jest.fn(() => ({}));

    const db = jest.fn(() => ({ collection } as unknown as Db));

    const mongoClient: MongoClient = { db } as unknown as MongoClient;

    const calls: Array<CallMock> = [['mongoClient', mongoClient]];

    const get = jest.fn(createContainerGetCallsMock(calls));

    const container = { get } as unknown as Container;

    expect(await petPersistServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
    expect(db).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledTimes(1);
  });

  test('petReadHandlerServiceFactory', async () => {
    const calls: Array<CallMock> = [
      ['petFindById', () => undefined],
      ['responseFactory', () => undefined],
      ['encoder', {}],
      ['petEnrichModel', {}],
    ];

    const get = jest.fn(createContainerGetCallsMock(calls));

    const container = { get } as unknown as Container;

    expect(await petReadHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('petRemoveServiceFactory', async () => {
    const collection = jest.fn(() => ({}));

    const db = jest.fn(() => ({ collection } as unknown as Db));

    const mongoClient: MongoClient = { db } as unknown as MongoClient;

    const calls: Array<CallMock> = [['mongoClient', mongoClient]];

    const get = jest.fn(createContainerGetCallsMock(calls));

    const container = { get } as unknown as Container;

    expect(await petRemoveServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
    expect(db).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledTimes(1);
  });

  test('petResolveListServiceFactory', async () => {
    const collection = jest.fn(() => ({}));

    const db = jest.fn(() => ({ collection } as unknown as Db));

    const mongoClient: MongoClient = { db } as unknown as MongoClient;

    const calls: Array<CallMock> = [['mongoClient', mongoClient]];

    const get = jest.fn(createContainerGetCallsMock(calls));

    const container = { get } as unknown as Container;

    expect(await petResolveListServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
    expect(db).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledTimes(1);
  });

  test('petOpenApiRegistryServiceDelegator', async () => {
    const calls: Array<CallMock> = [];

    const get = jest.fn(createContainerGetCallsMock(calls));

    const container = { get } as unknown as Container;

    const factory = () => new OpenAPIRegistry();

    const openApiRegistry = petOpenApiRegistryServiceDelegator(container, 'petOpenApiRegistry', factory);

    expect(openApiRegistry).toMatchObject({
      definitions: [
        { route: { method: 'get', path: '/api/pets' } },
        { route: { method: 'post', path: '/api/pets' } },
        { route: { method: 'get', path: '/api/pets/{id}' } },
        { route: { method: 'put', path: '/api/pets/{id}' } },
        { route: { method: 'delete', path: '/api/pets/{id}' } },
      ],
    });

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('petRoutesServiceDelegator', () => {
    const calls: Array<CallMock> = [];

    const get = jest.fn(createContainerGetCallsMock(calls));

    const container = { get } as unknown as Container;

    const routes = petRoutesServiceDelegator(container, 'name', () => []);

    expect(routes).toBeInstanceOf(Array);

    expect(routes).toMatchInlineSnapshot(`
      [
        {
          "_route": "Route",
          "attributes": {},
          "handler": [Function],
          "method": "GET",
          "middlewares": [
            [Function],
            [Function],
          ],
          "name": "pet_list",
          "path": "/api/pets",
          "pathOptions": {},
        },
        {
          "_route": "Route",
          "attributes": {},
          "handler": [Function],
          "method": "POST",
          "middlewares": [
            [Function],
            [Function],
            [Function],
          ],
          "name": "pet_create",
          "path": "/api/pets",
          "pathOptions": {},
        },
        {
          "_route": "Route",
          "attributes": {},
          "handler": [Function],
          "method": "GET",
          "middlewares": [
            [Function],
            [Function],
          ],
          "name": "pet_read",
          "path": "/api/pets/:id",
          "pathOptions": {},
        },
        {
          "_route": "Route",
          "attributes": {},
          "handler": [Function],
          "method": "PUT",
          "middlewares": [
            [Function],
            [Function],
            [Function],
          ],
          "name": "pet_update",
          "path": "/api/pets/:id",
          "pathOptions": {},
        },
        {
          "_route": "Route",
          "attributes": {},
          "handler": [Function],
          "method": "DELETE",
          "middlewares": [
            [Function],
            [Function],
          ],
          "name": "pet_delete",
          "path": "/api/pets/:id",
          "pathOptions": {},
        },
      ]
    `);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });

  test('petUpdateHandlerServiceFactory', async () => {
    const calls: Array<CallMock> = [
      ['petFindById', () => undefined],
      ['decoder', {}],
      ['petPersist', () => undefined],
      ['responseFactory', () => undefined],
      ['encoder', {}],
      ['petEnrichModel', {}],
    ];

    const get = jest.fn(createContainerGetCallsMock(calls));

    const container = { get } as unknown as Container;

    expect(await petUpdateHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(get).toHaveBeenCalledTimes(calls.length);
  });
});
