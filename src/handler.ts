import { STATUS_CODES } from 'node:http';
import type { OpenAPIComponentObject } from '@asteasolutions/zod-to-openapi/dist/openapi-registry.d.ts';
import type { Handler } from '@chubbyts/chubbyts-undici-server/dist/server';
import { Response } from '@chubbyts/chubbyts-undici-server/dist/server';

export const createPingHandler = (): Handler => {
  return async (): Promise<Response> => {
    return new Response(JSON.stringify({ datetime: new Date().toISOString() }), {
      status: 200,
      statusText: STATUS_CODES[200],
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-cache, no-store, must-revalidate',
        pragma: 'no-cache',
        expires: '0',
      },
    });
  };
};

export const createOpenApiHandler = (openApiObject: OpenAPIComponentObject): Handler => {
  return async (): Promise<Response> => {
    return new Response(JSON.stringify(openApiObject), {
      status: 200,
      statusText: STATUS_CODES[200],
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-cache, no-store, must-revalidate',
        pragma: 'no-cache',
        expires: '0',
      },
    });
  };
};
