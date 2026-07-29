import { describe, expect, test } from 'vitest';
import type { OpenAPIComponentObject } from '@asteasolutions/zod-to-openapi/dist/openapi-registry.d.ts';
import { ServerRequest } from '@chubbyts/chubbyts-undici-server/dist/server';
import { createOpenApiHandler, createPingHandler } from '../../src/handler.js';

describe('handler', () => {
  test('createPingHandler', async () => {
    const serverRequest = new ServerRequest('https://example.com/ping');

    const pingHandler = createPingHandler();

    const response = await pingHandler(serverRequest);

    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK');
    expect(Object.fromEntries(response.headers.entries())).toMatchInlineSnapshot(`
      {
        "cache-control": "no-cache, no-store, must-revalidate",
        "content-type": "application/json",
        "expires": "0",
        "pragma": "no-cache",
      }
    `);

    expect(await response.json()).toEqual({ datetime: expect.any(String) });
  });

  test('createOpenApiHandler', async () => {
    const serverRequest = new ServerRequest('https://example.com/openapi');

    const openApiObject: OpenAPIComponentObject = {
      openapi: '3.0.0',
      info: {
        version: '1.0.0',
        title: 'Petstore',
        license: {
          name: 'MIT',
        },
      },
      servers: [
        {
          url: 'https://localhost',
        },
      ],
      components: {
        schemas: {},
        parameters: {},
      },
      paths: {},
    };

    const openApiHandler = createOpenApiHandler(openApiObject);

    const response = await openApiHandler(serverRequest);

    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK');
    expect(Object.fromEntries(response.headers.entries())).toMatchInlineSnapshot(`
      {
        "cache-control": "no-cache, no-store, must-revalidate",
        "content-type": "application/json",
        "expires": "0",
        "pragma": "no-cache",
      }
    `);

    expect(await response.json()).toEqual({
      openapi: '3.0.0',
      info: { version: '1.0.0', title: 'Petstore', license: { name: 'MIT' } },
      servers: [{ url: 'https://localhost' }],
      components: { schemas: {}, parameters: {} },
      paths: {},
    });
  });
});
