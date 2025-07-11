import type {
  EnrichedList,
  EnrichedModel,
  EnrichList,
  EnrichModel,
  InputModel,
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

const createLink = (href: string, method: Method): Link & { attributes: { method: string } } => {
  return {
    href,
    attributes: {
      method,
    },
  };
};

const createModelLinks = <IM extends InputModel>(
  generatePath: GeneratePath,
  model: Model<IM>,
  links: ModelLinks,
): { [key: string]: Link } => {
  return {
    ...(links.read ? { read: createLink(generatePath(links.read, { id: model.id }), 'GET') } : {}),
    ...(links.update ? { update: createLink(generatePath(links.update, { id: model.id }), 'PUT') } : {}),
    ...(links.delete ? { delete: createLink(generatePath(links.delete, { id: model.id }), 'DELETE') } : {}),
  };
};

export const createEnrichModel = <IM extends InputModel>(
  generatePath: GeneratePath,
  links: ModelLinks,
): EnrichModel<IM> => {
  return async (model: Model<IM>): Promise<EnrichedModel<IM>> => ({
    ...model,
    _links: createModelLinks(generatePath, model, links),
  });
};

export const createEnrichList = <IM extends InputModel>(
  generatePath: GeneratePath,
  links: ListLinks,
): EnrichList<IM> => {
  return async (list: List<IM>): Promise<EnrichedList<IM>> => ({
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
