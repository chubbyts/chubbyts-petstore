import { Decoder } from '@chubbyts/chubbyts-decode-encode/dist/decoder';
import { Encoder } from '@chubbyts/chubbyts-decode-encode/dist/encoder';
import { Container } from '@chubbyts/chubbyts-dic-types/dist/container';
import { createLazyHandler } from '@chubbyts/chubbyts-framework/dist/handler/lazy-handler';
import { createLazyMiddleware } from '@chubbyts/chubbyts-framework/dist/middleware/lazy-middleware';
import { createGroup, getRoutes } from '@chubbyts/chubbyts-framework/dist/router/group';
import {
  createDeleteRoute,
  createGetRoute,
  createPostRoute,
  createPutRoute,
  Route,
} from '@chubbyts/chubbyts-framework/dist/router/route';
import { Handler } from '@chubbyts/chubbyts-http-types/dist/handler';
import { ResponseFactory } from '@chubbyts/chubbyts-http-types/dist/message-factory';
import { MongoClient } from 'mongodb';
import { createResolveList, createFindById, createPersist, createRemove } from '../repository';
import { partialPetSchema, partialPetListSchema, petListSchema, petSchema } from './model';
import { createCreateHandler } from '@chubbyts/chubbyts-api/dist/handler/create';
import { createReadHandler } from '@chubbyts/chubbyts-api/dist/handler/read';
import { createUpdateHandler } from '@chubbyts/chubbyts-api/dist/handler/update';
import { createDeleteHandler } from '@chubbyts/chubbyts-api/dist/handler/delete';
import { createListHandler } from '@chubbyts/chubbyts-api/dist/handler/list';
import { FindById, Persist, Remove, ResolveList } from '@chubbyts/chubbyts-api/dist/repository';

export const petListHandlerServiceFactory = async (container: Container): Promise<Handler> => {
  return createListHandler(
    partialPetListSchema,
    await container.get<Promise<ResolveList>>('petResolveList'),
    container.get<ResponseFactory>('responseFactory'),
    petListSchema,
    container.get<Encoder>('encoder'),
  );
};

export const petCreateHandlerServiceFactory = async (container: Container): Promise<Handler> => {
  return createCreateHandler(
    container.get<Decoder>('decoder'),
    partialPetSchema,
    await container.get<Promise<Persist>>('petPersist'),
    container.get<ResponseFactory>('responseFactory'),
    petSchema,
    container.get<Encoder>('encoder'),
  );
};

export const petReadHandlerServiceFactory = async (container: Container): Promise<Handler> => {
  return createReadHandler(
    await container.get<Promise<FindById>>('petFindById'),
    container.get<ResponseFactory>('responseFactory'),
    petSchema,
    container.get<Encoder>('encoder'),
  );
};

export const petUpdateHandlerServiceFactory = async (container: Container): Promise<Handler> => {
  return createUpdateHandler(
    await container.get<Promise<FindById>>('petFindById'),
    container.get<Decoder>('decoder'),
    partialPetSchema,
    await container.get<Promise<Persist>>('petPersist'),
    container.get<ResponseFactory>('responseFactory'),
    petSchema,
    container.get<Encoder>('encoder'),
  );
};

export const petDeleteHandlerServiceFactory = async (container: Container): Promise<Handler> => {
  return createDeleteHandler(
    await container.get<Promise<FindById>>('petFindById'),
    await container.get<Promise<Remove>>('petRemove'),
    container.get<ResponseFactory>('responseFactory'),
  );
};

export const petResolveListServiceFactory = async (container: Container): Promise<ResolveList> => {
  return createResolveList(await container.get<Promise<MongoClient>>('mongoClient'), 'pet');
};

export const petFindByIdServiceFactory = async (container: Container): Promise<FindById> => {
  return createFindById(await container.get<Promise<MongoClient>>('mongoClient'), 'pet');
};

export const petPersistServiceFactory = async (container: Container): Promise<Persist> => {
  return createPersist(await container.get<Promise<MongoClient>>('mongoClient'), 'pet');
};

export const petRemoveServiceFactory = async (container: Container): Promise<Remove> => {
  return createRemove(await container.get<Promise<MongoClient>>('mongoClient'), 'pet');
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
