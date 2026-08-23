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
import type { MongoClient } from 'mongodb';
import { createCreateHandler } from '@chubbyts/chubbyts-undici-api/dist/handler/create';
import { createReadHandler } from '@chubbyts/chubbyts-undici-api/dist/handler/read';
import { createUpdateHandler } from '@chubbyts/chubbyts-undici-api/dist/handler/update';
import { createDeleteHandler } from '@chubbyts/chubbyts-undici-api/dist/handler/delete';
import { createListHandler } from '@chubbyts/chubbyts-undici-api/dist/handler/list';
import type {
  FindModelById,
  PersistModel,
  RemoveModel,
  ResolveModelList,
} from '@chubbyts/chubbyts-undici-api/dist/repository';
import type { GeneratePath } from '@chubbyts/chubbyts-framework/dist/router/url-generator';
import type { EnrichModelList, EnrichModel } from '@chubbyts/chubbyts-undici-api/dist/model';
import { extendZodWithOpenApi, type OpenAPIRegistry, type RouteConfig } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import type { Handler } from '@chubbyts/chubbyts-undici-server/dist/server';
import { v7 } from 'uuid';
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

const petCollectionName = 'pets';

export const petCreateHandlerServiceFactory = async (container: Container): Promise<Handler> => {
  return createCreateHandler(
    container.get<Decoder>('decoder'),
    inputPetSchema,
    await container.get<Promise<PersistModel<InputPetSchema>>>('petPersistModel'),
    enrichedPetSchema,
    container.get<Encoder>('encoder'),
    container.get<EnrichModel<InputPetSchema>>('petEnrichModel'),
    v7,
  );
};

export const petDeleteHandlerServiceFactory = async (container: Container): Promise<Handler> => {
  return createDeleteHandler(
    await container.get<Promise<FindModelById<InputPetSchema>>>('petFindModelById'),
    await container.get<Promise<RemoveModel<InputPetSchema>>>('petRemoveModel'),
  );
};

export const petEnrichModelServiceFactory = (container: Container): EnrichModel<InputPetSchema> => {
  return createEnrichModel<InputPetSchema>(container.get<GeneratePath>('generatePath'), {
    read: 'pet_read',
    update: 'pet_update',
    delete: 'pet_delete',
  });
};

export const petEnrichModelListServiceFactory = (
  container: Container,
): EnrichModelList<InputPetSchema, InputPetListSchema> => {
  return createEnrichModelList<InputPetSchema, InputPetListSchema>(
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
  return createFindModelById(await container.get<Promise<MongoClient>>('mongoClient'), petCollectionName);
};

export const petListHandlerServiceFactory = async (container: Container): Promise<Handler> => {
  return createListHandler(
    inputPetListSchema,
    await container.get<Promise<ResolveModelList<InputPetSchema, InputPetListSchema>>>('petResolveModelList'),
    enrichedPetListSchema,
    container.get<Encoder>('encoder'),
    container.get<EnrichModelList<InputPetSchema, InputPetListSchema>>('petEnrichModelList'),
  );
};

export const petPersistModelServiceFactory = async (container: Container): Promise<PersistModel<InputPetSchema>> => {
  return createPersistModel<InputPetSchema>(
    await container.get<Promise<MongoClient>>('mongoClient'),
    petCollectionName,
  );
};

export const petReadHandlerServiceFactory = async (container: Container): Promise<Handler> => {
  return createReadHandler(
    await container.get<Promise<FindModelById<InputPetSchema>>>('petFindModelById'),
    enrichedPetSchema,
    container.get<Encoder>('encoder'),
    container.get<EnrichModel<InputPetSchema>>('petEnrichModel'),
  );
};

export const petRemoveModelServiceFactory = async (container: Container): Promise<RemoveModel<InputPetSchema>> => {
  return createRemoveModel(await container.get<Promise<MongoClient>>('mongoClient'), petCollectionName);
};

export const petResolveModelListServiceFactory = async (
  container: Container,
): Promise<ResolveModelList<InputPetSchema, InputPetListSchema>> => {
  return createResolveModelList(await container.get<Promise<MongoClient>>('mongoClient'), petCollectionName);
};

export const petUpdateHandlerServiceFactory = async (container: Container): Promise<Handler> => {
  return createUpdateHandler(
    await container.get<Promise<FindModelById<InputPetSchema>>>('petFindModelById'),
    container.get<Decoder>('decoder'),
    inputPetSchema,
    await container.get<Promise<PersistModel<InputPetSchema>>>('petPersistModel'),
    enrichedPetSchema,
    container.get<Encoder>('encoder'),
    container.get<EnrichModel<InputPetSchema>>('petEnrichModel'),
  );
};

// delegator's

export const petOpenApiRegistryServiceDelegator = (_container: Container, _name: string, factory: () => unknown) => {
  const registry = factory() as OpenAPIRegistry;

  const petRequestParams = z.object({
    id: z.string().openapi({ example: '019c201f-6a83-7696-9899-50fbf7b2278d' }),
  });

  const petRequestBody = {
    description: 'Pet data',
    content: {
      'application/json': {
        schema: inputPetSchema,
      },
    },
    required: true,
  };

  const petResponse = {
    description: 'Pet',
    content: {
      'application/json': {
        schema: enrichedPetSchema.openapi({
          description: 'Pet',
        }),
      },
    },
  };

  const unauthorizedResponse = {
    description: 'Missing or invalid token',
  };

  const registerPetPath = (routeConfig: Omit<RouteConfig, 'tags' | 'security'>) => {
    registry.registerPath({
      ...routeConfig,
      tags: ['Pets'],
      security: [{ bearerAuth: [] }],
    });
  };

  registerPetPath({
    path: '/api/pets',
    method: 'get',
    summary: 'List all pets',
    operationId: 'listPets',
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
      401: unauthorizedResponse,
    },
  });

  registerPetPath({
    path: '/api/pets',
    method: 'post',
    summary: 'Create a pet',
    operationId: 'createPet',
    request: {
      body: petRequestBody,
    },
    responses: {
      201: petResponse,
      401: unauthorizedResponse,
    },
  });

  registerPetPath({
    path: '/api/pets/{id}',
    method: 'get',
    summary: 'Read a pet',
    operationId: 'readPet',
    request: {
      params: petRequestParams,
    },
    responses: {
      200: petResponse,
      401: unauthorizedResponse,
    },
  });

  registerPetPath({
    path: '/api/pets/{id}',
    method: 'put',
    summary: 'Update a pet',
    operationId: 'updatePet',
    request: {
      params: petRequestParams,
      body: petRequestBody,
    },
    responses: {
      200: petResponse,
      401: unauthorizedResponse,
    },
  });

  registerPetPath({
    path: '/api/pets/{id}',
    method: 'delete',
    summary: 'Delete a pet',
    operationId: 'deletePet',
    request: {
      params: petRequestParams,
    },
    responses: {
      204: {
        description: 'Empty response',
      },
      401: unauthorizedResponse,
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
        middlewares: [m('acceptNegotiationMiddleware'), m('apiErrorMiddleware'), m('oidcAuthenticationMiddleware')],
      }),
    ),
  ];
};
