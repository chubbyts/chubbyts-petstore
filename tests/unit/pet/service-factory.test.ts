import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { Container } from '@chubbyts/chubbyts-dic-types/dist/container';
import { describe, expect, test } from '@jest/globals';
import type { Collection, Db, MongoClient } from 'mongodb';
import { useObjectMock } from '@chubbyts/chubbyts-function-mock/dist/object-mock';
import type { Response, ServerRequest } from '@chubbyts/chubbyts-http-types/dist/message';
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

describe('service-factory', () => {
  test('petCreateHandlerServiceFactory', async () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['decoder'],
        return: {},
      },
      {
        name: 'get',
        parameters: ['petPersist'],
        return: () => undefined,
      },
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
        parameters: ['petEnrichModel'],
        return: () => undefined,
      },
    ]);

    expect(await petCreateHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('petDeleteHandlerServiceFactory', async () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['petFindById'],
        return: () => undefined,
      },
      {
        name: 'get',
        parameters: ['petRemove'],
        return: () => undefined,
      },
      {
        name: 'get',
        parameters: ['responseFactory'],
        return: () => undefined,
      },
    ]);

    expect(await petDeleteHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('petEnrichModelServiceFactory', async () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['generatePath'],
        return: () => undefined,
      },
    ]);

    expect(petEnrichModelServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('petEnrichListServiceFactory', async () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['generatePath'],
        return: () => undefined,
      },
    ]);

    expect(petEnrichListServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('petFindByIdServiceFactory', async () => {
    const [collection, collectionMocks] = useObjectMock<Collection>([]);

    const [db, dbMocks] = useObjectMock<Db>([
      {
        name: 'collection',
        parameters: ['pets'],
        return: collection,
      },
    ]);

    const [mongoClient, mongoClientMocks] = useObjectMock<MongoClient>([
      {
        name: 'db',
        parameters: [],
        return: db,
      },
    ]);

    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['mongoClient'],
        return: Promise.resolve(mongoClient),
      },
    ]);

    expect(await petFindByIdServiceFactory(container)).toBeInstanceOf(Function);

    expect(collectionMocks.length).toBe(0);
    expect(dbMocks.length).toBe(0);
    expect(mongoClientMocks.length).toBe(0);
    expect(containerMocks.length).toBe(0);
  });

  test('petListHandlerServiceFactory', async () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['petResolveList'],
        return: () => undefined,
      },
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
        parameters: ['petEnrichList'],
        return: () => undefined,
      },
    ]);

    expect(await petListHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('petPersistServiceFactory', async () => {
    const [collection, collectionMocks] = useObjectMock<Collection>([]);

    const [db, dbMocks] = useObjectMock<Db>([
      {
        name: 'collection',
        parameters: ['pets'],
        return: collection,
      },
    ]);

    const [mongoClient, mongoClientMocks] = useObjectMock<MongoClient>([
      {
        name: 'db',
        parameters: [],
        return: db,
      },
    ]);

    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['mongoClient'],
        return: Promise.resolve(mongoClient),
      },
    ]);

    expect(await petPersistServiceFactory(container)).toBeInstanceOf(Function);

    expect(collectionMocks.length).toBe(0);
    expect(dbMocks.length).toBe(0);
    expect(mongoClientMocks.length).toBe(0);
    expect(containerMocks.length).toBe(0);
  });

  test('petReadHandlerServiceFactory', async () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['petFindById'],
        return: () => undefined,
      },
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
        parameters: ['petEnrichModel'],
        return: () => undefined,
      },
    ]);

    expect(await petReadHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('petRemoveServiceFactory', async () => {
    const [collection, collectionMocks] = useObjectMock<Collection>([]);

    const [db, dbMocks] = useObjectMock<Db>([
      {
        name: 'collection',
        parameters: ['pets'],
        return: collection,
      },
    ]);

    const [mongoClient, mongoClientMocks] = useObjectMock<MongoClient>([
      {
        name: 'db',
        parameters: [],
        return: db,
      },
    ]);

    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['mongoClient'],
        return: Promise.resolve(mongoClient),
      },
    ]);

    expect(await petRemoveServiceFactory(container)).toBeInstanceOf(Function);

    expect(collectionMocks.length).toBe(0);
    expect(dbMocks.length).toBe(0);
    expect(mongoClientMocks.length).toBe(0);
    expect(containerMocks.length).toBe(0);
  });

  test('petResolveListServiceFactory', async () => {
    const [collection, collectionMocks] = useObjectMock<Collection>([]);

    const [db, dbMocks] = useObjectMock<Db>([
      {
        name: 'collection',
        parameters: ['pets'],
        return: collection,
      },
    ]);

    const [mongoClient, mongoClientMocks] = useObjectMock<MongoClient>([
      {
        name: 'db',
        parameters: [],
        return: db,
      },
    ]);

    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['mongoClient'],
        return: Promise.resolve(mongoClient),
      },
    ]);

    expect(await petResolveListServiceFactory(container)).toBeInstanceOf(Function);

    expect(collectionMocks.length).toBe(0);
    expect(dbMocks.length).toBe(0);
    expect(mongoClientMocks.length).toBe(0);
    expect(containerMocks.length).toBe(0);
  });

  test('petOpenApiRegistryServiceDelegator', async () => {
    const [container, containerMocks] = useObjectMock<Container>([]);

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

    expect(containerMocks.length).toBe(0);
  });

  test('petRoutesServiceDelegator', async () => {
    const request = {} as ServerRequest;
    const response = {} as Response;

    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['petListHandler'],
        return: async () => response,
      },
      {
        name: 'get',
        parameters: ['petCreateHandler'],
        return: async () => response,
      },
      {
        name: 'get',
        parameters: ['petReadHandler'],
        return: async () => response,
      },
      {
        name: 'get',
        parameters: ['petUpdateHandler'],
        return: async () => response,
      },
      {
        name: 'get',
        parameters: ['petDeleteHandler'],
        return: async () => response,
      },
    ]);

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

    expect(await Promise.all(routes.map((route) => route.handler(request)))).toEqual(routes.map(() => response));

    expect(containerMocks.length).toBe(0);
  });

  test('petUpdateHandlerServiceFactory', async () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['petFindById'],
        return: () => undefined,
      },
      {
        name: 'get',
        parameters: ['decoder'],
        return: {},
      },
      {
        name: 'get',
        parameters: ['petPersist'],
        return: () => undefined,
      },
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
        parameters: ['petEnrichModel'],
        return: () => undefined,
      },
    ]);

    expect(await petUpdateHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });
});
