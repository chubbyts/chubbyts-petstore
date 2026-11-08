import type { OpenAPIComponentObject } from '@asteasolutions/zod-to-openapi/dist/openapi-registry.d.ts';
import type { Handler } from '@chubbyts/chubbyts-http-types/handler';
import type { Response } from '@chubbyts/chubbyts-http-types/message';
import type { BodyFactory, ResponseFactory } from '@chubbyts/chubbyts-http-types/message-factory';

const createJsonResponse = (responseFactory: ResponseFactory, bodyFactory: BodyFactory, data: unknown): Response => {
  const response = responseFactory(200);

  return {
    ...response,
    headers: {
      ...response.headers,
      'content-type': ['application/json'],
      'cache-control': ['no-cache, no-store, must-revalidate'],
      pragma: ['no-cache'],
      expires: ['0'],
    },
    body: bodyFactory(JSON.stringify(data)),
  };
};

export const createPingHandler =
  (responseFactory: ResponseFactory, bodyFactory: BodyFactory): Handler =>
  (): Promise<Response> =>
    Promise.resolve(createJsonResponse(responseFactory, bodyFactory, { datetime: new Date().toISOString() }));

export const createOpenApiHandler =
  (openApiObject: OpenAPIComponentObject, responseFactory: ResponseFactory, bodyFactory: BodyFactory): Handler =>
  (): Promise<Response> =>
    Promise.resolve(createJsonResponse(responseFactory, bodyFactory, openApiObject));
