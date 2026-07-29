import { describe, expect, test } from 'vitest';
import type { GeneratePath } from '@chubbyts/chubbyts-framework/dist/router/url-generator';
import { useFunctionMock } from '@chubbyts/chubbyts-function-mock/dist/function-mock';
import { createEnrichModelList, createEnrichModel } from '../../src/enrich.js';

describe('createEnrichModel', () => {
  test('without links', async () => {
    const [generatePath, generatePathMocks] = useFunctionMock<GeneratePath>([]);

    const enrichModel = createEnrichModel(generatePath, {});

    expect(
      await enrichModel({
        id: '019c201f-6a83-7696-9899-50fbf7b2278d',
        createdAt: new Date('2022-06-12T20:08:24.793Z'),
        updatedAt: new Date('2022-06-12T20:08:35.208Z'),
      }),
    ).toMatchInlineSnapshot(`
      {
        "_links": {},
        "createdAt": 2022-06-12T20:08:24.793Z,
        "id": "019c201f-6a83-7696-9899-50fbf7b2278d",
        "updatedAt": 2022-06-12T20:08:35.208Z,
      }
    `);

    expect(generatePathMocks).toHaveLength(0);
  });

  test('with all links', async () => {
    const [generatePath, generatePathMocks] = useFunctionMock<GeneratePath>([
      {
        parameters: [
          'model_read',
          {
            id: '019c201f-6a83-7696-9899-50fbf7b2278d',
          },
        ],
        return: 'model_read',
      },
      {
        parameters: [
          'model_update',
          {
            id: '019c201f-6a83-7696-9899-50fbf7b2278d',
          },
        ],
        return: 'model_update',
      },
      {
        parameters: [
          'model_delete',
          {
            id: '019c201f-6a83-7696-9899-50fbf7b2278d',
          },
        ],
        return: 'model_delete',
      },
    ]);

    const enrichModel = createEnrichModel(generatePath, {
      read: 'model_read',
      update: 'model_update',
      delete: 'model_delete',
    });

    expect(
      await enrichModel({
        id: '019c201f-6a83-7696-9899-50fbf7b2278d',
        createdAt: new Date('2022-06-12T20:08:24.793Z'),
        updatedAt: new Date('2022-06-12T20:08:35.208Z'),
      }),
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
        "id": "019c201f-6a83-7696-9899-50fbf7b2278d",
        "updatedAt": 2022-06-12T20:08:35.208Z,
      }
    `);

    expect(generatePathMocks).toHaveLength(0);
  });
});

describe('createEnrichModelList', () => {
  test('without links', async () => {
    const [generatePath, generatePathMocks] = useFunctionMock<GeneratePath>([]);

    const enrichList = createEnrichModelList(generatePath, {}, {});

    expect(
      await enrichList({
        offset: 0,
        limit: 20,
        filters: {},
        sort: {},
        count: 1,
        items: [
          {
            id: '019c201f-6a83-7696-9899-50fbf7b2278d',
            createdAt: new Date('2022-06-12T20:08:24.793Z'),
            updatedAt: new Date('2022-06-12T20:08:35.208Z'),
          },
        ],
      }),
    ).toMatchInlineSnapshot(`
      {
        "_links": {},
        "count": 1,
        "filters": {},
        "items": [
          {
            "_links": {},
            "createdAt": 2022-06-12T20:08:24.793Z,
            "id": "019c201f-6a83-7696-9899-50fbf7b2278d",
            "updatedAt": 2022-06-12T20:08:35.208Z,
          },
        ],
        "limit": 20,
        "offset": 0,
        "sort": {},
      }
    `);

    expect(generatePathMocks).toHaveLength(0);
  });

  test('with all links', async () => {
    const [generatePath, generatePathMocks] = useFunctionMock<GeneratePath>([
      {
        parameters: [
          'model_read',
          {
            id: '019c201f-6a83-7696-9899-50fbf7b2278d',
          },
        ],
        return: 'model_read',
      },
      {
        parameters: [
          'model_update',
          {
            id: '019c201f-6a83-7696-9899-50fbf7b2278d',
          },
        ],
        return: 'model_update',
      },
      {
        parameters: [
          'model_delete',
          {
            id: '019c201f-6a83-7696-9899-50fbf7b2278d',
          },
        ],
        return: 'model_delete',
      },
      {
        parameters: ['model_create'],
        return: 'model_create',
      },
    ]);

    const enrichList = createEnrichModelList(
      generatePath,
      {
        read: 'model_read',
        update: 'model_update',
        delete: 'model_delete',
      },
      {
        create: 'model_create',
      },
    );

    expect(
      await enrichList({
        offset: 0,
        limit: 20,
        filters: {},
        sort: {},
        count: 1,
        items: [
          {
            id: '019c201f-6a83-7696-9899-50fbf7b2278d',
            createdAt: new Date('2022-06-12T20:08:24.793Z'),
            updatedAt: new Date('2022-06-12T20:08:35.208Z'),
          },
        ],
      }),
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
            "id": "019c201f-6a83-7696-9899-50fbf7b2278d",
            "updatedAt": 2022-06-12T20:08:35.208Z,
          },
        ],
        "limit": 20,
        "offset": 0,
        "sort": {},
      }
    `);

    expect(generatePathMocks).toHaveLength(0);
  });
});
