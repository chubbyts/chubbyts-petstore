import { List, Model } from '@chubbyts/chubbyts-api/dist/model';
import { describe, expect, test } from '@jest/globals';
import {
  Collection,
  Db,
  DeleteResult,
  Filter,
  FindCursor,
  FindOptions,
  MongoClient,
  ObjectId,
  Sort,
  UpdateResult,
  WithId,
  WithoutId,
} from 'mongodb';
import { createFindById, createPersist, createRemove, createResolveList } from '../../src/repository';

describe('createResolveList', () => {
  test('with all arguments', async () => {
    type SomeModel = Model & { name: string };

    const list: List = {
      offset: 1,
      limit: 1,
      filters: { name: 'name1' },
      sort: { name: 'desc' },
      items: [],
      count: 0,
    };

    const skip: FindCursor<WithId<SomeModel>>['skip'] = jest.fn((givenValue: number): FindCursor<WithId<SomeModel>> => {
      expect(givenValue).toBe(list.offset);

      return cursor;
    });

    const limit: FindCursor<WithId<SomeModel>>['limit'] = jest.fn(
      (givenValue: number): FindCursor<WithId<SomeModel>> => {
        expect(givenValue).toBe(list.limit);

        return cursor;
      },
    );

    const sort: FindCursor<WithId<SomeModel>>['sort'] = jest.fn((givenValue: Sort): FindCursor<WithId<SomeModel>> => {
      expect(givenValue).toBe(list.sort);

      return cursor;
    });

    const toArray = jest.fn(async (): Promise<Array<SomeModel>> => {
      return [
        {
          id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9',
          createdAt: new Date('2022-06-12T20:08:24.793Z'),
          updatedAt: new Date('2022-06-12T20:08:35.208Z'),
          name: 'name1',
        },
      ];
    });

    const cursor = {
      skip,
      limit,
      sort,
      toArray,
    } as unknown as FindCursor<WithId<SomeModel>>;

    const find = jest.fn((givenFilters: Filter<SomeModel>, options?: FindOptions): FindCursor<WithId<SomeModel>> => {
      expect(givenFilters).toBe(list.filters);

      return cursor;
    });

    const countDocuments = jest.fn(async (givenFilters: Filter<SomeModel>): Promise<number> => {
      expect(givenFilters).toBe(list.filters);

      return 2;
    });

    const collection = jest.fn((): Collection => ({ find, countDocuments } as unknown as Collection));

    const db = jest.fn(() => ({ collection } as unknown as Db));

    const mongoClient: MongoClient = { db } as unknown as MongoClient;
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

    expect(collection).toHaveBeenCalledTimes(1);
    expect(db).toHaveBeenCalledTimes(1);
    expect(countDocuments).toHaveBeenCalledTimes(1);
    expect(find).toHaveBeenCalledTimes(1);
    expect(toArray).toHaveBeenCalledTimes(1);
    expect(sort).toHaveBeenCalledTimes(1);
    expect(limit).toHaveBeenCalledTimes(1);
    expect(skip).toHaveBeenCalledTimes(1);
  });
});

