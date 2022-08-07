import {
  EnrichedList,
  EnrichedModel,
  EnrichList,
  EnrichModel,
  Link,
  List,
  Model,
} from '@chubbyts/chubbyts-api/dist/model';
import { GeneratePath } from '@chubbyts/chubbyts-framework/dist/router/url-generator';
import { Method } from '@chubbyts/chubbyts-http-types/dist/message';

type ModelLinks = {
  read?: string;
  update?: string;
  delete?: string;
};

type ListLinks = {
  create?: string;
} & ModelLinks;

const createLink = (href: string, method: Method): Link => {
  return {
    href,
    attributes: {
      method,
    },
  };
};

const createModelLinks = (generatePath: GeneratePath, model: Model, links: ModelLinks): { [key: string]: Link } => {
  return {
    ...(links.read ? { read: createLink(generatePath(links.read, { id: model.id }), Method.GET) } : {}),
    ...(links.update ? { update: createLink(generatePath(links.update, { id: model.id }), Method.PUT) } : {}),
    ...(links.delete ? { delete: createLink(generatePath(links.delete, { id: model.id }), Method.DELETE) } : {}),
  };
};

export const createEnrichModel = (generatePath: GeneratePath, links: ListLinks): EnrichModel => {
  return (model: Model): EnrichedModel => ({
    ...model,
    _links: createModelLinks(generatePath, model, links),
  });
};

export const createEnrichList = (generatePath: GeneratePath, links: ListLinks): EnrichList => {
  return (list: List): EnrichedList => ({
    ...list,
    items: list.items.map((model) => ({
      ...model,
      _links: createModelLinks(generatePath, model, links),
    })),
    _links: {
      ...(links.create ? { create: createLink(generatePath(links.create), Method.POST) } : {}),
    },
  });
};
