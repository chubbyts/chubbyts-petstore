import type {
  InputModelList,
  InputModelListSchema,
  InputModelSchema,
  Model,
  ModelList,
} from '@chubbyts/chubbyts-api/dist/model';
import type { FindModelById, PersistModel, ResolveModelList } from '@chubbyts/chubbyts-api/dist/repository';
import type { MongoClient, Sort, WithId } from 'mongodb';

const withoutMongoId = <IMS extends InputModelSchema>(model: WithId<Model<IMS>>): Model<IMS> => {
  const { _id, ...rest } = model;
  return rest as Model<IMS>;
};

export const createResolveModelList = <IMS extends InputModelSchema, IMLS extends InputModelListSchema>(
  mongoClient: MongoClient,
  collectionName: string,
): ResolveModelList<IMS, IMLS> => {
  const collection = mongoClient.db().collection<Model<InputModelSchema>>(collectionName);

  return async (list: InputModelList<InputModelListSchema>) => {
    const cursor = collection.find(list.filters);

    cursor.skip(list.offset);
    cursor.limit(list.limit);

    cursor.sort(list.sort as Sort);

    return {
      ...list,
      items: (await cursor.toArray()).map(withoutMongoId),
      count: await collection.countDocuments(list.filters),
    } as ModelList<IMS, IMLS>;
  };
};

export const createFindModelById = <IMS extends InputModelSchema>(
  mongoClient: MongoClient,
  collectionName: string,
): FindModelById<IMS> => {
  const collection = mongoClient.db().collection<Model<InputModelSchema>>(collectionName);

  return (async (id: string) => {
    const modelWithMongoId = await collection.findOne({ id });

    if (!modelWithMongoId) {
      return undefined;
    }

    return withoutMongoId(modelWithMongoId);
  }) as unknown as FindModelById<IMS>;
};

export const createPersistModel = <IMS extends InputModelSchema>(mongoClient: MongoClient, collectionName: string) => {
  const collection = mongoClient.db().collection<Model<InputModelSchema>>(collectionName);

  return (async (model: Model<InputModelSchema>) => {
    const filter = { id: model.id };

    await collection.replaceOne(filter, model, { upsert: true });

    const modelWithMongoId = await collection.findOne(filter);

    if (!modelWithMongoId) {
      throw new Error(`Failed to persist model with id: ${model.id}`);
    }

    return withoutMongoId(modelWithMongoId);
  }) as unknown as PersistModel<IMS>;
};

export const createRemoveModel = (mongoClient: MongoClient, collectionName: string) => {
  const collection = mongoClient.db().collection<Model<InputModelSchema>>(collectionName);

  return async (model: Model<InputModelSchema>) => {
    await collection.deleteOne({ id: model.id });
  };
};
