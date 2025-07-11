import { numberSchema } from '@chubbyts/chubbyts-api/dist/model';
import { z } from 'zod';

export const embeddedSchema = z.object({}).strict().optional();

export const linkSchema = z
  .object({
    name: z.string().optional(),
    href: z.string(),
    templated: z.boolean().optional(),
    attributes: z
      .object({
        method: z.string(),
      })
      .optional(),
  })
  .strict();

export type Link = z.infer<typeof linkSchema>;

export const modelLinksSchema = z
  .object({
    read: linkSchema.optional(),
    update: linkSchema.optional(),
    delete: linkSchema.optional(),
  })
  .strict()
  .optional();

export const modelListLinksSchema = z
  .object({
    create: linkSchema.optional(),
  })
  .strict()
  .optional();

export const listRequestSchema = z
  .object({
    offset: numberSchema.default(0),
    limit: numberSchema.default(20),
  })
  .strict();

export const listSchema = z
  .object({
    offset: numberSchema,
    limit: numberSchema,
  })
  .strict();
