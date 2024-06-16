import type { OpenAPIComponentObject } from '@asteasolutions/zod-to-openapi/dist/openapi-registry.ts';
import type { Handler } from '@chubbyts/chubbyts-http-types/dist/handler';
import type { Response } from '@chubbyts/chubbyts-http-types/dist/message';
import type { ResponseFactory } from '@chubbyts/chubbyts-http-types/dist/message-factory';

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

export const createOpenApiHandler = (
  openApiObject: OpenAPIComponentObject,
  responseFactory: ResponseFactory,
): Handler => {
  return async (): Promise<Response> => {
    const response = responseFactory(200);
    response.body.end(JSON.stringify(openApiObject));

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
