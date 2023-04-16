import { z } from 'zod';
import { linkSchema, modelResponseSchema, modelSchema, listRequestSchema } from '../model';

const vaccinationSchema = z
  .object({
    name: z.string().min(1),
  })
  .strict();

export const petRequestSchema = z
  .object({
    name: z.string().min(1),
    tag: z.string().min(1).optional(),
    vaccinations: z.array(vaccinationSchema).optional(),
  })
  .strict();

export type PetRequest = z.infer<typeof petRequestSchema>;

export const petSchema = z
  .object({
    ...modelSchema.shape,
    ...petRequestSchema.shape,
  })
  .strict();

export type Pet = z.infer<typeof petSchema>;

export const petResponseSchema = z
  .object({
    ...modelResponseSchema.shape,
    ...petRequestSchema.shape,
    _links: z
      .object({
        read: linkSchema.optional(),
        update: linkSchema.optional(),
        delete: linkSchema.optional(),
      })
      .optional(),
  })
  .strict();

export type PetResponse = z.infer<typeof petResponseSchema>;

export const petRequestListSchema = z
  .object({
    ...listRequestSchema.shape,
    filters: z.object({ name: z.string().optional() }).strict().default({}),
    sort: z
      .object({ name: z.enum(['asc', 'desc']).optional() })
      .strict()
      .default({}),
  })
  .strict();

export type PetRequestList = z.infer<typeof petRequestListSchema>;

export const petListSchema = z
  .object({
    ...petRequestListSchema.shape,
    items: z.array(petSchema),
    count: z.number(),
  })
  .strict();

export type PetList = z.infer<typeof petListSchema>;

export const petListResponseSchema = z
  .object({
    ...petListSchema.shape,
    offset: z.number(),
    limit: z.number(),
    items: z.array(petResponseSchema),
    _links: z
      .object({
        create: linkSchema.optional(),
      })
      .optional(),
  })
  .strict();

export type PetListResponse = z.infer<typeof petListResponseSchema>;

export const petRequestListOpenApiSchema = z
  .object({
    offset: z.number().default(0),
    limit: z.number().default(20),
    'filters[name]': z.string().optional(),
    'sort[name]': z.enum(['asc', 'desc']).optional(),
  })
  .strict();

export type PetRequestListOpenApi = z.infer<typeof petRequestListOpenApiSchema>;
