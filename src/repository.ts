import type {
  InputModelList,
  InputModelListSchema,
  InputModelSchema,
  Model,
  Sort,
} from '@chubbyts/chubbyts-undici-api/dist/model';
import type { FindModelById, PersistModel, ResolveModelList } from '@chubbyts/chubbyts-undici-api/dist/repository';
import type { MongoClient } from 'mongodb';

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
  const collection = mongoClient.db().collection(collectionName);

  return async (list: InputModelList<IMLS>) => {
    const result = await collection
      .aggregate<{
        items: Model<IMS>[];
        total: { count: number }[];
      }>([
        { $match: list.filters },
        {
          $facet: {
            items: [
              ...aggregationSort(list.sort),
              { $skip: list.offset },
              { $limit: list.limit },
              { $project: { _id: 0 } },
            ],
            total: [{ $count: 'count' }],
          },
        },
      ])
      .toArray();

    return {
      ...list,
      items: result[0].items,
      count: result[0].total[0]?.count ?? 0,
    };
  };
};

export const createFindModelById = <IMS extends InputModelSchema>(
  mongoClient: MongoClient,
  collectionName: string,
): FindModelById<IMS> => {
  const collection = mongoClient.db().collection(collectionName);

  return async (id: string): Promise<Model<IMS> | undefined> => {
    const model = await collection.findOne<Model<IMS>>({ id }, { projection: { _id: 0 } });

    return model ?? undefined;
  };
};

export const createPersistModel = <IMS extends InputModelSchema>(
  mongoClient: MongoClient,
  collectionName: string,
): PersistModel<IMS> => {
  const collection = mongoClient.db().collection(collectionName);

  return async (model: Model<IMS>) => {
    const persistedModel = (await collection.findOneAndReplace({ id: model.id }, model, {
      upsert: true,
      returnDocument: 'after',
      projection: { _id: 0 },
    })) as Model<IMS> | null;

    if (!persistedModel) {
      throw new Error(`Failed to persist model with id: ${model.id}`);
    }

    return persistedModel;
  };
};

export const createRemoveModel = (mongoClient: MongoClient, collectionName: string) => {
  const collection = mongoClient.db().collection<Model<InputModelSchema>>(collectionName);

  return async (model: Model<InputModelSchema>) => {
    await collection.deleteOne({ id: model.id });
  };
};
