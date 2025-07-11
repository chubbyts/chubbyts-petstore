import { baseModelSchema, numberSchema, sortSchema, stringSchema } from '@chubbyts/chubbyts-api/dist/model';
import { z } from 'zod';
import { embeddedSchema, modelLinksSchema, listRequestSchema, modelListLinksSchema, listSchema } from '../model.js';

const vaccinationSchema = z
  .object({
    name: stringSchema,
  })
  .strict();

export const petRequestSchema = z
  .object({
    name: stringSchema,
    tag: stringSchema.optional(),
    vaccinations: z.array(vaccinationSchema).optional(),
  })
  .strict();

export type PetRequest = z.infer<typeof petRequestSchema>;

export const petSchema = z
  .object({
    ...baseModelSchema.shape,
    ...petRequestSchema.shape,
  })
  .strict();

export type Pet = z.infer<typeof petSchema>;

export const petResponseSchema = z
  .object({
    ...petSchema.shape,
    _embedded: embeddedSchema,
    _links: modelLinksSchema,
  })
  .strict();

export type PetResponse = z.infer<typeof petResponseSchema>;

export const petRequestListSchema = z
  .object({
    ...listRequestSchema.shape,
    filters: z.object({ name: z.string().optional() }).strict().default({}),
    sort: z.object({ name: sortSchema.optional() }).strict().default({}),
  })
  .strict();

export type PetRequestList = z.infer<typeof petRequestListSchema>;

export const basePetListSchema = z
  .object({
    ...listSchema.shape,
    filters: z.object({ name: z.string().optional() }).strict(),
    sort: z.object({ name: sortSchema.optional() }).strict(),
  })
  .strict();

export const petListSchema = z
  .object({
    ...basePetListSchema.shape,
    items: z.array(petSchema),
    count: numberSchema,
  })
  .strict();

export type PetList = z.infer<typeof petListSchema>;

export const petListResponseSchema = z
  .object({
    ...basePetListSchema.shape,
    items: z.array(petResponseSchema),
    count: numberSchema,
    _embedded: embeddedSchema,
    _links: modelListLinksSchema,
  })
  .strict();

export type PetListResponse = z.infer<typeof petListResponseSchema>;

export const petRequestListOpenApiSchema = z
  .object({
    ...listRequestSchema.shape,
    'filters[name]': z.string().optional(),
    'sort[name]': z.enum(['asc', 'desc']).optional(),
  })
  .strict();

export type PetRequestListOpenApi = z.infer<typeof petRequestListOpenApiSchema>;
