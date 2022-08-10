import { Handler } from '@chubbyts/chubbyts-http-types/dist/handler';
import { Response } from '@chubbyts/chubbyts-http-types/dist/message';
import { ResponseFactory } from '@chubbyts/chubbyts-http-types/dist/message-factory';
import { MongoClient } from 'mongodb';

const mongoPing = async (mongoClient: MongoClient): Promise<boolean> => {
  try {
    const { ok } = await mongoClient.db().command({ ping: 1 });

    return ok === 1;
  } catch {
    return false;
  }
};

export const createPingHandler = (mongoClient: MongoClient, responseFactory: ResponseFactory): Handler => {
  return async (): Promise<Response> => {
    const response = responseFactory(200);

    response.body.end(
      JSON.stringify({
        datetime: new Date(),
        database: await mongoPing(mongoClient),
      }),
    );

    return {
      ...response,
      headers: {
        ...response.headers,
        'content-type': ['application/json'],
        'cache-control': ['no-cache, no-store, must-revalidate'],
        pragma: ['no-cache'],
        expires: ['0'],
      },
    };
  };
};
