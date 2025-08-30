import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import type {
  EnrichedModel,
  EnrichedModelList,
  EnrichedModelListSchema,
  EnrichedModelSchema,
  InputModel,
  InputModelList,
  Model,
  ModelList,
  ModelListSchema,
  ModelSchema,
} from '@chubbyts/chubbyts-api/dist/model';
import {
  numberSchema,
  sortSchema,
  stringSchema,
  createEnrichedModelListSchema,
  createModelSchema,
  createModelListSchema,
  createEnrichedModelSchema,
} from '@chubbyts/chubbyts-api/dist/model';

extendZodWithOpenApi(z);

export const inputPetSchema = z
  .object({
    name: stringSchema,
    tag: stringSchema.optional(),
    vaccinations: z.array(z.object({ name: stringSchema }).strict()),
  })
  .strict();

export type InputPetSchema = typeof inputPetSchema;

export type InputPet = InputModel<InputPetSchema>;

export const inputPetListSchema = z
  .object({
    offset: numberSchema.default(0),
    limit: numberSchema.default(20),
    filters: z.object({ name: stringSchema.optional() }).strict().default({}),
    sort: z.object({ name: sortSchema }).strict().default({}),
  })
  .strict();

export type InputPetListSchema = typeof inputPetListSchema;

export type InputPetList = InputModelList<InputPetListSchema>;

export type PetSchema = ModelSchema<InputPetSchema>;

export const petSchema: PetSchema = createModelSchema(inputPetSchema);

export type Pet = Model<InputPetSchema>;

export type PetListSchema = ModelListSchema<InputPetSchema, InputPetListSchema>;

export const petListSchema: PetListSchema = createModelListSchema(inputPetSchema, inputPetListSchema);

export type PetList = ModelList<InputPetSchema, InputPetListSchema>;

export type EnrichedPetSchema = EnrichedModelSchema<InputPetSchema>;

export const enrichedPetSchema: EnrichedPetSchema = createEnrichedModelSchema(inputPetSchema);

export type EnrichedPet = EnrichedModel<InputPetSchema>;

export type EnrichedPetListSchema = EnrichedModelListSchema<InputPetSchema, InputPetListSchema>;

export const enrichedPetListSchema: EnrichedPetListSchema = createEnrichedModelListSchema(
  inputPetSchema,
  inputPetListSchema,
);

export type EnrichedPetList = EnrichedModelList<InputPetSchema, InputPetListSchema>;

export const inputPetListOpenApiSchema = z
  .object({
    offset: numberSchema.default(0),
    limit: numberSchema.default(20),
    'filters[name]': z.string().optional(),
    'sort[name]': z.enum(['asc', 'desc']).optional(),
  })
  .strict();

export type InputPetListOpenApi = z.infer<typeof inputPetListOpenApiSchema>;
