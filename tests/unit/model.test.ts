import { describe, expect, test } from '@jest/globals';
import { numberSchema, modelSchema, partialListSchema, linkSchema, modelResponseSchema } from '../../src/model';

describe('numberSchema', () => {
  test('valid', () => {
    expect(numberSchema.parse(10)).toEqual(10);
    expect(numberSchema.parse('10')).toEqual(10);
  });

  test('invalid', () => {
    try {
      numberSchema.parse('test');
      fail('Expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "custom",
            "message": "Invalid input",
            "path": []
          }
        ]]
      `);
    }
  });
});

describe('linkSchema', () => {
  test('valid', () => {
    expect(linkSchema.parse({ href: '/api/model' })).toEqual({ href: '/api/model' });
    expect(linkSchema.parse({ href: '/api/model', attributes: { method: 'POST' } })).toEqual({
      href: '/api/model',
      attributes: { method: 'POST' },
    });
  });

  test('invalid', () => {
    try {
      numberSchema.parse({ href: '/api/model', attributes: { method: 'POST' }, key: 'value' });
      fail('Expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "invalid_union",
            "unionErrors": [
              {
                "issues": [
                  {
                    "code": "invalid_type",
                    "expected": "string",
                    "received": "object",
                    "path": [],
                    "message": "Expected string, received object"
                  }
                ],
                "name": "ZodError"
              },
              {
                "issues": [
                  {
                    "code": "invalid_type",
                    "expected": "number",
                    "received": "object",
                    "path": [],
                    "message": "Expected number, received object"
                  }
                ],
                "name": "ZodError"
              }
            ],
            "path": [],
            "message": "Invalid input"
          }
        ]]
      `);
    }
  });
});

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

describe('modelResponseSchema', () => {
  test('valid', () => {
    const input = { id: 'test', createdAt: new Date().toJSON(), updatedAt: new Date().toJSON() };

    expect(modelResponseSchema.parse(input)).toEqual(input);
  });

  test('invalid', () => {
    const input = { id: 'test', createdAt: new Date().toJSON(), updatedAt: new Date().toJSON(), unknown: 'unknown' };

    try {
      modelResponseSchema.parse(input);
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
  test('valid', () => {
    const input = { offset: 0, limit: '20', filters: {}, sort: {} };

    expect(partialListSchema.parse(input)).toEqual({ ...input, limit: 20 });
  });

  test('invalid', () => {
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
