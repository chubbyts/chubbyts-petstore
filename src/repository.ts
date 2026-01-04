import type {
  InputModelList,
  InputModelListSchema,
  InputModelSchema,
  Model,
  Sort,
} from '@chubbyts/chubbyts-undici-api/dist/model';
import type { FindModelById, PersistModel, ResolveModelList } from '@chubbyts/chubbyts-undici-api/dist/repository';
import type { MongoClient, WithId } from 'mongodb';

const withoutMongoId = <IMS extends InputModelSchema>(model: WithId<Model<IMS>>): Model<IMS> => {
  const { _id, ...rest } = model;
  return rest as Model<IMS>;
};

const filterUndefinedEntry = <T>(entry: [string, T]): entry is [string, Exclude<T, undefined>] =>
  entry[1] !== undefined;

export const convertSort = (sort: Record<string, Sort>) =>
  Object.fromEntries(
    Object.entries(sort)
      .filter(filterUndefinedEntry)
      .map(([key, value]) => [key, value === 'asc' ? 1 : -1]),
  );

export const aggregationSort = (sort: Record<string, Sort>) => {
  const $sort = convertSort(sort);

  return Object.keys($sort).length > 0 ? [{ $sort }] : [];
};

export const createResolveModelList = <IMS extends InputModelSchema, IMLS extends InputModelListSchema>(
  mongoClient: MongoClient,
  collectionName: string,
): ResolveModelList<IMS, IMLS> => {
  const collection = mongoClient.db().collection<Model<InputModelSchema>>(collectionName);

  return async (list: InputModelList<IMLS>) => {
    const result = await collection
      .aggregate<{
        items: WithId<Model<InputModelSchema>>[];
        total: { count: number }[];
      }>([
        { $match: list.filters },
        {
          $facet: {
            items: [...aggregationSort(list.sort), { $skip: list.offset }, { $limit: list.limit }],
            total: [{ $count: 'count' }],
          },
        },
      ])
      .toArray();

    return {
      ...list,
      items: result[0].items.map(withoutMongoId),
      count: result[0].total[0]?.count ?? 0,
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
