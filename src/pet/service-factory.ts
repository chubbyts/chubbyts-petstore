import type { Decoder } from '@chubbyts/chubbyts-decode-encode/dist/decoder';
import type { Encoder } from '@chubbyts/chubbyts-decode-encode/dist/encoder';
import type { Container } from '@chubbyts/chubbyts-dic-types/dist/container';
import { createLazyHandler } from '@chubbyts/chubbyts-framework/dist/handler/lazy-handler';
import { createLazyMiddleware } from '@chubbyts/chubbyts-framework/dist/middleware/lazy-middleware';
import { createGroup, getRoutes } from '@chubbyts/chubbyts-framework/dist/router/group';
import type { Route } from '@chubbyts/chubbyts-framework/dist/router/route';
import {
  createDeleteRoute,
  createGetRoute,
  createPostRoute,
  createPutRoute,
} from '@chubbyts/chubbyts-framework/dist/router/route';
import type { Handler } from '@chubbyts/chubbyts-http-types/dist/handler';
import type { ResponseFactory } from '@chubbyts/chubbyts-http-types/dist/message-factory';
import type { MongoClient } from 'mongodb';
import { createCreateHandler } from '@chubbyts/chubbyts-api/dist/handler/create';
import { createReadHandler } from '@chubbyts/chubbyts-api/dist/handler/read';
import { createUpdateHandler } from '@chubbyts/chubbyts-api/dist/handler/update';
import { createDeleteHandler } from '@chubbyts/chubbyts-api/dist/handler/delete';
import { createListHandler } from '@chubbyts/chubbyts-api/dist/handler/list';
import type {
  FindModelById,
  PersistModel,
  RemoveModel,
  ResolveModelList,
} from '@chubbyts/chubbyts-api/dist/repository';
import type { GeneratePath } from '@chubbyts/chubbyts-framework/dist/router/url-generator';
import type { EnrichList, EnrichModel } from '@chubbyts/chubbyts-api/dist/model';
import { extendZodWithOpenApi, type OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { createEnrichList, createEnrichModel } from '../enrich.js';
import { createResolveModelList, createFindModelById, createPersistModel, createRemoveModel } from '../repository.js';
import type { Pet, PetRequest } from './model.js';
import {
  petRequestSchema,
  petRequestListSchema,
  petResponseSchema,
  petListResponseSchema,
  petRequestListOpenApiSchema,
} from './model.js';

export const petCreateHandlerServiceFactory = async (container: Container): Promise<Handler> => {
  return createCreateHandler<PetRequest>(
    container.get<Decoder>('decoder'),
    petRequestSchema,
    await container.get<Promise<PersistModel<PetRequest>>>('petPersistModel'),
    container.get<ResponseFactory>('responseFactory'),
    petResponseSchema,
    container.get<Encoder>('encoder'),
    container.get<EnrichModel<PetRequest>>('petEnrichModel'),
  );
};

export const petDeleteHandlerServiceFactory = async (container: Container): Promise<Handler> => {
  return createDeleteHandler<PetRequest>(
    await container.get<Promise<FindModelById<PetRequest>>>('petFindModelById'),
    await container.get<Promise<RemoveModel<PetRequest>>>('petRemoveModel'),
    container.get<ResponseFactory>('responseFactory'),
  );
};

export const petEnrichModelServiceFactory = (container: Container): EnrichModel<PetRequest> => {
  return createEnrichModel(container.get<GeneratePath>('generatePath'), {
    read: 'pet_read',
    update: 'pet_update',
    delete: 'pet_delete',
  });
};

export const petEnrichListServiceFactory = (container: Container): EnrichList<PetRequest> => {
  return createEnrichList(container.get<GeneratePath>('generatePath'), {
    create: 'pet_create',
    read: 'pet_read',
    update: 'pet_update',
    delete: 'pet_delete',
  });
};

export const petFindModelByIdServiceFactory = async (container: Container): Promise<FindModelById<PetRequest>> => {
  return createFindModelById(await container.get<Promise<MongoClient>>('mongoClient'), 'pets');
};

export const petListHandlerServiceFactory = async (container: Container): Promise<Handler> => {
  return createListHandler<PetRequest>(
    petRequestListSchema,
    await container.get<Promise<ResolveModelList<PetRequest>>>('petResolveModelList'),
    container.get<ResponseFactory>('responseFactory'),
    petListResponseSchema,
    container.get<Encoder>('encoder'),
    container.get<EnrichList<Pet>>('petEnrichList'),
  );
};

export const petPersistModelServiceFactory = async (container: Container): Promise<PersistModel<PetRequest>> => {
  return createPersistModel(await container.get<Promise<MongoClient>>('mongoClient'), 'pets');
};

export const petReadHandlerServiceFactory = async (container: Container): Promise<Handler> => {
  return createReadHandler<PetRequest>(
    await container.get<Promise<FindModelById<PetRequest>>>('petFindModelById'),
    container.get<ResponseFactory>('responseFactory'),
    petResponseSchema,
    container.get<Encoder>('encoder'),
    container.get<EnrichModel<Pet>>('petEnrichModel'),
  );
};

export const petRemoveModelServiceFactory = async (container: Container): Promise<RemoveModel<PetRequest>> => {
  return createRemoveModel(await container.get<Promise<MongoClient>>('mongoClient'), 'pets');
};

export const petResolveModelListServiceFactory = async (
  container: Container,
): Promise<ResolveModelList<PetRequest>> => {
  return createResolveModelList(await container.get<Promise<MongoClient>>('mongoClient'), 'pets');
};

export const petUpdateHandlerServiceFactory = async (container: Container): Promise<Handler> => {
  return createUpdateHandler<PetRequest>(
    await container.get<Promise<FindModelById<PetRequest>>>('petFindModelById'),
    container.get<Decoder>('decoder'),
    petRequestSchema,
    await container.get<Promise<PersistModel<PetRequest>>>('petPersistModel'),
    container.get<ResponseFactory>('responseFactory'),
    petResponseSchema,
    container.get<Encoder>('encoder'),
    container.get<EnrichModel<PetRequest>>('petEnrichModel'),
  );
};

// delegator's

export const petOpenApiRegistryServiceDelegator = (_container: Container, _name: string, factory: () => unknown) => {
  extendZodWithOpenApi(z);

  const registry = factory() as OpenAPIRegistry;

  registry.registerPath({
    path: '/api/pets',
    method: 'get',
    summary: 'List all pets',
    operationId: 'listPets',
    tags: ['Pets'],
    request: {
      query: petRequestListOpenApiSchema.strip(),
    },
    responses: {
      200: {
        description: 'Pets',
        content: {
          'application/json': {
            schema: petListResponseSchema.openapi({
              description: 'Pets',
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    path: '/api/pets',
    method: 'post',
    summary: 'Create a pet',
    operationId: 'createPet',
    tags: ['Pets'],
    request: {
      body: {
        description: 'Pet data',
        content: {
          'application/json': {
            schema: petRequestSchema.strip(),
          },
        },
        required: true,
      },
    },
    responses: {
      201: {
        description: 'Pet',
        content: {
          'application/json': {
            schema: petResponseSchema.openapi({
              description: 'Pet',
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    path: '/api/pets/{id}',
    method: 'get',
    summary: 'Read a pet',
    operationId: 'readPet',
    tags: ['Pets'],
    request: {
      params: z.object({
        id: z.string().openapi({ example: '7d6722b2-a6b7-4c1f-af62-c1e96697de40' }),
      }),
    },
    responses: {
      200: {
        description: 'Pet',
        content: {
          'application/json': {
            schema: petResponseSchema.openapi({
              description: 'Pet',
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    path: '/api/pets/{id}',
    method: 'put',
    summary: 'Update a pet',
    operationId: 'updatePet',
    tags: ['Pets'],
    request: {
      params: z.object({
        id: z.string().openapi({ example: '7d6722b2-a6b7-4c1f-af62-c1e96697de40' }),
      }),
      body: {
        description: 'Pet data',
        content: {
          'application/json': {
            schema: petRequestSchema.strip(),
          },
        },
        required: true,
      },
    },
    responses: {
      200: {
        description: 'Pet',
        content: {
          'application/json': {
            schema: petResponseSchema.openapi({
              description: 'Pet',
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    path: '/api/pets/{id}',
    method: 'delete',
    summary: 'Delete a pet',
    operationId: 'deletePet',
    tags: ['Pets'],
    request: {
      params: z.object({
        id: z.string().openapi({ example: '7d6722b2-a6b7-4c1f-af62-c1e96697de40' }),
      }),
    },
    responses: {
      204: {
        description: 'Empty response',
      },
    },
  });

  return registry;
};

export const petRoutesServiceDelegator = (
  container: Container,
  _name: string,
  factory: () => unknown,
): Array<Route> => {
  const h = (name: string) => createLazyHandler(container, name);
  const m = (name: string) => createLazyMiddleware(container, name);

  return [
    ...(factory() as Array<Route>),
    ...getRoutes(
      createGroup({
        path: '/api/pets',
        children: [
          createGetRoute({
            path: '',
            name: 'pet_list',
            handler: h('petListHandler'),
          }),
          createPostRoute({
            path: '',
            name: 'pet_create',
            handler: h('petCreateHandler'),
            middlewares: [m('contentTypeNegotiationMiddleware')],
          }),
          createGetRoute({
            path: '/:id',
            name: 'pet_read',
            handler: h('petReadHandler'),
          }),
          createPutRoute({
            path: '/:id',
            name: 'pet_update',
            handler: h('petUpdateHandler'),
            middlewares: [m('contentTypeNegotiationMiddleware')],
          }),
          createDeleteRoute({
            path: '/:id',
            name: 'pet_delete',
            handler: h('petDeleteHandler'),
          }),
        ],
        middlewares: [m('acceptNegotiationMiddleware'), m('apiErrorMiddleware')],
      }),
    ),
  ];
};
