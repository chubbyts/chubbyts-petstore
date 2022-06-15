import { z } from 'zod';
import { modelSchema, partialListSchema } from '../model';

export const vaccinationSchema = z
  .object({
    name: z.string(),
  })
  .strict();

export const partialPetSchema = z
  .object({
    name: z.string(),
    tag: z.string().optional(),
    vaccinations: z.array(vaccinationSchema).optional(),
  })
  .strict();

export const petSchema = z.object({ ...modelSchema.shape, ...partialPetSchema.shape }).strict();

export const partialPetListSchema = partialListSchema
  .extend({
    filters: z.object({ name: z.string().optional() }).strict().optional(),
    sort: z
      .object({ name: z.enum(['asc', 'desc']).optional() })
      .strict()
      .optional(),
  })
  .strict();

export const petListSchema = partialPetListSchema
  .extend({
    items: z.array(petSchema),
    count: z.number(),
  })
  .strict();
