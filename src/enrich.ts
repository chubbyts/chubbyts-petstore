import type {
  EnrichedList,
  EnrichedModel,
  EnrichList,
  EnrichModel,
  Link,
  List,
  Model,
} from '@chubbyts/chubbyts-api/dist/model';
import type { GeneratePath } from '@chubbyts/chubbyts-framework/dist/router/url-generator';
import type { Method } from '@chubbyts/chubbyts-http-types/dist/message';

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

const createModelLinks = <C>(
  generatePath: GeneratePath,
  model: Model<C>,
  links: ModelLinks,
): { [key: string]: Link } => {
  return {
    ...(links.read ? { read: createLink(generatePath(links.read, { id: model.id }), 'GET') } : {}),
    ...(links.update ? { update: createLink(generatePath(links.update, { id: model.id }), 'PUT') } : {}),
    ...(links.delete ? { delete: createLink(generatePath(links.delete, { id: model.id }), 'DELETE') } : {}),
  };
};

export const createEnrichModel = <C>(generatePath: GeneratePath, links: ModelLinks): EnrichModel<Model<C>> => {
  return async (model: Model<C>): Promise<EnrichedModel<Model<C>>> => ({
    ...model,
    _links: createModelLinks(generatePath, model, links),
  });
};

export const createEnrichList = <C>(generatePath: GeneratePath, links: ListLinks): EnrichList<Model<C>> => {
  return async (list: List<Model<C>>): Promise<EnrichedList<Model<C>>> => ({
    ...list,
    items: list.items.map((model) => ({
      ...model,
      _links: createModelLinks(generatePath, model, links),
    })),
    _links: {
      ...(links.create ? { create: createLink(generatePath(links.create), 'POST') } : {}),
    },
  });
};
