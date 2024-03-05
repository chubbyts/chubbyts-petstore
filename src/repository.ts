import type { List, Model } from '@chubbyts/chubbyts-api/dist/model';
import type { FindOneById, Persist, Remove, ResolveList } from '@chubbyts/chubbyts-api/dist/repository';
import type { Filter, MongoClient, WithId } from 'mongodb';

const withoutMongoId = <C>(model: WithId<Model<C>>): Model<C> => {
  const { _id, ...rest } = model;

  return rest as Model<C>;
};

export const createResolveList = <C>(mongoClient: MongoClient, collectionName: string): ResolveList<Model<C>> => {
  const collection = mongoClient.db().collection<Model<C>>(collectionName);

  return async (list: List<Model<C>>): Promise<List<Model<C>>> => {
    const cursor = collection.find(list.filters as Filter<Model<C>>);

    cursor.skip(list.offset);
    cursor.limit(list.limit);

    // eslint-disable-next-line functional/immutable-data
    cursor.sort(list.sort);

    return {
      ...list,
      items: (await cursor.toArray()).map(withoutMongoId),
      count: await collection.countDocuments(list.filters as Filter<Model<C>>),
    };
  };
};

export const createFindOneById = <C>(mongoClient: MongoClient, collectionName: string): FindOneById<Model<C>> => {
  const collection = mongoClient.db().collection<Model<C>>(collectionName);

  return async (id: string): Promise<Model<C> | undefined> => {
    const modelWithMongoId = await collection.findOne({ id } as Filter<Model<C>>);

    if (!modelWithMongoId) {
      return undefined;
    }

    return withoutMongoId(modelWithMongoId);
  };
};

export const createPersist = <C>(mongoClient: MongoClient, collectionName: string): Persist<Model<C>> => {
  const collection = mongoClient.db().collection<Model<C>>(collectionName);

  return async (model: Model<C>): Promise<Model<C>> => {
    const filter = { id: model.id } as Filter<Model<C>>;

    await collection.replaceOne(filter, model, { upsert: true });

    const modelWithMongoId = (await collection.findOne(filter)) as WithId<Model<C>>;

    return withoutMongoId(modelWithMongoId);
  };
};

export const createRemove = <C>(mongoClient: MongoClient, collectionName: string): Remove<Model<C>> => {
  const collection = mongoClient.db().collection<Model<C>>(collectionName);

  return async (model: Model<C>): Promise<void> => {
    const filter = { id: model.id } as Filter<Model<C>>;

    await collection.deleteOne(filter);
  };
};