describe('createFindById', () => {
  test('with found model', async () => {
    type SomeModel = Model & { name: string };

    const model: SomeModel = {
      id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9',
      createdAt: new Date('2022-06-12T20:08:24.793Z'),
      updatedAt: new Date('2022-06-12T20:08:35.208Z'),
      name: 'name1',
    };

    const findOne = jest.fn(
      async (givenFilters: Filter<SomeModel>, options?: FindOptions): Promise<WithId<SomeModel> | null> => {
        expect(givenFilters).toEqual({ id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9' });

        return { _id: new ObjectId(), ...model };
      },
    );

    const collection = jest.fn((): Collection => ({ findOne } as unknown as Collection));

    const db = jest.fn(() => ({ collection } as unknown as Db));

    const mongoClient: MongoClient = { db } as unknown as MongoClient;
    const collectionName = 'collectionName';

    const findById = createFindById(mongoClient, collectionName);

    expect(await findById('2b6491ac-677e-4b11-98dc-c124ae1c57e9')).toMatchInlineSnapshot(`
      {
        "createdAt": 2022-06-12T20:08:24.793Z,
        "id": "2b6491ac-677e-4b11-98dc-c124ae1c57e9",
        "name": "name1",
        "updatedAt": 2022-06-12T20:08:35.208Z,
      }
    `);

    expect(collection).toHaveBeenCalledTimes(1);
    expect(db).toHaveBeenCalledTimes(1);
    expect(findOne).toHaveBeenCalledTimes(1);
  });

  test('without found model', async () => {
    type SomeModel = Model & { name: string };

    const findOne = jest.fn(
      async (givenFilters: Filter<SomeModel>, options?: FindOptions): Promise<WithId<SomeModel> | null> => {
        expect(givenFilters).toEqual({ id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9' });

        return null;
      },
    );

    const collection = jest.fn((): Collection => ({ findOne } as unknown as Collection));

    const db = jest.fn(() => ({ collection } as unknown as Db));

    const mongoClient: MongoClient = { db } as unknown as MongoClient;
    const collectionName = 'collectionName';

    const findById = createFindById(mongoClient, collectionName);

    expect(await findById('2b6491ac-677e-4b11-98dc-c124ae1c57e9')).toBe(undefined);

    expect(collection).toHaveBeenCalledTimes(1);
    expect(db).toHaveBeenCalledTimes(1);
    expect(findOne).toHaveBeenCalledTimes(1);
  });
});

test('createPersist', async () => {
  type SomeModel = Model & { name: string };

  const model: SomeModel = {
    id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9',
    createdAt: new Date('2022-06-12T20:08:24.793Z'),
    name: 'name1',
  };

  const _id = new ObjectId();

  const replaceOne: Collection['replaceOne'] = jest.fn(
    async (givenFilters: Filter<SomeModel>, replacement: WithoutId<SomeModel>): Promise<UpdateResult> => {
      expect(givenFilters).toEqual({ id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9' });
      expect(replacement).toEqual(model);

      return { acknowledged: true, matchedCount: 1, modifiedCount: 0, upsertedCount: 1, upsertedId: _id };
    },
  );

  const findOne = jest.fn(
    async (givenFilters: Filter<SomeModel>, options?: FindOptions): Promise<WithId<SomeModel> | null> => {
      expect(givenFilters).toEqual({ id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9' });

      return { _id, updatedAt: new Date('2022-06-12T20:08:35.208Z'), ...model };
    },
  );

  const collection = jest.fn((): Collection => ({ replaceOne, findOne } as unknown as Collection));

  const db = jest.fn(() => ({ collection } as unknown as Db));

  const mongoClient: MongoClient = { db } as unknown as MongoClient;
  const collectionName = 'collectionName';

  const persist = createPersist(mongoClient, collectionName);

  expect(await persist(model)).toMatchInlineSnapshot(`
    {
      "createdAt": 2022-06-12T20:08:24.793Z,
      "id": "2b6491ac-677e-4b11-98dc-c124ae1c57e9",
      "name": "name1",
      "updatedAt": 2022-06-12T20:08:35.208Z,
    }
  `);

  expect(collection).toHaveBeenCalledTimes(1);
  expect(db).toHaveBeenCalledTimes(1);
  expect(replaceOne).toHaveBeenCalledTimes(1);
  expect(findOne).toHaveBeenCalledTimes(1);
});

test('createRemove', async () => {
  type SomeModel = Model & { name: string };

  const model: SomeModel = {
    id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9',
    createdAt: new Date('2022-06-12T20:08:24.793Z'),
    name: 'name1',
  };

  const _id = new ObjectId();

  const deleteOne: Collection['deleteOne'] = jest.fn(async (givenFilters: Filter<SomeModel>): Promise<DeleteResult> => {
    expect(givenFilters).toEqual({ id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9' });

    return { acknowledged: true, deletedCount: 1 };
  });

  const collection = jest.fn((): Collection => ({ deleteOne } as unknown as Collection));

  const db = jest.fn(() => ({ collection } as unknown as Db));

  const mongoClient: MongoClient = { db } as unknown as MongoClient;
  const collectionName = 'collectionName';

  const remove = createRemove(mongoClient, collectionName);

  await remove(model);

  expect(collection).toHaveBeenCalledTimes(1);
  expect(db).toHaveBeenCalledTimes(1);
  expect(deleteOne).toHaveBeenCalledTimes(1);
});
