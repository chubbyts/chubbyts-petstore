import type { List, Model } from '@chubbyts/chubbyts-api/dist/model';
import type {
  FindModelById,
  PersistModel,
  RemoveModel,
  ResolveModelList,
} from '@chubbyts/chubbyts-api/dist/repository';
import type { Filter, MongoClient, WithId } from 'mongodb';

const withoutMongoId = <C>(model: WithId<Model<C>>): Model<C> => {
  const { _id, ...rest } = model;

  return rest as Model<C>;
};

export const createResolveModelList = <C>(
  mongoClient: MongoClient,
  collectionName: string,
): ResolveModelList<Model<C>> => {
  const collection = mongoClient.db().collection<Model<C>>(collectionName);

  return async (list: List<Model<C>>): Promise<List<Model<C>>> => {
    const cursor = collection.find(list.filters as Filter<Model<C>>);

    cursor.skip(list.offset);
    cursor.limit(list.limit);

    cursor.sort(list.sort);

    return {
      ...list,
      items: (await cursor.toArray()).map(withoutMongoId),
      count: await collection.countDocuments(list.filters as Filter<Model<C>>),
    };
  };
};

export const createFindModelById = <C>(mongoClient: MongoClient, collectionName: string): FindModelById<Model<C>> => {
  const collection = mongoClient.db().collection<Model<C>>(collectionName);

  return async (id: string): Promise<Model<C> | undefined> => {
    const modelWithMongoId = await collection.findOne({ id } as Filter<Model<C>>);

    if (!modelWithMongoId) {
      return undefined;
    }

    return withoutMongoId(modelWithMongoId);
  };
};

export const createPersistModel = <C>(mongoClient: MongoClient, collectionName: string): PersistModel<Model<C>> => {
  const collection = mongoClient.db().collection<Model<C>>(collectionName);

  return async (model: Model<C>): Promise<Model<C>> => {
    const filter = { id: model.id } as Filter<Model<C>>;

    await collection.replaceOne(filter, model, { upsert: true });

    const modelWithMongoId = (await collection.findOne(filter)) as WithId<Model<C>>;

    return withoutMongoId(modelWithMongoId);
  };
};

export const createRemoveModel = <C>(mongoClient: MongoClient, collectionName: string): RemoveModel<Model<C>> => {
  const collection = mongoClient.db().collection<Model<C>>(collectionName);

  return async (model: Model<C>): Promise<void> => {
    const filter = { id: model.id } as Filter<Model<C>>;

    await collection.deleteOne(filter);
  };
};
