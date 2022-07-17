import { Data } from '@chubbyts/chubbyts-decode-encode/dist';
import { Encoder } from '@chubbyts/chubbyts-decode-encode/dist/encoder';
import { Method } from '@chubbyts/chubbyts-http-types/dist/message';
import { Model, ModelList } from './model';
import { GeneratePath } from '@chubbyts/chubbyts-framework/dist/router/url-generator';

type Link = {
  href: string;
  templated: boolean;
  rel: Array<string>;
  attributes: {
    method: Method;
  };
};

const createLink = (href: string, method: Method): Link => {
  return {
    href,
    templated: false,
    rel: [],
    attributes: {
      method,
    },
  };
};

export type Links = {
  create?: string;
  read?: string;
  update?: string;
  delete?: string;
};

const createModelLinks = (generatePath: GeneratePath, model: Model, links: Links): { [key: string]: Link } => {
  return {
    ...(links.read ? { read: createLink(generatePath(links.read, { id: model.id }), Method.GET) } : {}),
    ...(links.update ? { update: createLink(generatePath(links.update, { id: model.id }), Method.PUT) } : {}),
    ...(links.delete ? { delete: createLink(generatePath(links.delete, { id: model.id }), Method.DELETE) } : {}),
  };
};

export const createModelEncoder = (defaultEncoder: Encoder, generatePath: GeneratePath, links: Links): Encoder => {
  return {
    encode: (data: Data, contentType: string, context?: Record<string, unknown>): string => {
      const model = data as unknown as Model;

      return defaultEncoder.encode(
        {
          ...model,
          _links: createModelLinks(generatePath, model, links),
        } as unknown as Data,
        contentType,
        context,
      );
    },
    contentTypes: defaultEncoder.contentTypes,
  };
};

export const createModelListEncoder = (defaultEncoder: Encoder, generatePath: GeneratePath, links: Links): Encoder => {
  return {
    encode: (data: Data, contentType: string, context?: Record<string, unknown>): string => {
      const list = data as unknown as ModelList;
      const { items, ...rest } = list;

      return defaultEncoder.encode(
        {
          ...rest,
          _embedded: {
            items: items.map((model) => {
              return {
                ...model,
                _links: createModelLinks(generatePath, model, links),
              };
            }),
          },
          _links: {
            ...(links.create ? { create: createLink(generatePath(links.create), Method.POST) } : {}),
          },
        } as unknown as Data,
        contentType,
        context,
      );
    },
    contentTypes: defaultEncoder.contentTypes,
  };
};
