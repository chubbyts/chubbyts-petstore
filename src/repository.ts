import { List, Model } from '@chubbyts/chubbyts-api/dist/model';
import { FindById, Persist, Remove, ResolveList } from '@chubbyts/chubbyts-api/dist/repository';
import { MongoClient, WithId } from 'mongodb';

const withoutMongoId = (model: WithId<Model>): Model => {
  const { _id, ...rest } = model;

  return rest;
};

export const createResolveList = (mongoClient: MongoClient, collectionName: string): ResolveList => {
  return async (list: List): Promise<List> => {
    const collection = mongoClient.db().collection<Model>(collectionName);

    const cursor = collection.find(list.filters);

    cursor.skip(list.offset);
    cursor.limit(list.limit);

    if (list.sort) {
      cursor.sort(list.sort);
    }

    list.items = (await cursor.toArray()).map(withoutMongoId);
    list.count = await collection.countDocuments(list.filters);

    return list;
  };
};

export const createFindById = (mongoClient: MongoClient, collectionName: string): FindById => {
  return async (id: string): Promise<Model | undefined> => {
    const collection = mongoClient.db().collection<Model>(collectionName);
    const modelWithMongoId = await collection.findOne({ id });

    if (!modelWithMongoId) {
      return undefined;
    }

    return withoutMongoId(modelWithMongoId);
  };
};

export const createPersist = (mongoClient: MongoClient, collectionName: string): Persist => {
  return async (model: Model): Promise<Model> => {
    const collection = mongoClient.db().collection<Model>(collectionName);
    await collection.replaceOne({ id: model.id }, model, { upsert: true });

    return withoutMongoId((await collection.findOne({ id: model.id })) as WithId<Model>);
  };
};

export const createRemove = (mongoClient: MongoClient, collectionName: string): Remove => {
  return async (model: Model): Promise<void> => {
    const collection = mongoClient.db().collection<Model>(collectionName);

    await collection.deleteOne({ id: model.id });
  };
};
