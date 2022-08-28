import { describe, expect, test } from '@jest/globals';
import {
  petRequestSchema,
  petResponseSchema,
  petRequestListSchema,
  petListResponseSchema,
} from '../../../src/pet/model';

describe('petRequestSchema', () => {
  test('valid', () => {
    const input = {
      name: 'name',
      tag: 'tag',
      vaccinations: [{ name: 'name' }],
    };

    expect(petRequestSchema.parse(input)).toEqual(input);
  });

  test('invalid', () => {
    const input = {
      name: 'name',
      tag: 'tag',
      vaccinations: [{ name: 'name' }],
      unknown: 'unknown',
    };

    try {
      petRequestSchema.parse(input);
      fail('Expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
          [ZodError: [
            {
              "code": "unrecognized_keys",
              "keys": [
                "unknown"
              ],
              "path": [],
              "message": "Unrecognized key(s) in object: 'unknown'"
            }
          ]]
        `);
    }
  });
});

describe('petResponseSchema', () => {
  test('valid', () => {
    const input = {
      id: 'test',
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
      name: 'name',
      tag: 'tag',
      vaccinations: [{ name: 'name' }],
      _links: {
        read: { href: '/api/pet/1' },
        update: { href: '/api/pet/1' },
        delete: { href: '/api/pet/1' },
      },
    };

    expect(petResponseSchema.parse(input)).toEqual(input);
  });

  test('invalid', () => {
    const input = {
      id: 'test',
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
      name: 'name',
      tag: 'tag',
      vaccinations: [{ name: 'name' }],
      unknown: 'unknown',
    };

    try {
      petResponseSchema.parse(input);
      fail('Expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
          [ZodError: [
            {
              "code": "unrecognized_keys",
              "keys": [
                "unknown"
              ],
              "path": [],
              "message": "Unrecognized key(s) in object: 'unknown'"
            }
          ]]
        `);
    }
  });
});

describe('petRequestListSchema', () => {
  test('valid', () => {
    const input = { offset: 0, limit: '20', filters: { name: 'name' }, sort: { name: 'asc' } };

    expect(petRequestListSchema.parse(input)).toEqual({ ...input, limit: 20 });
  });

  test('invalid', () => {
    const input = { offset: 0, limit: '20', filters: { value: 'name' }, sort: { name: 'asc' } };

    try {
      petRequestListSchema.parse(input);
      fail('Expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
          [ZodError: [
            {
              "code": "unrecognized_keys",
              "keys": [
                "value"
              ],
              "path": [
                "filters"
              ],
              "message": "Unrecognized key(s) in object: 'value'"
            }
          ]]
        `);
    }
  });
});

describe('petListResponseSchema', () => {
  test('valid', () => {
    const input = {
      offset: 0,
      limit: 20,
      filters: { name: 'name' },
      sort: { name: 'asc' },
      items: [
        {
          id: 'test',
          createdAt: new Date().toJSON(),
          updatedAt: new Date().toJSON(),
          name: 'name',
          tag: 'tag',
          vaccinations: [{ name: 'name' }],
          _links: {
            read: { href: '/api/pet/1' },
            update: { href: '/api/pet/1' },
            delete: { href: '/api/pet/1' },
          },
        },
      ],
      count: 2,
      _links: {
        create: { href: '/api/pet' },
      },
    };

    expect(petListResponseSchema.parse(input)).toEqual({ ...input, limit: 20 });
  });

  test('invalid', () => {
    const input = {
      offset: 0,
      limit: 20,
      filters: { name: 'name' },
      sort: { name: 'asc' },
      items: [
        {
          id: 'test',
          createdAt: new Date().toJSON(),
          updatedAt: new Date().toJSON(),
          name: 'name',
          tag: 'tag',
          vaccinations: [{ name: 'name' }],
          unknown: 'unknown',
        },
      ],
      count: 2,
    };

    try {
      petRequestListSchema.parse(input);
      fail('Expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
          [ZodError: [
            {
              "code": "unrecognized_keys",
              "keys": [
                "items",
                "count"
              ],
              "path": [],
              "message": "Unrecognized key(s) in object: 'items', 'count'"
            }
          ]]
        `);
    }
  });
});
