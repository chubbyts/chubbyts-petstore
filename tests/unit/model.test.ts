import { describe, expect, test } from '@jest/globals';
import { modelSchema, partialListSchema } from '../../src/model';

describe('modelSchema', () => {
  test('valid', async () => {
    const input = { id: 'test', createdAt: new Date(), updatedAt: new Date() };

    expect(modelSchema.parse(input)).toEqual(input);
  });

  test('invalid', async () => {
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

describe('partialListSchema', () => {
  test('valid', async () => {
    const input = { offset: 0, limit: '20', filters: {}, sort: {} };

    expect(partialListSchema.parse(input)).toEqual({ ...input, limit: 20 });
  });

  test('invalid', async () => {
    const input = { offset: 0, limit: 20, filters: { name: 'name' }, sort: {} };

    try {
      partialListSchema.parse(input);
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
