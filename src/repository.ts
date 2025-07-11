import type { InputModel, InputModelList, Model, ModelList } from '@chubbyts/chubbyts-api/dist/model';
import type {
  FindModelById,
  PersistModel,
  RemoveModel,
  ResolveModelList,
} from '@chubbyts/chubbyts-api/dist/repository';
import type { Filter, MongoClient, Sort, WithId } from 'mongodb';

const withoutMongoId = <IM extends InputModel>(model: WithId<Model<IM>>): Model<IM> => {
  const { _id, ...rest } = model;
  return rest as unknown as Model<IM>;
};

export const createResolveModelList = <IM extends InputModel>(
  mongoClient: MongoClient,
  collectionName: string,
): ResolveModelList<IM> => {
  const collection = mongoClient.db().collection<Model<IM>>(collectionName);

  return async (list: InputModelList): Promise<ModelList<IM>> => {
    const cursor = collection.find(list.filters);

    cursor.skip(list.offset);
    cursor.limit(list.limit);

    cursor.sort(list.sort as Sort);

    return {
      ...list,
      items: (await cursor.toArray()).map(withoutMongoId),
      count: await collection.countDocuments(list.filters),
    };
  };
};

export const createFindModelById = <IM extends InputModel>(
  mongoClient: MongoClient,
  collectionName: string,
): FindModelById<IM> => {
  const collection = mongoClient.db().collection<Model<IM>>(collectionName);

  return async (id: string): Promise<Model<IM> | undefined> => {
    const modelWithMongoId = await collection.findOne({ id } as Filter<Model<IM>>);

    if (!modelWithMongoId) {
      return undefined;
    }

    return withoutMongoId(modelWithMongoId);
  };
};

export const createPersistModel = <IM extends InputModel>(
  mongoClient: MongoClient,
  collectionName: string,
): PersistModel<IM> => {
  const collection = mongoClient.db().collection<Model<IM>>(collectionName);

  return async (model: Model<IM>): Promise<Model<IM>> => {
    const filter = { id: model.id } as Filter<Model<IM>>;

    await collection.replaceOne(filter, model, { upsert: true });

    const modelWithMongoId = (await collection.findOne(filter)) as WithId<Model<IM>>;

    return withoutMongoId(modelWithMongoId);
  };
};

export const createRemoveModel = <IM extends InputModel>(
  mongoClient: MongoClient,
  collectionName: string,
): RemoveModel<IM> => {
  const collection = mongoClient.db().collection<Model<IM>>(collectionName);

  return async (model: Model<IM>): Promise<void> => {
    await collection.deleteOne({ id: model.id } as Filter<Model<IM>>);
  };
};
