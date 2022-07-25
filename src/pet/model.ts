import { z } from 'zod';
import { modelSchema, partialModelListSchema } from '../model';

export const vaccinationSchema = z
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

export const petSchema = z.object({ ...modelSchema.shape, ...partialPetSchema.shape }).strict();

export type Pet = z.infer<typeof petSchema>;

export const partialPetListSchema = partialModelListSchema
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

export type PetList = z.infer<typeof petListSchema>;
