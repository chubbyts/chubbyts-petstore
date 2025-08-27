import type { Decoder } from '@chubbyts/chubbyts-decode-encode/dist/decoder/decoder';
import type { Encoder } from '@chubbyts/chubbyts-decode-encode/dist/encoder/encoder';
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
import type { EnrichModelList, EnrichModel } from '@chubbyts/chubbyts-api/dist/model';
import { extendZodWithOpenApi, type OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { createEnrichModelList, createEnrichModel } from '../enrich.js';
import { createResolveModelList, createFindModelById, createPersistModel, createRemoveModel } from '../repository.js';
import type { InputPetListSchema, InputPetSchema } from './model.js';
import {
  enrichedPetListSchema,
  enrichedPetSchema,
  inputPetListOpenApiSchema,
  inputPetListSchema,
  inputPetSchema,
} from './model.js';

extendZodWithOpenApi(z);

export const petCreateHandlerServiceFactory = async (container: Container): Promise<Handler> => {
  return createCreateHandler(
    container.get<Decoder>('decoder'),
    inputPetSchema,
    await container.get<Promise<PersistModel<InputPetSchema>>>('petPersistModel'),
    container.get<ResponseFactory>('responseFactory'),
    enrichedPetSchema,
    container.get<Encoder>('encoder'),
    container.get<EnrichModel<InputPetSchema>>('petEnrichModel'),
  );
};

export const petDeleteHandlerServiceFactory = async (container: Container): Promise<Handler> => {
  return createDeleteHandler(
    await container.get<Promise<FindModelById<InputPetSchema>>>('petFindModelById'),
    await container.get<Promise<RemoveModel<InputPetSchema>>>('petRemoveModel'),
    container.get<ResponseFactory>('responseFactory'),
  );
};

export const petEnrichModelServiceFactory = (container: Container): EnrichModel<InputPetSchema> => {
  return createEnrichModel(container.get<GeneratePath>('generatePath'), {
    read: 'pet_read',
    update: 'pet_update',
    delete: 'pet_delete',
  });
};

export const petEnrichModelListServiceFactory = (
  container: Container,
): EnrichModelList<InputPetSchema, InputPetListSchema> => {
  return createEnrichModelList(
    container.get<GeneratePath>('generatePath'),
    {
      read: 'pet_read',
      update: 'pet_update',
      delete: 'pet_delete',
    },
    {
      create: 'pet_create',
    },
  );
};

export const petFindModelByIdServiceFactory = async (container: Container): Promise<FindModelById<InputPetSchema>> => {
  return createFindModelById(await container.get<Promise<MongoClient>>('mongoClient'), 'pets');
};

export const petListHandlerServiceFactory = async (container: Container): Promise<Handler> => {
  return createListHandler(
    inputPetListSchema,
    await container.get<Promise<ResolveModelList<InputPetSchema, InputPetListSchema>>>('petResolveModelList'),
    container.get<ResponseFactory>('responseFactory'),
    enrichedPetListSchema,
    container.get<Encoder>('encoder'),
    container.get<EnrichModelList<InputPetSchema, InputPetListSchema>>('petEnrichModelList'),
  );
};

export const petPersistModelServiceFactory = async (container: Container): Promise<PersistModel<InputPetSchema>> => {
  return createPersistModel(await container.get<Promise<MongoClient>>('mongoClient'), 'pets');
};

export const petReadHandlerServiceFactory = async (container: Container): Promise<Handler> => {
  return createReadHandler(
    await container.get<Promise<FindModelById<InputPetSchema>>>('petFindModelById'),
    container.get<ResponseFactory>('responseFactory'),
    enrichedPetSchema,
    container.get<Encoder>('encoder'),
    container.get<EnrichModel<InputPetSchema>>('petEnrichModel'),
  );
};

export const petRemoveModelServiceFactory = async (container: Container): Promise<RemoveModel<InputPetSchema>> => {
  return createRemoveModel(await container.get<Promise<MongoClient>>('mongoClient'), 'pets');
};

export const petResolveModelListServiceFactory = async (
  container: Container,
): Promise<ResolveModelList<InputPetSchema, InputPetListSchema>> => {
  return createResolveModelList(await container.get<Promise<MongoClient>>('mongoClient'), 'pets');
};

export const petUpdateHandlerServiceFactory = async (container: Container): Promise<Handler> => {
  return createUpdateHandler(
    await container.get<Promise<FindModelById<InputPetSchema>>>('petFindModelById'),
    container.get<Decoder>('decoder'),
    inputPetSchema,
    await container.get<Promise<PersistModel<InputPetSchema>>>('petPersistModel'),
    container.get<ResponseFactory>('responseFactory'),
    enrichedPetSchema,
    container.get<Encoder>('encoder'),
    container.get<EnrichModel<InputPetSchema>>('petEnrichModel'),
  );
};

// delegator's

export const petOpenApiRegistryServiceDelegator = (_container: Container, _name: string, factory: () => unknown) => {
  const registry = factory() as OpenAPIRegistry;

  registry.registerPath({
    path: '/api/pets',
    method: 'get',
    summary: 'List all pets',
    operationId: 'listPets',
    tags: ['Pets'],
    request: {
      query: inputPetListOpenApiSchema.strip(),
    },
    responses: {
      200: {
        description: 'Pets',
        content: {
          'application/json': {
            schema: enrichedPetListSchema.openapi({
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
            schema: inputPetSchema.strip(),
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
            schema: enrichedPetListSchema.openapi({
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
            schema: enrichedPetSchema.openapi({
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
            schema: inputPetSchema.strip(),
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
            schema: enrichedPetSchema.openapi({
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
