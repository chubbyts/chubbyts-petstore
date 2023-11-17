import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { Container } from '@chubbyts/chubbyts-dic-types/dist/container';
import { describe, expect, test } from '@jest/globals';
import type { Collection, Db, MongoClient } from 'mongodb';
import { useObjectMock } from '@chubbyts/chubbyts-function-mock/dist/object-mock';
import type { Response, ServerRequest } from '@chubbyts/chubbyts-http-types/dist/message';
import {
  petCreateHandlerServiceFactory,
  petDeleteHandlerServiceFactory,
  petEnrichListServiceFactory,
  petEnrichModelServiceFactory,
  petFindByIdServiceFactory,
  petListHandlerServiceFactory,
  petOpenApiRegistryServiceDelegator,
  petPersistServiceFactory,
  petReadHandlerServiceFactory,
  petRemoveServiceFactory,
  petResolveListServiceFactory,
  petRoutesServiceDelegator,
  petUpdateHandlerServiceFactory,
} from '../../../src/pet/service-factory';
import type { Pet, PetList } from '../../../src/pet/model';
import { routeTestingResolveAllLazyMiddlewaresAndHandlers } from '../../utils/route';
import { validPet, validPetList } from './model.test';

describe('service-factory', () => {
  test('petCreateHandlerServiceFactory', async () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['decoder'],
        return: {},
      },
      {
        name: 'get',
        parameters: ['petPersist'],
        return: () => undefined,
      },
      {
        name: 'get',
        parameters: ['responseFactory'],
        return: () => undefined,
      },
      {
        name: 'get',
        parameters: ['encoder'],
        return: {},
      },
      {
        name: 'get',
        parameters: ['petEnrichModel'],
        return: () => undefined,
      },
    ]);

    expect(await petCreateHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('petDeleteHandlerServiceFactory', async () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['petFindById'],
        return: () => undefined,
      },
      {
        name: 'get',
        parameters: ['petRemove'],
        return: () => undefined,
      },
      {
        name: 'get',
        parameters: ['responseFactory'],
        return: () => undefined,
      },
    ]);

    expect(await petDeleteHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('petEnrichModelServiceFactory', async () => {
    const request = {} as ServerRequest;

    const pet: Pet = validPet;

    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['generatePath'],
        return: () => '__generated_link',
      },
    ]);

    const petEnrichModel = petEnrichModelServiceFactory(container);

    expect(petEnrichModel).toBeInstanceOf(Function);

    expect(await petEnrichModel(pet, { request })).toMatchInlineSnapshot(`
      {
        "_links": {
          "delete": {
            "attributes": {
              "method": "DELETE",
            },
            "href": "__generated_link",
          },
          "read": {
            "attributes": {
              "method": "GET",
            },
            "href": "__generated_link",
          },
          "update": {
            "attributes": {
              "method": "PUT",
            },
            "href": "__generated_link",
          },
        },
        "createdAt": 2023-04-12T09:12:12.763Z,
        "id": "test",
        "name": "name",
        "tag": "tag",
        "updatedAt": 2023-04-16T15:05:49.154Z,
        "vaccinations": [
          {
            "name": "name",
          },
        ],
      }
    `);

    expect(containerMocks.length).toBe(0);
  });

  test('petEnrichListServiceFactory', async () => {
    const request = {} as ServerRequest;

    const petList: PetList = validPetList;

    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['generatePath'],
        return: () => '__generated_link',
      },
    ]);

    const petEnrichList = petEnrichListServiceFactory(container);

    expect(petEnrichList).toBeInstanceOf(Function);

    expect(await petEnrichList(petList, { request })).toMatchInlineSnapshot(`
      {
        "_links": {
          "create": {
            "attributes": {
              "method": "POST",
            },
            "href": "__generated_link",
          },
        },
        "count": 2,
        "filters": {
          "name": "name",
        },
        "items": [
          {
            "_links": {
              "delete": {
                "attributes": {
                  "method": "DELETE",
                },
                "href": "__generated_link",
              },
              "read": {
                "attributes": {
                  "method": "GET",
                },
                "href": "__generated_link",
              },
              "update": {
                "attributes": {
                  "method": "PUT",
                },
                "href": "__generated_link",
              },
            },
            "createdAt": 2023-04-12T09:12:12.763Z,
            "id": "test",
            "name": "name",
            "tag": "tag",
            "updatedAt": 2023-04-16T15:05:49.154Z,
            "vaccinations": [
              {
                "name": "name",
              },
            ],
          },
        ],
        "limit": 20,
        "offset": 0,
        "sort": {
          "name": "asc",
        },
      }
    `);

    expect(containerMocks.length).toBe(0);
  });

  test('petFindByIdServiceFactory', async () => {
    const [collection, collectionMocks] = useObjectMock<Collection>([]);

    const [db, dbMocks] = useObjectMock<Db>([
      {
        name: 'collection',
        parameters: ['pets'],
        return: collection,
      },
    ]);

    const [mongoClient, mongoClientMocks] = useObjectMock<MongoClient>([
      {
        name: 'db',
        parameters: [],
        return: db,
      },
    ]);

    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['mongoClient'],
        return: Promise.resolve(mongoClient),
      },
    ]);

    expect(await petFindByIdServiceFactory(container)).toBeInstanceOf(Function);

    expect(collectionMocks.length).toBe(0);
    expect(dbMocks.length).toBe(0);
    expect(mongoClientMocks.length).toBe(0);
    expect(containerMocks.length).toBe(0);
  });

  test('petListHandlerServiceFactory', async () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['petResolveList'],
        return: () => undefined,
      },
      {
        name: 'get',
        parameters: ['responseFactory'],
        return: () => undefined,
      },
      {
        name: 'get',
        parameters: ['encoder'],
        return: {},
      },
      {
        name: 'get',
        parameters: ['petEnrichList'],
        return: () => undefined,
      },
    ]);

    expect(await petListHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('petPersistServiceFactory', async () => {
    const [collection, collectionMocks] = useObjectMock<Collection>([]);

    const [db, dbMocks] = useObjectMock<Db>([
      {
        name: 'collection',
        parameters: ['pets'],
        return: collection,
      },
    ]);

    const [mongoClient, mongoClientMocks] = useObjectMock<MongoClient>([
      {
        name: 'db',
        parameters: [],
        return: db,
      },
    ]);

    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['mongoClient'],
        return: Promise.resolve(mongoClient),
      },
    ]);

    expect(await petPersistServiceFactory(container)).toBeInstanceOf(Function);

    expect(collectionMocks.length).toBe(0);
    expect(dbMocks.length).toBe(0);
    expect(mongoClientMocks.length).toBe(0);
    expect(containerMocks.length).toBe(0);
  });

  test('petReadHandlerServiceFactory', async () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['petFindById'],
        return: () => undefined,
      },
      {
        name: 'get',
        parameters: ['responseFactory'],
        return: () => undefined,
      },
      {
        name: 'get',
        parameters: ['encoder'],
        return: {},
      },
      {
        name: 'get',
        parameters: ['petEnrichModel'],
        return: () => undefined,
      },
    ]);

    expect(await petReadHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });

  test('petRemoveServiceFactory', async () => {
    const [collection, collectionMocks] = useObjectMock<Collection>([]);

    const [db, dbMocks] = useObjectMock<Db>([
      {
        name: 'collection',
        parameters: ['pets'],
        return: collection,
      },
    ]);

    const [mongoClient, mongoClientMocks] = useObjectMock<MongoClient>([
      {
        name: 'db',
        parameters: [],
        return: db,
      },
    ]);

    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['mongoClient'],
        return: Promise.resolve(mongoClient),
      },
    ]);

    expect(await petRemoveServiceFactory(container)).toBeInstanceOf(Function);

    expect(collectionMocks.length).toBe(0);
    expect(dbMocks.length).toBe(0);
    expect(mongoClientMocks.length).toBe(0);
    expect(containerMocks.length).toBe(0);
  });

  test('petResolveListServiceFactory', async () => {
    const [collection, collectionMocks] = useObjectMock<Collection>([]);

    const [db, dbMocks] = useObjectMock<Db>([
      {
        name: 'collection',
        parameters: ['pets'],
        return: collection,
      },
    ]);

    const [mongoClient, mongoClientMocks] = useObjectMock<MongoClient>([
      {
        name: 'db',
        parameters: [],
        return: db,
      },
    ]);

    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['mongoClient'],
        return: Promise.resolve(mongoClient),
      },
    ]);

    expect(await petResolveListServiceFactory(container)).toBeInstanceOf(Function);

    expect(collectionMocks.length).toBe(0);
    expect(dbMocks.length).toBe(0);
    expect(mongoClientMocks.length).toBe(0);
    expect(containerMocks.length).toBe(0);
  });

  test('petOpenApiRegistryServiceDelegator', async () => {
    const [container, containerMocks] = useObjectMock<Container>([]);

    const factory = () => new OpenAPIRegistry();

    const openApiRegistry = petOpenApiRegistryServiceDelegator(container, 'petOpenApiRegistry', factory);

    expect(openApiRegistry).toBeInstanceOf(OpenAPIRegistry);

    expect(
      new OpenApiGeneratorV3(openApiRegistry.definitions).generateDocument({
        openapi: '3.0.0',
        info: {
          version: '1.0.0',
          title: 'Petstore',
          license: {
            name: 'MIT',
          },
        },
      }),
    ).toMatchInlineSnapshot(`
      {
        "components": {
          "parameters": {},
          "schemas": {},
        },
        "info": {
          "license": {
            "name": "MIT",
          },
          "title": "Petstore",
          "version": "1.0.0",
        },
        "openapi": "3.0.0",
        "paths": {
          "/api/pets": {
            "get": {
              "operationId": "listPets",
              "parameters": [
                {
                  "in": "query",
                  "name": "offset",
                  "required": false,
                  "schema": {
                    "default": 0,
                    "type": "number",
                  },
                },
                {
                  "in": "query",
                  "name": "limit",
                  "required": false,
                  "schema": {
                    "default": 20,
                    "type": "number",
                  },
                },
                {
                  "in": "query",
                  "name": "filters[name]",
                  "required": false,
                  "schema": {
                    "type": "string",
                  },
                },
                {
                  "in": "query",
                  "name": "sort[name]",
                  "required": false,
                  "schema": {
                    "enum": [
                      "asc",
                      "desc",
                    ],
                    "type": "string",
                  },
                },
              ],
              "responses": {
                "200": {
                  "content": {
                    "application/json": {
                      "schema": {
                        "additionalProperties": false,
                        "description": "Pets",
                        "properties": {
                          "_links": {
                            "properties": {
                              "create": {
                                "additionalProperties": false,
                                "properties": {
                                  "attributes": {
                                    "properties": {
                                      "method": {
                                        "type": "string",
                                      },
                                    },
                                    "required": [
                                      "method",
                                    ],
                                    "type": "object",
                                  },
                                  "href": {
                                    "type": "string",
                                  },
                                },
                                "required": [
                                  "href",
                                ],
                                "type": "object",
                              },
                            },
                            "type": "object",
                          },
                          "count": {
                            "type": "number",
                          },
                          "filters": {
                            "additionalProperties": false,
                            "default": {},
                            "properties": {
                              "name": {
                                "type": "string",
                              },
                            },
                            "type": "object",
                          },
                          "items": {
                            "items": {
                              "additionalProperties": false,
                              "properties": {
                                "_links": {
                                  "properties": {
                                    "delete": {
                                      "additionalProperties": false,
                                      "properties": {
                                        "attributes": {
                                          "properties": {
                                            "method": {
                                              "type": "string",
                                            },
                                          },
                                          "required": [
                                            "method",
                                          ],
                                          "type": "object",
                                        },
                                        "href": {
                                          "type": "string",
                                        },
                                      },
                                      "required": [
                                        "href",
                                      ],
                                      "type": "object",
                                    },
                                    "read": {
                                      "additionalProperties": false,
                                      "properties": {
                                        "attributes": {
                                          "properties": {
                                            "method": {
                                              "type": "string",
                                            },
                                          },
                                          "required": [
                                            "method",
                                          ],
                                          "type": "object",
                                        },
                                        "href": {
                                          "type": "string",
                                        },
                                      },
                                      "required": [
                                        "href",
                                      ],
                                      "type": "object",
                                    },
                                    "update": {
                                      "additionalProperties": false,
                                      "properties": {
                                        "attributes": {
                                          "properties": {
                                            "method": {
                                              "type": "string",
                                            },
                                          },
                                          "required": [
                                            "method",
                                          ],
                                          "type": "object",
                                        },
                                        "href": {
                                          "type": "string",
                                        },
                                      },
                                      "required": [
                                        "href",
                                      ],
                                      "type": "object",
                                    },
                                  },
                                  "type": "object",
                                },
                                "createdAt": {
                                  "type": "string",
                                },
                                "id": {
                                  "type": "string",
                                },
                                "name": {
                                  "minLength": 1,
                                  "type": "string",
                                },
                                "tag": {
                                  "minLength": 1,
                                  "type": "string",
                                },
                                "updatedAt": {
                                  "type": "string",
                                },
                                "vaccinations": {
                                  "items": {
                                    "additionalProperties": false,
                                    "properties": {
                                      "name": {
                                        "minLength": 1,
                                        "type": "string",
                                      },
                                    },
                                    "required": [
                                      "name",
                                    ],
                                    "type": "object",
                                  },
                                  "type": "array",
                                },
                              },
                              "required": [
                                "id",
                                "createdAt",
                                "name",
                              ],
                              "type": "object",
                            },
                            "type": "array",
                          },
                          "limit": {
                            "type": "number",
                          },
                          "offset": {
                            "type": "number",
                          },
                          "sort": {
                            "additionalProperties": false,
                            "default": {},
                            "properties": {
                              "name": {
                                "enum": [
                                  "asc",
                                  "desc",
                                ],
                                "type": "string",
                              },
                            },
                            "type": "object",
                          },
                        },
                        "required": [
                          "offset",
                          "limit",
                          "items",
                          "count",
                        ],
                        "type": "object",
                      },
                    },
                  },
                  "description": "Pets",
                },
              },
              "summary": "List all pets",
              "tags": [
                "Pets",
              ],
            },
            "post": {
              "operationId": "createPet",
              "requestBody": {
                "content": {
                  "application/json": {
                    "schema": {
                      "properties": {
                        "name": {
                          "minLength": 1,
                          "type": "string",
                        },
                        "tag": {
                          "minLength": 1,
                          "type": "string",
                        },
                        "vaccinations": {
                          "items": {
                            "additionalProperties": false,
                            "properties": {
                              "name": {
                                "minLength": 1,
                                "type": "string",
                              },
                            },
                            "required": [
                              "name",
                            ],
                            "type": "object",
                          },
                          "type": "array",
                        },
                      },
                      "required": [
                        "name",
                      ],
                      "type": "object",
                    },
                  },
                },
                "description": "Pet data",
                "required": true,
              },
              "responses": {
                "201": {
                  "content": {
                    "application/json": {
                      "schema": {
                        "additionalProperties": false,
                        "description": "Pet",
                        "properties": {
                          "_links": {
                            "properties": {
                              "delete": {
                                "additionalProperties": false,
                                "properties": {
                                  "attributes": {
                                    "properties": {
                                      "method": {
                                        "type": "string",
                                      },
                                    },
                                    "required": [
                                      "method",
                                    ],
                                    "type": "object",
                                  },
                                  "href": {
                                    "type": "string",
                                  },
                                },
                                "required": [
                                  "href",
                                ],
                                "type": "object",
                              },
                              "read": {
                                "additionalProperties": false,
                                "properties": {
                                  "attributes": {
                                    "properties": {
                                      "method": {
                                        "type": "string",
                                      },
                                    },
                                    "required": [
                                      "method",
                                    ],
                                    "type": "object",
                                  },
                                  "href": {
                                    "type": "string",
                                  },
                                },
                                "required": [
                                  "href",
                                ],
                                "type": "object",
                              },
                              "update": {
                                "additionalProperties": false,
                                "properties": {
                                  "attributes": {
                                    "properties": {
                                      "method": {
                                        "type": "string",
                                      },
                                    },
                                    "required": [
                                      "method",
                                    ],
                                    "type": "object",
                                  },
                                  "href": {
                                    "type": "string",
                                  },
                                },
                                "required": [
                                  "href",
                                ],
                                "type": "object",
                              },
                            },
                            "type": "object",
                          },
                          "createdAt": {
                            "type": "string",
                          },
                          "id": {
                            "type": "string",
                          },
                          "name": {
                            "minLength": 1,
                            "type": "string",
                          },
                          "tag": {
                            "minLength": 1,
                            "type": "string",
                          },
                          "updatedAt": {
                            "type": "string",
                          },
                          "vaccinations": {
                            "items": {
                              "additionalProperties": false,
                              "properties": {
                                "name": {
                                  "minLength": 1,
                                  "type": "string",
                                },
                              },
                              "required": [
                                "name",
                              ],
                              "type": "object",
                            },
                            "type": "array",
                          },
                        },
                        "required": [
                          "id",
                          "createdAt",
                          "name",
                        ],
                        "type": "object",
                      },
                    },
                  },
                  "description": "Pet",
                },
              },
              "summary": "Create a pet",
              "tags": [
                "Pets",
              ],
            },
          },
          "/api/pets/{id}": {
            "delete": {
              "operationId": "deletePet",
              "parameters": [
                {
                  "in": "path",
                  "name": "id",
                  "required": true,
                  "schema": {
                    "example": "7d6722b2-a6b7-4c1f-af62-c1e96697de40",
                    "type": "string",
                  },
                },
              ],
              "responses": {
                "204": {
                  "description": "Empty response",
                },
              },
              "summary": "Delete a pet",
              "tags": [
                "Pets",
              ],
            },
            "get": {
              "operationId": "readPet",
              "parameters": [
                {
                  "in": "path",
                  "name": "id",
                  "required": true,
                  "schema": {
                    "example": "7d6722b2-a6b7-4c1f-af62-c1e96697de40",
                    "type": "string",
                  },
                },
              ],
              "responses": {
                "200": {
                  "content": {
                    "application/json": {
                      "schema": {
                        "additionalProperties": false,
                        "description": "Pet",
                        "properties": {
                          "_links": {
                            "properties": {
                              "delete": {
                                "additionalProperties": false,
                                "properties": {
                                  "attributes": {
                                    "properties": {
                                      "method": {
                                        "type": "string",
                                      },
                                    },
                                    "required": [
                                      "method",
                                    ],
                                    "type": "object",
                                  },
                                  "href": {
                                    "type": "string",
                                  },
                                },
                                "required": [
                                  "href",
                                ],
                                "type": "object",
                              },
                              "read": {
                                "additionalProperties": false,
                                "properties": {
                                  "attributes": {
                                    "properties": {
                                      "method": {
                                        "type": "string",
                                      },
                                    },
                                    "required": [
                                      "method",
                                    ],
                                    "type": "object",
                                  },
                                  "href": {
                                    "type": "string",
                                  },
                                },
                                "required": [
                                  "href",
                                ],
                                "type": "object",
                              },
                              "update": {
                                "additionalProperties": false,
                                "properties": {
                                  "attributes": {
                                    "properties": {
                                      "method": {
                                        "type": "string",
                                      },
                                    },
                                    "required": [
                                      "method",
                                    ],
                                    "type": "object",
                                  },
                                  "href": {
                                    "type": "string",
                                  },
                                },
                                "required": [
                                  "href",
                                ],
                                "type": "object",
                              },
                            },
                            "type": "object",
                          },
                          "createdAt": {
                            "type": "string",
                          },
                          "id": {
                            "type": "string",
                          },
                          "name": {
                            "minLength": 1,
                            "type": "string",
                          },
                          "tag": {
                            "minLength": 1,
                            "type": "string",
                          },
                          "updatedAt": {
                            "type": "string",
                          },
                          "vaccinations": {
                            "items": {
                              "additionalProperties": false,
                              "properties": {
                                "name": {
                                  "minLength": 1,
                                  "type": "string",
                                },
                              },
                              "required": [
                                "name",
                              ],
                              "type": "object",
                            },
                            "type": "array",
                          },
                        },
                        "required": [
                          "id",
                          "createdAt",
                          "name",
                        ],
                        "type": "object",
                      },
                    },
                  },
                  "description": "Pet",
                },
              },
              "summary": "Read a pet",
              "tags": [
                "Pets",
              ],
            },
            "put": {
              "operationId": "updatePet",
              "parameters": [
                {
                  "in": "path",
                  "name": "id",
                  "required": true,
                  "schema": {
                    "example": "7d6722b2-a6b7-4c1f-af62-c1e96697de40",
                    "type": "string",
                  },
                },
              ],
              "requestBody": {
                "content": {
                  "application/json": {
                    "schema": {
                      "properties": {
                        "name": {
                          "minLength": 1,
                          "type": "string",
                        },
                        "tag": {
                          "minLength": 1,
                          "type": "string",
                        },
                        "vaccinations": {
                          "items": {
                            "additionalProperties": false,
                            "properties": {
                              "name": {
                                "minLength": 1,
                                "type": "string",
                              },
                            },
                            "required": [
                              "name",
                            ],
                            "type": "object",
                          },
                          "type": "array",
                        },
                      },
                      "required": [
                        "name",
                      ],
                      "type": "object",
                    },
                  },
                },
                "description": "Pet data",
                "required": true,
              },
              "responses": {
                "200": {
                  "content": {
                    "application/json": {
                      "schema": {
                        "additionalProperties": false,
                        "description": "Pet",
                        "properties": {
                          "_links": {
                            "properties": {
                              "delete": {
                                "additionalProperties": false,
                                "properties": {
                                  "attributes": {
                                    "properties": {
                                      "method": {
                                        "type": "string",
                                      },
                                    },
                                    "required": [
                                      "method",
                                    ],
                                    "type": "object",
                                  },
                                  "href": {
                                    "type": "string",
                                  },
                                },
                                "required": [
                                  "href",
                                ],
                                "type": "object",
                              },
                              "read": {
                                "additionalProperties": false,
                                "properties": {
                                  "attributes": {
                                    "properties": {
                                      "method": {
                                        "type": "string",
                                      },
                                    },
                                    "required": [
                                      "method",
                                    ],
                                    "type": "object",
                                  },
                                  "href": {
                                    "type": "string",
                                  },
                                },
                                "required": [
                                  "href",
                                ],
                                "type": "object",
                              },
                              "update": {
                                "additionalProperties": false,
                                "properties": {
                                  "attributes": {
                                    "properties": {
                                      "method": {
                                        "type": "string",
                                      },
                                    },
                                    "required": [
                                      "method",
                                    ],
                                    "type": "object",
                                  },
                                  "href": {
                                    "type": "string",
                                  },
                                },
                                "required": [
                                  "href",
                                ],
                                "type": "object",
                              },
                            },
                            "type": "object",
                          },
                          "createdAt": {
                            "type": "string",
                          },
                          "id": {
                            "type": "string",
                          },
                          "name": {
                            "minLength": 1,
                            "type": "string",
                          },
                          "tag": {
                            "minLength": 1,
                            "type": "string",
                          },
                          "updatedAt": {
                            "type": "string",
                          },
                          "vaccinations": {
                            "items": {
                              "additionalProperties": false,
                              "properties": {
                                "name": {
                                  "minLength": 1,
                                  "type": "string",
                                },
                              },
                              "required": [
                                "name",
                              ],
                              "type": "object",
                            },
                            "type": "array",
                          },
                        },
                        "required": [
                          "id",
                          "createdAt",
                          "name",
                        ],
                        "type": "object",
                      },
                    },
                  },
                  "description": "Pet",
                },
              },
              "summary": "Update a pet",
              "tags": [
                "Pets",
              ],
            },
          },
        },
      }
    `);

    expect(containerMocks.length).toBe(0);
  });

  test('petRoutesServiceDelegator', async () => {
    const request = {} as ServerRequest;
    const response = {} as Response;

    const dummyHandler = async () => response;
    const dummyMiddleware = async () => response;

    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['acceptNegotiationMiddleware'],
        return: dummyMiddleware,
      },
      {
        name: 'get',
        parameters: ['apiErrorMiddleware'],
        return: dummyMiddleware,
      },
      {
        name: 'get',
        parameters: ['petListHandler'],
        return: dummyHandler,
      },
      {
        name: 'get',
        parameters: ['acceptNegotiationMiddleware'],
        return: dummyMiddleware,
      },
      {
        name: 'get',
        parameters: ['apiErrorMiddleware'],
        return: dummyMiddleware,
      },
      {
        name: 'get',
        parameters: ['contentTypeNegotiationMiddleware'],
        return: dummyMiddleware,
      },
      {
        name: 'get',
        parameters: ['petCreateHandler'],
        return: dummyHandler,
      },
      {
        name: 'get',
        parameters: ['acceptNegotiationMiddleware'],
        return: dummyMiddleware,
      },
      {
        name: 'get',
        parameters: ['apiErrorMiddleware'],
        return: dummyMiddleware,
      },
      {
        name: 'get',
        parameters: ['petReadHandler'],
        return: dummyHandler,
      },
      {
        name: 'get',
        parameters: ['acceptNegotiationMiddleware'],
        return: dummyMiddleware,
      },
      {
        name: 'get',
        parameters: ['apiErrorMiddleware'],
        return: dummyMiddleware,
      },
      {
        name: 'get',
        parameters: ['contentTypeNegotiationMiddleware'],
        return: dummyMiddleware,
      },
      {
        name: 'get',
        parameters: ['petUpdateHandler'],
        return: dummyHandler,
      },
      {
        name: 'get',
        parameters: ['acceptNegotiationMiddleware'],
        return: dummyMiddleware,
      },
      {
        name: 'get',
        parameters: ['apiErrorMiddleware'],
        return: dummyMiddleware,
      },
      {
        name: 'get',
        parameters: ['petDeleteHandler'],
        return: dummyHandler,
      },
    ]);

    const routes = petRoutesServiceDelegator(container, 'name', () => []);

    expect(routes).toBeInstanceOf(Array);

    expect(routes).toMatchInlineSnapshot(`
      [
        {
          "_route": "Route",
          "attributes": {},
          "handler": [Function],
          "method": "GET",
          "middlewares": [
            [Function],
            [Function],
          ],
          "name": "pet_list",
          "path": "/api/pets",
          "pathOptions": {},
        },
        {
          "_route": "Route",
          "attributes": {},
          "handler": [Function],
          "method": "POST",
          "middlewares": [
            [Function],
            [Function],
            [Function],
          ],
          "name": "pet_create",
          "path": "/api/pets",
          "pathOptions": {},
        },
        {
          "_route": "Route",
          "attributes": {},
          "handler": [Function],
          "method": "GET",
          "middlewares": [
            [Function],
            [Function],
          ],
          "name": "pet_read",
          "path": "/api/pets/:id",
          "pathOptions": {},
        },
        {
          "_route": "Route",
          "attributes": {},
          "handler": [Function],
          "method": "PUT",
          "middlewares": [
            [Function],
            [Function],
            [Function],
          ],
          "name": "pet_update",
          "path": "/api/pets/:id",
          "pathOptions": {},
        },
        {
          "_route": "Route",
          "attributes": {},
          "handler": [Function],
          "method": "DELETE",
          "middlewares": [
            [Function],
            [Function],
          ],
          "name": "pet_delete",
          "path": "/api/pets/:id",
          "pathOptions": {},
        },
      ]
    `);

    await routeTestingResolveAllLazyMiddlewaresAndHandlers(routes, request, response);

    expect(containerMocks.length).toBe(0);
  });

  test('petUpdateHandlerServiceFactory', async () => {
    const [container, containerMocks] = useObjectMock<Container>([
      {
        name: 'get',
        parameters: ['petFindById'],
        return: () => undefined,
      },
      {
        name: 'get',
        parameters: ['decoder'],
        return: {},
      },
      {
        name: 'get',
        parameters: ['petPersist'],
        return: () => undefined,
      },
      {
        name: 'get',
        parameters: ['responseFactory'],
        return: () => undefined,
      },
      {
        name: 'get',
        parameters: ['encoder'],
        return: {},
      },
      {
        name: 'get',
        parameters: ['petEnrichModel'],
        return: () => undefined,
      },
    ]);

    expect(await petUpdateHandlerServiceFactory(container)).toBeInstanceOf(Function);

    expect(containerMocks.length).toBe(0);
  });
});
