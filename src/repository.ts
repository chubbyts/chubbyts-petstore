import type { InputModelList, InputModelListSchema, InputModelSchema, Model } from '@chubbyts/chubbyts-api/dist/model';
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

  return async (list: InputModelList<IMLS>) => {
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

export const createFindModelById = <IMS extends InputModelSchema>(
  mongoClient: MongoClient,
  collectionName: string,
): FindModelById<IMS> => {
  const collection = mongoClient.db().collection<Model<InputModelSchema>>(collectionName);

  return async (id: string): Promise<Model<IMS> | undefined> => {
    const modelWithMongoId = (await collection.findOne({ id })) as WithId<Model<IMS>> | null;

    if (!modelWithMongoId) {
      return undefined;
    }

    return withoutMongoId<IMS>(modelWithMongoId);
  };
};

export const createPersistModel = <IMS extends InputModelSchema>(
  mongoClient: MongoClient,
  collectionName: string,
): PersistModel<IMS> => {
  const collection = mongoClient.db().collection<Model<InputModelSchema>>(collectionName);

  return async (model: Model<IMS>) => {
    const filter = { id: model.id };

    await collection.replaceOne(filter, model, { upsert: true });

    const modelWithMongoId = (await collection.findOne(filter)) as WithId<Model<IMS>> | null;

    if (!modelWithMongoId) {
      throw new Error(`Failed to persist model with id: ${model.id}`);
    }

    return withoutMongoId<IMS>(modelWithMongoId);
  };
};

export const createRemoveModel = (mongoClient: MongoClient, collectionName: string) => {
  const collection = mongoClient.db().collection<Model<InputModelSchema>>(collectionName);

  return async (model: Model<InputModelSchema>) => {
    await collection.deleteOne({ id: model.id });
  };
};
