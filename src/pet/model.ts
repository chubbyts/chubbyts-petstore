import { z } from 'zod';
import { linkSchema, modelResponseSchema, modelSchema, partialListSchema } from '../model';

const vaccinationSchema = z
  .object({
    name: z.string().min(1),
  })
  .strict();

export const partialPetSchema = z
  .object({
    name: z.string().min(1),
    tag: z.string().min(1).optional(),
    vaccinations: z.array(vaccinationSchema).optional(),
  })
  .strict();

export const petResponseSchema = z
  .object({
    ...modelResponseSchema.shape,
    ...partialPetSchema.shape,
    _links: z
      .object({
        read: linkSchema.optional(),
        update: linkSchema.optional(),
        delete: linkSchema.optional(),
      })
      .optional(),
  })
  .strict();

export const partialPetListSchema = z
  .object({
    ...partialListSchema.shape,
    filters: z.object({ name: z.string().optional() }).strict().optional(),
    sort: z
      .object({ name: z.enum(['asc', 'desc']).optional() })
      .strict()
      .optional(),
  })
  .strict();

export const partialPetListResponseSchema = z
  .object({
    offset: z.number().default(0),
    limit: z.number().default(20),
    'filters[name]': z.string().optional(),
    'sort[name]': z.enum(['asc', 'desc']).optional(),
  })
  .strict();

const petListSchema = z
  .object({
    ...partialPetListSchema.shape,
    items: z.array(modelSchema),
    count: z.number(),
  })
  .strict();

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
