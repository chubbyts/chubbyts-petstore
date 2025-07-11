import { describe, expect, test } from 'vitest';
import { linkSchema, listRequestSchema, listSchema, modelLinksSchema, modelListLinksSchema } from '../../src/model.js';

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
      linkSchema.parse({ href: '/api/model', attributes: { method: 'POST' }, key: 'value' });
      throw new Error('Expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "unrecognized_keys",
            "keys": [
              "key"
            ],
            "path": [],
            "message": "Unrecognized key(s) in object: 'key'"
          }
        ]]
      `);
    }
  });
});

describe('modelLinksSchema', () => {
  test('valid', () => {
    expect(modelLinksSchema.parse({})).toEqual({});
    expect(
      modelLinksSchema.parse({
        read: { href: '/api/model/id' },
        update: { href: '/api/model/id' },
        delete: { href: '/api/model/id' },
      }),
    ).toEqual({
      read: { href: '/api/model/id' },
      update: { href: '/api/model/id' },
      delete: { href: '/api/model/id' },
    });
  });

  test('invalid', () => {
    try {
      modelLinksSchema.parse({ key: { href: '/api/model/id' } });
      throw new Error('Expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "unrecognized_keys",
            "keys": [
              "key"
            ],
            "path": [],
            "message": "Unrecognized key(s) in object: 'key'"
          }
        ]]
      `);
    }
  });
});

describe('modelListLinksSchema', () => {
  test('valid', () => {
    expect(modelListLinksSchema.parse({})).toEqual({});
    expect(modelListLinksSchema.parse({ create: { href: '/api/model' } })).toEqual({ create: { href: '/api/model' } });
  });

  test('invalid', () => {
    try {
      modelListLinksSchema.parse({ key: { href: '/api/model' } });
      throw new Error('Expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "unrecognized_keys",
            "keys": [
              "key"
            ],
            "path": [],
            "message": "Unrecognized key(s) in object: 'key'"
          }
        ]]
      `);
    }
  });
});

describe('listRequestSchema', () => {
  test('valid', () => {
    expect(listRequestSchema.parse({})).toEqual({ offset: 0, limit: 20 });
    expect(listRequestSchema.parse({ offset: 1, limit: 10 })).toEqual({ offset: 1, limit: 10 });
  });

  test('invalid', () => {
    try {
      listRequestSchema.parse({ key: 'unknown' });
      throw new Error('Expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "unrecognized_keys",
            "keys": [
              "key"
            ],
            "path": [],
            "message": "Unrecognized key(s) in object: 'key'"
          }
        ]]
      `);
    }
  });
});

describe('listSchema', () => {
  test('valid', () => {
    expect(listSchema.parse({ offset: 1, limit: 10 })).toEqual({ offset: 1, limit: 10 });
  });

  test('invalid', () => {
    try {
      listSchema.parse({ key: 'unknown' });
      throw new Error('Expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "invalid_type",
            "expected": "number",
            "received": "nan",
            "path": [
              "offset"
            ],
            "message": "Expected number, received nan"
          },
          {
            "code": "invalid_type",
            "expected": "number",
            "received": "nan",
            "path": [
              "limit"
            ],
            "message": "Expected number, received nan"
          },
          {
            "code": "unrecognized_keys",
            "keys": [
              "key"
            ],
            "path": [],
            "message": "Unrecognized key(s) in object: 'key'"
          }
        ]]
      `);
    }
  });
});
