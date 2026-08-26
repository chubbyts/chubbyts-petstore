import { describe, expect, test } from 'vitest';
import { z } from 'zod';
import { createFlatQuerySchema } from '../../src/openapi.js';

const createSchema = () =>
  createFlatQuerySchema(
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

describe('createFlatQuerySchema', () => {
  test('flattens nested objects into bracket keys', () => {
    const schema = createSchema();

    expect(Object.keys(schema.shape)).toEqual(['offset', 'filters[name]', 'sort[name]']);
    expect(schema.parse({})).toEqual({ offset: 0 });
    expect(schema.parse({ offset: '5', 'filters[name]': 'x', 'sort[name]': 'desc' })).toEqual({
      offset: 5,
      'filters[name]': 'x',
      'sort[name]': 'desc',
    });
  });

  test('keeps nested validation', () => {
    const schema = createSchema();

    expect(() => schema.parse({ 'filters[name]': '' })).toThrow(/Too small/);
    expect(() => schema.parse({ 'sort[name]': 'up' })).toThrow(/Invalid option/);
  });

  test('converts literal unions to enums', () => {
    const schema = createSchema();

    expect(schema.shape['sort[name]']).toBeInstanceOf(z.ZodOptional);
    expect(schema.shape['sort[name]'].def.innerType).toBeInstanceOf(z.ZodEnum);
    expect(schema.shape['sort[name]'].def.innerType.options).toEqual(['asc', 'desc']);
  });

  test('keeps top level and mixed unions untouched', () => {
    const mode = z.union([z.literal('a'), z.literal('b')]);
    const mixed = z.union([z.literal('a'), z.string()]);

    const schema = createFlatQuerySchema(z.object({ mode, filters: z.object({ mixed: mixed.optional() }) }));

    expect(schema.shape.mode).toBe(mode);
    expect(schema.shape['filters[mixed]']).toBeInstanceOf(z.ZodOptional);
    expect(schema.shape['filters[mixed]'].def.innerType).toBeInstanceOf(z.ZodUnion);
    expect(schema.parse({ mode: 'a', 'filters[mixed]': 'anything' })).toEqual({
      mode: 'a',
      'filters[mixed]': 'anything',
    });
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
    expect(() => createSchema().parse({ 'filters[unknown]': 'x' })).toThrow(/Unrecognized key/);
  });
});
