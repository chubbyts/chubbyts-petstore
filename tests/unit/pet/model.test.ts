import { describe, expect, test } from '@jest/globals';
import { partialPetSchema, petSchema, partialPetListSchema, petListSchema } from '../../../src/pet/model';

describe('model', () => {
  describe('partialPetSchema', () => {
    test('valid', async () => {
      const input = {
        name: 'name',
        tag: 'tag',
        vaccinations: [{ name: 'name' }],
      };

      expect(partialPetSchema.parse(input)).toEqual(input);
    });

    test('invalid', async () => {
      const input = {
        name: 'name',
        tag: 'tag',
        vaccinations: [{ name: 'name' }],
        unknown: 'unknown',
      };

      try {
        partialPetSchema.parse(input);
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

  describe('petSchema', () => {
    test('valid', async () => {
      const input = {
        id: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'name',
        tag: 'tag',
        vaccinations: [{ name: 'name' }],
      };

      expect(petSchema.parse(input)).toEqual(input);
    });

    test('invalid', async () => {
      const input = {
        id: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'name',
        tag: 'tag',
        vaccinations: [{ name: 'name' }],
        unknown: 'unknown',
      };

      try {
        petSchema.parse(input);
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

  describe('partialPetListSchema', () => {
    test('valid', async () => {
      const input = { offset: 0, limit: '20', filters: { name: 'name' }, sort: { name: 'asc' } };

      expect(partialPetListSchema.parse(input)).toEqual({ ...input, limit: 20 });
    });

    test('invalid', async () => {
      const input = { offset: 0, limit: '20', filters: { value: 'name' }, sort: { name: 'asc' } };

      try {
        partialPetListSchema.parse(input);
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

  describe('petListSchema', () => {
    test('valid', async () => {
      const input = {
        offset: 0,
        limit: '20',
        filters: { name: 'name' },
        sort: { name: 'asc' },
        items: [
          {
            id: 'test',
            createdAt: new Date(),
            updatedAt: new Date(),
            name: 'name',
            tag: 'tag',
            vaccinations: [{ name: 'name' }],
          },
        ],
        count: 2,
      };

      expect(petListSchema.parse(input)).toEqual({ ...input, limit: 20 });
    });

    test('invalid', async () => {
      const input = {
        offset: 0,
        limit: '20',
        filters: { name: 'name' },
        sort: { name: 'asc' },
        items: [
          {
            id: 'test',
            createdAt: new Date(),
            updatedAt: new Date(),
            name: 'name',
            tag: 'tag',
            vaccinations: [{ name: 'name' }],
            unknown: 'unknown',
          },
        ],
        count: 2,
      };

      try {
        partialPetListSchema.parse(input);
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
});
