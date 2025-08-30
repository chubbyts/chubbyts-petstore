import type { InputModelListSchema, InputModelSchema, Model, Link, ModelList } from '@chubbyts/chubbyts-api/dist/model';
import type { GeneratePath } from '@chubbyts/chubbyts-framework/dist/router/url-generator';
import type { Method } from '@chubbyts/chubbyts-http-types/dist/message';

type ModelLinks = {
  read?: string;
  update?: string;
  delete?: string;
};

type ListLinks = {
  create?: string;
};

const createLink = (href: string, method: Method): Link & { attributes: { method: string } } => {
  return {
    href,
    attributes: {
      method,
    },
  };
};

const enrichModel = <IMS extends InputModelSchema>(
  generatePath: GeneratePath,
  model: Model<IMS>,
  modelLinks: ModelLinks,
) => ({
  ...model,
  _links: {
    ...(modelLinks.read ? { read: createLink(generatePath(modelLinks.read, { id: model.id }), 'GET') } : {}),
    ...(modelLinks.update ? { update: createLink(generatePath(modelLinks.update, { id: model.id }), 'PUT') } : {}),
    ...(modelLinks.delete ? { delete: createLink(generatePath(modelLinks.delete, { id: model.id }), 'DELETE') } : {}),
  },
});

export const createEnrichModel = <IMS extends InputModelSchema>(generatePath: GeneratePath, modelLinks: ModelLinks) => {
  return async (model: Model<IMS>) => enrichModel(generatePath, model, modelLinks);
};

export const createEnrichModelList = <IMS extends InputModelSchema, IMLS extends InputModelListSchema>(
  generatePath: GeneratePath,
  modelLinks: ModelLinks,
  listLinks: ListLinks,
) => {
  return async (modelList: ModelList<IMS, IMLS>) => {
    return {
      ...modelList,
      items: modelList.items.map((model) => enrichModel(generatePath, model, modelLinks)),
      _links: {
        ...(listLinks.create ? { create: createLink(generatePath(listLinks.create), 'POST') } : {}),
      },
    };
  };
};
