import { z } from 'zod';

const unwrap = (schema: z.ZodType): z.ZodType => {
  if (schema instanceof z.ZodDefault || schema instanceof z.ZodOptional) {
    return unwrap(schema.def.innerType as z.ZodType);
  }

  return schema;
};

const isLiteralUnion = (schema: z.ZodType): schema is z.ZodUnion<Array<z.ZodLiteral<string>>> =>
  schema instanceof z.ZodUnion && schema.options.every((option) => option instanceof z.ZodLiteral);

// a union of string literals renders as an "anyOf" in openapi, an enum is the readable equivalent
const normalize = (schema: z.ZodType): z.ZodType =>
  isLiteralUnion(schema) ? z.enum(schema.options.flatMap((option) => [...option.values])) : schema;

const flattenEntries = (schema: z.ZodObject, prefix?: string): Array<[string, z.ZodType]> =>
  Object.entries(schema.shape).flatMap(([key, value]): Array<[string, z.ZodType]> => {
    const name = prefix ? `${prefix}[${key}]` : key;
    const inner = unwrap(value);

    if (inner instanceof z.ZodObject) {
      return flattenEntries(inner, name);
    }

    return [[name, prefix ? normalize(inner).optional() : value]];
  });

/**
 * OpenAPI cannot express qs-style nested query parameters (`?filters[address][city]=x`), so the nested list input
 * schema gets flattened: every nested object property, at any depth, becomes an optional top-level
 * `parent[child][grandchild]` property.
 */
export const createFlatQuerySchema = (schema: z.ZodObject): z.ZodObject =>
  z.object(Object.fromEntries(flattenEntries(schema))).strict();
