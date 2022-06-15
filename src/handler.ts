import { Handler } from '@chubbyts/chubbyts-http-types/dist/handler';
import { Response } from '@chubbyts/chubbyts-http-types/dist/message';
import { ResponseFactory } from '@chubbyts/chubbyts-http-types/dist/message-factory';

export const createPingHandler = (responseFactory: ResponseFactory): Handler => {
  return async (): Promise<Response> => {
    const response = responseFactory(200);
    response.body.end(JSON.stringify({ datetime: new Date().toISOString() }));

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
