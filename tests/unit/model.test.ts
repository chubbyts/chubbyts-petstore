import { describe, expect, test } from '@jest/globals';
import { modelListSchema, modelSchema, partialModelListSchema } from '../../src/model';

describe('modelSchema', () => {
  test('valid', () => {
    const input = { id: 'test', createdAt: new Date(), updatedAt: new Date() };

    expect(modelSchema.parse(input)).toEqual(input);
  });

  test('invalid', () => {
    const input = { id: 'test', createdAt: new Date(), updatedAt: new Date(), unknown: 'unknown' };

    try {
      modelSchema.parse(input);
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

describe('partialModelListSchema', () => {
  test('valid', () => {
    const input = { offset: 0, limit: '20', filters: {}, sort: {} };

    expect(partialModelListSchema.parse(input)).toEqual({ ...input, limit: 20 });
  });

  test('invalid', () => {
    const input = { offset: 0, limit: 20, filters: { name: 'name' }, sort: {} };

    try {
      partialModelListSchema.parse(input);
      fail('Expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "unrecognized_keys",
            "keys": [
              "name"
            ],
            "path": [
              "filters"
            ],
            "message": "Unrecognized key(s) in object: 'name'"
          }
        ]]
      `);
    }
  });
});

describe('modelListSchema', () => {
  test('valid', () => {
    const input = {
      offset: 0,
      limit: '20',
      filters: {},
      sort: {},
      count: 1,
      items: [{ id: 'id', createdAt: new Date(), updatedAt: new Date() }],
    };

    expect(modelListSchema.parse(input)).toEqual({ ...input, limit: 20 });
  });

  test('invalid', () => {
    const input = {
      offset: 0,
      limit: '20',
      filters: { name: 'name' },
      sort: {},
      count: 1,
      items: [{ id: 'id', createdAt: new Date(), updatedAt: new Date() }],
    };

    try {
      modelListSchema.parse(input);
      fail('Expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "unrecognized_keys",
            "keys": [
              "name"
            ],
            "path": [
              "filters"
            ],
            "message": "Unrecognized key(s) in object: 'name'"
          }
        ]]
      `);
    }
  });
});
