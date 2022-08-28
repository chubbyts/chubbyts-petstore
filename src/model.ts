import { z } from 'zod';

export const numberSchema = z.union([
  z
    .string()
    .refine((number) => !Number.isNaN(parseInt(number, 10)))
    .transform((number) => parseInt(number, 10)),
  z.number(),
]);

export const linkSchema = z
  .object({
    href: z.string(),
    attributes: z
      .object({
        method: z.string(),
      })
      .optional(),
  })
  .strict();

export const modelSchema = z
  .object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().optional(),
  })
  .strict();

export const modelResponseSchema = z
  .object({
    id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string().optional(),
  })
  .strict();

export const listRequestSchema = z
  .object({
    offset: numberSchema.default(0),
    limit: numberSchema.default(20),
    filters: z.object({}).strict().optional(),
    sort: z.object({}).strict().optional(),
  })
  .strict();
