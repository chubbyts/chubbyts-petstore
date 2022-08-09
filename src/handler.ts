import { Handler } from '@chubbyts/chubbyts-http-types/dist/handler';
import { Response } from '@chubbyts/chubbyts-http-types/dist/message';
import { ResponseFactory } from '@chubbyts/chubbyts-http-types/dist/message-factory';
import { MongoClient } from 'mongodb';

export const createPingHandler = (mongoClient: MongoClient, responseFactory: ResponseFactory): Handler => {
  return async (): Promise<Response> => {
    const response = responseFactory(200);

    const { ok } = await mongoClient.db().command({ serverStatus: 1 });

    response.body.end(
      JSON.stringify({
        datetime: new Date(),
        database: ok === 1,
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
