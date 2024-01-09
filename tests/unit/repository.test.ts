import type { List, Model } from '@chubbyts/chubbyts-api/dist/model';
import { describe, expect, test } from '@jest/globals';
import type { Collection, Db, FindCursor, MongoClient, WithId } from 'mongodb';
import { ObjectId } from 'mongodb';
import { useObjectMock } from '@chubbyts/chubbyts-function-mock/dist/object-mock';
import { createFindOneById, createPersist, createRemove, createResolveList } from '../../src/repository';

describe('repository', () => {
  test('createResolveList', async () => {
    type SomeModel = Model<{ name: string }>;

    const _id = new ObjectId();

    const modelWithId: WithId<SomeModel> = {
      _id,
      id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9',
      createdAt: new Date('2022-06-12T20:08:24.793Z'),
      updatedAt: new Date('2022-06-12T20:08:35.208Z'),
      name: 'name1',
    };

    const list: List<SomeModel> = {
      offset: 1,
      limit: 1,
      filters: { name: 'name1' },
      sort: { name: 'desc' },
      items: [],
      count: 0,
    };

    const [cursor, cursorMocks] = useObjectMock<FindCursor<WithId<SomeModel>>>([
      {
        name: 'skip',
        parameters: [1],
        returnSelf: true,
      },
      {
        name: 'limit',
        parameters: [1],
        returnSelf: true,
      },
      {
        name: 'sort',
        parameters: [
          {
            name: 'desc',
          },
        ],
        returnSelf: true,
      },
      {
        name: 'toArray',
        parameters: [],
        return: Promise.resolve([modelWithId]),
      },
    ]);

    const [collection, collectionMocks] = useObjectMock<Collection>([
      {
        name: 'find',
        parameters: [
          {
            name: 'name1',
          },
        ],
        return: cursor,
      },
      {
        name: 'countDocuments',
        parameters: [
          {
            name: 'name1',
          },
        ],
        return: Promise.resolve(2),
      },
    ]);

    const [db, dbMocks] = useObjectMock<Db>([
      {
        name: 'collection',
        parameters: ['collectionName'],
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

    const collectionName = 'collectionName';

    const resolveList = createResolveList(mongoClient, collectionName);

    expect(await resolveList(list)).toMatchInlineSnapshot(`
      {
        "count": 2,
        "filters": {
          "name": "name1",
        },
        "items": [
          {
            "createdAt": 2022-06-12T20:08:24.793Z,
            "id": "2b6491ac-677e-4b11-98dc-c124ae1c57e9",
            "name": "name1",
            "updatedAt": 2022-06-12T20:08:35.208Z,
          },
        ],
        "limit": 1,
        "offset": 1,
        "sort": {
          "name": "desc",
        },
      }
    `);

    expect(cursorMocks.length).toBe(0);
    expect(collectionMocks.length).toBe(0);
    expect(dbMocks.length).toBe(0);
    expect(mongoClientMocks.length).toBe(0);
  });

  describe('createFindOneById', () => {
    test('with found model', async () => {
      type SomeModel = Model<{ name: string }>;

      const model: SomeModel = {
        id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9',
        createdAt: new Date('2022-06-12T20:08:24.793Z'),
        updatedAt: new Date('2022-06-12T20:08:35.208Z'),
        name: 'name1',
      };

      const collectionName = 'collectionName';

      const [collection, collectionMocks] = useObjectMock<Collection>([
        {
          name: 'findOne',
          parameters: [
            {
              id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9',
            },
          ],
          return: Promise.resolve({ _id: new ObjectId(), ...model }),
        },
      ]);

      const [db, dbMocks] = useObjectMock<Db>([
        {
          name: 'collection',
          parameters: [collectionName],
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

      const FindOneById = createFindOneById(mongoClient, collectionName);

      expect(await FindOneById('2b6491ac-677e-4b11-98dc-c124ae1c57e9')).toMatchInlineSnapshot(`
      {
        "createdAt": 2022-06-12T20:08:24.793Z,
        "id": "2b6491ac-677e-4b11-98dc-c124ae1c57e9",
        "name": "name1",
        "updatedAt": 2022-06-12T20:08:35.208Z,
      }
    `);

      expect(collectionMocks.length).toBe(0);
      expect(dbMocks.length).toBe(0);
      expect(mongoClientMocks.length).toBe(0);
    });

    test('without found model', async () => {
      const collectionName = 'collectionName';

      const [collection, collectionMocks] = useObjectMock<Collection>([
        {
          name: 'findOne',
          parameters: [
            {
              id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9',
            },
          ],
          return: Promise.resolve(null),
        },
      ]);

      const [db, dbMocks] = useObjectMock<Db>([
        {
          name: 'collection',
          parameters: [collectionName],
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

      const FindOneById = createFindOneById(mongoClient, collectionName);

      expect(await FindOneById('2b6491ac-677e-4b11-98dc-c124ae1c57e9')).toBeUndefined();

      expect(collectionMocks.length).toBe(0);
      expect(dbMocks.length).toBe(0);
      expect(mongoClientMocks.length).toBe(0);
    });
  });

  test('createPersist', async () => {
    type SomeModel = Model<{ name: string }>;

    const model: SomeModel = {
      id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9',
      createdAt: new Date('2022-06-12T20:08:24.793Z'),
      name: 'name1',
    };

    const _id = new ObjectId();

    const collectionName = 'collectionName';

    const [collection, collectionMocks] = useObjectMock<Collection>([
      {
        name: 'replaceOne',
        parameters: [
          {
            id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9',
          },
          model,
          { upsert: true },
        ],
        return: Promise.resolve({
          acknowledged: true,
          matchedCount: 1,
          modifiedCount: 0,
          upsertedCount: 1,
          upsertedId: _id,
        }),
      },
      {
        name: 'findOne',
        parameters: [
          {
            id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9',
          },
        ],
        return: Promise.resolve({ _id, updatedAt: new Date('2022-06-12T20:08:35.208Z'), ...model }),
      },
    ]);

    const [db, dbMocks] = useObjectMock<Db>([
      {
        name: 'collection',
        parameters: [collectionName],
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

    const persist = createPersist(mongoClient, collectionName);

    expect(await persist(model)).toMatchInlineSnapshot(`
    {
      "createdAt": 2022-06-12T20:08:24.793Z,
      "id": "2b6491ac-677e-4b11-98dc-c124ae1c57e9",
      "name": "name1",
      "updatedAt": 2022-06-12T20:08:35.208Z,
    }
  `);

    expect(collectionMocks.length).toBe(0);
    expect(dbMocks.length).toBe(0);
    expect(mongoClientMocks.length).toBe(0);
  });

  test('createRemove', async () => {
    type SomeModel = Model<{ name: string }>;

    const model: SomeModel = {
      id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9',
      createdAt: new Date('2022-06-12T20:08:24.793Z'),
      name: 'name1',
    };

    const collectionName = 'collectionName';

    const [collection, collectionMocks] = useObjectMock<Collection>([
      {
        name: 'deleteOne',
        parameters: [
          {
            id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9',
          },
        ],
        return: Promise.resolve({ acknowledged: true, deletedCount: 1 }),
      },
    ]);

    const [db, dbMocks] = useObjectMock<Db>([
      {
        name: 'collection',
        parameters: [collectionName],
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

    const remove = createRemove(mongoClient, collectionName);

    await remove(model);

    expect(collectionMocks.length).toBe(0);
    expect(dbMocks.length).toBe(0);
    expect(mongoClientMocks.length).toBe(0);
  });
});
