import { z } from 'zod';
import { linkSchema, modelHalSchema, modelSchema, partialListSchema } from '../model';

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

export const petHalSchema = z
  .object({
    ...modelHalSchema.shape,
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

const petListSchema = z
  .object({
    ...partialPetListSchema.shape,
    items: z.array(modelSchema),
    count: z.number(),
  })
  .strict();

export const petListHalSchema = z
  .object({
    ...petListSchema.shape,
    items: z.array(petHalSchema),
    _links: z
      .object({
        create: linkSchema.optional(),
      })
      .optional(),
  })
  .strict();
