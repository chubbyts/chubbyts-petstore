import type { InputModelListSchema, Model, ModelList } from '@chubbyts/chubbyts-undici-api/dist/model';
import { describe, expect, test } from 'vitest';
import type { AggregationCursor, Collection, Db, MongoClient, WithId } from 'mongodb';
import { ObjectId } from 'mongodb';
import { useObjectMock } from '@chubbyts/chubbyts-function-mock/dist/object-mock';
import type { z } from 'zod';
import {
  aggregationSort,
  convertSort,
  createFindModelById,
  createPersistModel,
  createRemoveModel,
  createResolveModelList,
} from '../../src/repository.js';

describe('repository', () => {
  test('convertSort', () => {
    expect(convertSort({ key1: 'asc', key2: 'desc', key3: undefined })).toMatchInlineSnapshot(`
      {
        "key1": 1,
        "key2": -1,
      }
    `);
  });

  describe('aggregationSort', () => {
    test('without values', () => {
      expect(aggregationSort({ key1: undefined })).toMatchInlineSnapshot('[]');
    });

    test('with values', () => {
      expect(aggregationSort({ key1: 'asc', key2: 'desc', key3: undefined })).toMatchInlineSnapshot(`
        [
          {
            "$sort": {
              "key1": 1,
              "key2": -1,
            },
          },
        ]
      `);
    });
  });

  describe('createResolveModelList', () => {
    test('without data', async () => {
      type InputSomeModelSchema = z.ZodObject<{ name: z.ZodString }>;

      const list: ModelList<InputSomeModelSchema, InputModelListSchema> = {
        offset: 1,
        limit: 1,
        filters: { name: 'name1' },
        sort: { name: 'desc' },
        items: [],
        count: 0,
      };

      const [aggregationCursor, aggregationCursorMocks] = useObjectMock<AggregationCursor>([
        {
          name: 'toArray',
          parameters: [],
          return: Promise.resolve([
            {
              items: [],
              total: [],
            },
          ]),
        },
      ]);

      const [collection, collectionMocks] = useObjectMock<Collection>([
        {
          name: 'aggregate',
          parameters: [
            [
              { $match: { name: 'name1' } },
              {
                $facet: {
                  items: [{ $sort: { name: -1 } }, { $skip: 1 }, { $limit: 1 }],
                  total: [{ $count: 'count' }],
                },
              },
            ],
          ],
          return: aggregationCursor,
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

      const resolveModelList = createResolveModelList(mongoClient, collectionName);

      expect(await resolveModelList(list)).toMatchInlineSnapshot(`
        {
          "count": 0,
          "filters": {
            "name": "name1",
          },
          "items": [],
          "limit": 1,
          "offset": 1,
          "sort": {
            "name": "desc",
          },
        }
      `);

      expect(aggregationCursorMocks).toHaveLength(0);
      expect(collectionMocks).toHaveLength(0);
      expect(dbMocks).toHaveLength(0);
      expect(mongoClientMocks).toHaveLength(0);
    });

    test('with data', async () => {
      type InputSomeModelSchema = z.ZodObject<{ name: z.ZodString }>;

      type SomeModel = Model<InputSomeModelSchema>;

      const objectId = new ObjectId();

      const modelWithId: WithId<SomeModel> = {
        _id: objectId,
        id: '019c201f-6a83-7696-9899-50fbf7b2278d',
        createdAt: new Date('2022-06-12T20:08:24.793Z'),
        updatedAt: new Date('2022-06-12T20:08:35.208Z'),
        name: 'name1',
      };

      const list: ModelList<InputSomeModelSchema, InputModelListSchema> = {
        offset: 1,
        limit: 1,
        filters: { name: 'name1' },
        sort: { name: 'desc' },
        items: [],
        count: 0,
      };

      const [aggregationCursor, aggregationCursorMocks] = useObjectMock<AggregationCursor>([
        {
          name: 'toArray',
          parameters: [],
          return: Promise.resolve([
            {
              items: [modelWithId],
              total: [{ count: 2 }],
            },
          ]),
        },
      ]);

      const [collection, collectionMocks] = useObjectMock<Collection>([
        {
          name: 'aggregate',
          parameters: [
            [
              { $match: { name: 'name1' } },
              {
                $facet: {
                  items: [{ $sort: { name: -1 } }, { $skip: 1 }, { $limit: 1 }],
                  total: [{ $count: 'count' }],
                },
              },
            ],
          ],
          return: aggregationCursor,
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

      const resolveModelList = createResolveModelList(mongoClient, collectionName);

      expect(await resolveModelList(list)).toMatchInlineSnapshot(`
      {
        "count": 2,
        "filters": {
          "name": "name1",
        },
        "items": [
          {
            "createdAt": 2022-06-12T20:08:24.793Z,
            "id": "019c201f-6a83-7696-9899-50fbf7b2278d",
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

      expect(aggregationCursorMocks).toHaveLength(0);
      expect(collectionMocks).toHaveLength(0);
      expect(dbMocks).toHaveLength(0);
      expect(mongoClientMocks).toHaveLength(0);
    });
  });

  describe('createFindModelById', () => {
    test('with found model', async () => {
      type SomeModel = Model<z.ZodObject<{ name: z.ZodString }>>;

      const model: SomeModel = {
        id: '019c201f-6a83-7696-9899-50fbf7b2278d',
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
              id: '019c201f-6a83-7696-9899-50fbf7b2278d',
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

      const FindModelById = createFindModelById(mongoClient, collectionName);

      expect(await FindModelById('019c201f-6a83-7696-9899-50fbf7b2278d')).toMatchInlineSnapshot(`
      {
        "createdAt": 2022-06-12T20:08:24.793Z,
        "id": "019c201f-6a83-7696-9899-50fbf7b2278d",
        "name": "name1",
        "updatedAt": 2022-06-12T20:08:35.208Z,
      }
    `);

      expect(collectionMocks).toHaveLength(0);
      expect(dbMocks).toHaveLength(0);
      expect(mongoClientMocks).toHaveLength(0);
    });

    test('without found model', async () => {
      const collectionName = 'collectionName';

      const [collection, collectionMocks] = useObjectMock<Collection>([
        {
          name: 'findOne',
          parameters: [
            {
              id: '019c201f-6a83-7696-9899-50fbf7b2278d',
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

      const FindModelById = createFindModelById(mongoClient, collectionName);

      expect(await FindModelById('019c201f-6a83-7696-9899-50fbf7b2278d')).toBeUndefined();

      expect(collectionMocks).toHaveLength(0);
      expect(dbMocks).toHaveLength(0);
      expect(mongoClientMocks).toHaveLength(0);
    });
  });

  describe('createPersistModel', () => {
    test('success', async () => {
      type SomeModel = Model<z.ZodObject<{ name: z.ZodString }>>;

      const model: SomeModel = {
        id: '019c201f-6a83-7696-9899-50fbf7b2278d',
        createdAt: new Date('2022-06-12T20:08:24.793Z'),
        name: 'name1',
      };

      const objectId = new ObjectId();

      const collectionName = 'collectionName';

      const [collection, collectionMocks] = useObjectMock<Collection>([
        {
          name: 'replaceOne',
          parameters: [
            {
              id: '019c201f-6a83-7696-9899-50fbf7b2278d',
            },
            model,
            { upsert: true },
          ],
          return: Promise.resolve({
            acknowledged: true,
            matchedCount: 1,
            modifiedCount: 0,
            upsertedCount: 1,
            upsertedId: objectId,
          }),
        },
        {
          name: 'findOne',
          parameters: [
            {
              id: '019c201f-6a83-7696-9899-50fbf7b2278d',
            },
          ],
          return: Promise.resolve({ _id: objectId, updatedAt: new Date('2022-06-12T20:08:35.208Z'), ...model }),
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

      const persistModel = createPersistModel(mongoClient, collectionName);

      expect(await persistModel(model)).toMatchInlineSnapshot(`
        {
          "createdAt": 2022-06-12T20:08:24.793Z,
          "id": "019c201f-6a83-7696-9899-50fbf7b2278d",
          "name": "name1",
          "updatedAt": 2022-06-12T20:08:35.208Z,
        }
      `);

      expect(collectionMocks).toHaveLength(0);
      expect(dbMocks).toHaveLength(0);
      expect(mongoClientMocks).toHaveLength(0);
    });

    test('fail', async () => {
      type SomeModel = Model<z.ZodObject<{ name: z.ZodString }>>;

      const model: SomeModel = {
        id: '019c201f-6a83-7696-9899-50fbf7b2278d',
        createdAt: new Date('2022-06-12T20:08:24.793Z'),
        name: 'name1',
      };

      const objectId = new ObjectId();

      const collectionName = 'collectionName';

      const [collection, collectionMocks] = useObjectMock<Collection>([
        {
          name: 'replaceOne',
          parameters: [
            {
              id: '019c201f-6a83-7696-9899-50fbf7b2278d',
            },
            model,
            { upsert: true },
          ],
          return: Promise.resolve({
            acknowledged: true,
            matchedCount: 1,
            modifiedCount: 0,
            upsertedCount: 1,
            upsertedId: objectId,
          }),
        },
        {
          name: 'findOne',
          parameters: [
            {
              id: '019c201f-6a83-7696-9899-50fbf7b2278d',
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

      const persistModel = createPersistModel(mongoClient, collectionName);

      try {
        await persistModel(model);
        throw new Error('expect fail');
      } catch (e) {
        expect(e).toMatchInlineSnapshot(
          '[Error: Failed to persist model with id: 019c201f-6a83-7696-9899-50fbf7b2278d]',
        );
      }

      expect(collectionMocks).toHaveLength(0);
      expect(dbMocks).toHaveLength(0);
      expect(mongoClientMocks).toHaveLength(0);
    });
  });

  test('createRemoveModel', async () => {
    type SomeModel = Model<z.ZodObject<{ name: z.ZodString }>>;

    const model: SomeModel = {
      id: '019c201f-6a83-7696-9899-50fbf7b2278d',
      createdAt: new Date('2022-06-12T20:08:24.793Z'),
      name: 'name1',
    };

    const collectionName = 'collectionName';

    const [collection, collectionMocks] = useObjectMock<Collection>([
      {
        name: 'deleteOne',
        parameters: [
          {
            id: '019c201f-6a83-7696-9899-50fbf7b2278d',
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

    const removemodel = createRemoveModel(mongoClient, collectionName);

    await removemodel(model);

    expect(collectionMocks).toHaveLength(0);
    expect(dbMocks).toHaveLength(0);
    expect(mongoClientMocks).toHaveLength(0);
  });
});
