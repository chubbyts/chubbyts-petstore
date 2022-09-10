import { describe, expect, test } from '@jest/globals';
import { ServerRequest } from '@chubbyts/chubbyts-http-types/dist/message';
import { createEnrichList, createEnrichModel } from '../../src/enrich';
import { GeneratePath } from '@chubbyts/chubbyts-framework/dist/router/url-generator';

describe('createEnrichModel', () => {
  test('without links', async () => {
    const request = {} as ServerRequest;

    const generatePath: GeneratePath = jest.fn((givenName: string) => givenName);

    const enrichModel = createEnrichModel(generatePath, {});

    expect(
      enrichModel(
        {
          id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9',
          createdAt: new Date('2022-06-12T20:08:24.793Z'),
          updatedAt: new Date('2022-06-12T20:08:35.208Z'),
        },
        { request },
      ),
    ).toMatchInlineSnapshot(`
      {
        "_links": {},
        "createdAt": 2022-06-12T20:08:24.793Z,
        "id": "2b6491ac-677e-4b11-98dc-c124ae1c57e9",
        "updatedAt": 2022-06-12T20:08:35.208Z,
      }
    `);

    expect(generatePath).toHaveBeenCalledTimes(0);
  });

  test('with all links', async () => {
    const request = {} as ServerRequest;

    const generatePath: GeneratePath = jest.fn((givenName: string) => givenName);

    const enrichModel = createEnrichModel(generatePath, {
      read: 'model_read',
      update: 'model_update',
      delete: 'model_delete',
    });

    expect(
      enrichModel(
        {
          id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9',
          createdAt: new Date('2022-06-12T20:08:24.793Z'),
          updatedAt: new Date('2022-06-12T20:08:35.208Z'),
        },

        { request },
      ),
    ).toMatchInlineSnapshot(`
      {
        "_links": {
          "delete": {
            "attributes": {
              "method": "DELETE",
            },
            "href": "model_delete",
          },
          "read": {
            "attributes": {
              "method": "GET",
            },
            "href": "model_read",
          },
          "update": {
            "attributes": {
              "method": "PUT",
            },
            "href": "model_update",
          },
        },
        "createdAt": 2022-06-12T20:08:24.793Z,
        "id": "2b6491ac-677e-4b11-98dc-c124ae1c57e9",
        "updatedAt": 2022-06-12T20:08:35.208Z,
      }
    `);

    expect(generatePath).toHaveBeenCalledTimes(3);
  });
});

describe('createEnrichList', () => {
  test('without links', async () => {
    const request = {} as ServerRequest;

    const generatePath: GeneratePath = jest.fn((givenName: string) => givenName);

    const enrichList = createEnrichList(generatePath, {});

    expect(
      enrichList(
        {
          offset: 0,
          limit: 20,
          filters: {},
          sort: {},
          count: 1,
          items: [
            {
              id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9',
              createdAt: new Date('2022-06-12T20:08:24.793Z'),
              updatedAt: new Date('2022-06-12T20:08:35.208Z'),
            },
          ],
        },

        { request },
      ),
    ).toMatchInlineSnapshot(`
      {
        "_links": {},
        "count": 1,
        "filters": {},
        "items": [
          {
            "_links": {},
            "createdAt": 2022-06-12T20:08:24.793Z,
            "id": "2b6491ac-677e-4b11-98dc-c124ae1c57e9",
            "updatedAt": 2022-06-12T20:08:35.208Z,
          },
        ],
        "limit": 20,
        "offset": 0,
        "sort": {},
      }
    `);

    expect(generatePath).toHaveBeenCalledTimes(0);
  });

  test('with all links', async () => {
    const request = {} as ServerRequest;

    const generatePath: GeneratePath = jest.fn((givenName: string) => givenName);

    const enrichList = createEnrichList(generatePath, {
      create: 'model_create',
      read: 'model_read',
      update: 'model_update',
      delete: 'model_delete',
    });

    expect(
      enrichList(
        {
          offset: 0,
          limit: 20,
          filters: {},
          sort: {},
          count: 1,
          items: [
            {
              id: '2b6491ac-677e-4b11-98dc-c124ae1c57e9',
              createdAt: new Date('2022-06-12T20:08:24.793Z'),
              updatedAt: new Date('2022-06-12T20:08:35.208Z'),
            },
          ],
        },

        { request },
      ),
    ).toMatchInlineSnapshot(`
      {
        "_links": {
          "create": {
            "attributes": {
              "method": "POST",
            },
            "href": "model_create",
          },
        },
        "count": 1,
        "filters": {},
        "items": [
          {
            "_links": {
              "delete": {
                "attributes": {
                  "method": "DELETE",
                },
                "href": "model_delete",
              },
              "read": {
                "attributes": {
                  "method": "GET",
                },
                "href": "model_read",
              },
              "update": {
                "attributes": {
                  "method": "PUT",
                },
                "href": "model_update",
              },
            },
            "createdAt": 2022-06-12T20:08:24.793Z,
            "id": "2b6491ac-677e-4b11-98dc-c124ae1c57e9",
            "updatedAt": 2022-06-12T20:08:35.208Z,
          },
        ],
        "limit": 20,
        "offset": 0,
        "sort": {},
      }
    `);

    expect(generatePath).toHaveBeenCalledTimes(4);
  });
});
