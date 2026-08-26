import { describe, expect, test } from 'vitest';
import { z } from 'zod';
import { createFlatQuerySchema } from '../../src/openapi.js';

describe('createFlatQuerySchema', () => {
  const schema = createFlatQuerySchema(
    z
      .object({
        offset: z.coerce.number().default(0),
        filters: z
          .object({ name: z.string().min(1).optional() })
          .strict()
          .default({}),
        sort: z
          .object({ name: z.union([z.literal('asc'), z.literal('desc')]).optional() })
          .strict()
          .optional(),
      })
      .strict(),
  );

  test('flattens nested objects into bracket keys', () => {
    expect(Object.keys(schema.shape)).toEqual(['offset', 'filters[name]', 'sort[name]']);
    expect(schema.parse({})).toEqual({ offset: 0 });
    expect(schema.parse({ offset: '5', 'filters[name]': 'x', 'sort[name]': 'desc' })).toEqual({
      offset: 5,
      'filters[name]': 'x',
      'sort[name]': 'desc',
    });
  });

  test('keeps nested validation', () => {
    expect(() => schema.parse({ 'filters[name]': '' })).toThrow(/Too small/);
    expect(() => schema.parse({ 'sort[name]': 'up' })).toThrow(/Invalid option/);
  });

  test('converts literal unions to enums', () => {
    expect(schema.shape['sort[name]'].def.innerType).toBeInstanceOf(z.ZodEnum);
  });

  test('flattens deeper nesting', () => {
    const deep = createFlatQuerySchema(
      z.object({
        filters: z
          .object({
            name: z.string().optional(),
            address: z
              .object({ city: z.string().optional(), geo: z.object({ lat: z.coerce.number() }).optional() })
              .optional(),
          })
          .default({}),
      }),
    );

    expect(Object.keys(deep.shape)).toEqual(['filters[name]', 'filters[address][city]', 'filters[address][geo][lat]']);
    expect(deep.parse({ 'filters[address][geo][lat]': '1.5' })).toEqual({ 'filters[address][geo][lat]': 1.5 });
  });

  test('stays strict', () => {
    expect(() => schema.parse({ 'filters[unknown]': 'x' })).toThrow(/Unrecognized key/);
  });
});
