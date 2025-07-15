import { describe, expect, test } from 'vitest';
import type {
  EnrichedPet,
  EnrichedPetList,
  InputPet,
  InputPetList,
  InputPetListOpenApi,
  Pet,
  PetList,
} from '../../../src/pet/model.js';
import {
  petListSchema,
  petSchema,
  inputPetSchema,
  enrichedPetSchema,
  inputPetListSchema,
  enrichedPetListSchema,
  inputPetListOpenApiSchema,
} from '../../../src/pet/model.js';

const validInputPet: InputPet = {
  name: 'name',
  tag: 'tag',
  vaccinations: [{ name: 'name' }],
};

describe('model', () => {
  test('valid', () => {
    expect(inputPetSchema.parse(validInputPet)).toEqual(validInputPet);
  });

  test('invalid', () => {
    try {
      inputPetSchema.parse({ ...validInputPet, unknown: 'unknown' });
      throw new Error('Expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "unrecognized_keys",
            "keys": [
              "unknown"
            ],
            "path": [],
            "message": "Unrecognized key: \\"unknown\\""
          }
        ]]
      `);
    }
  });
});

export const validPet: Pet = {
  id: 'test',
  createdAt: new Date('2023-04-12T09:12:12.763Z'),
  updatedAt: new Date('2023-04-16T15:05:49.154Z'),
  ...validInputPet,
};

describe('petSchema', () => {
  test('valid', () => {
    expect(petSchema.parse(validPet)).toEqual(validPet);
  });

  test('invalid', () => {
    try {
      petSchema.parse({ ...validPet, unknown: 'unknown' });
      throw new Error('Expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "unrecognized_keys",
            "keys": [
              "unknown"
            ],
            "path": [],
            "message": "Unrecognized key: \\"unknown\\""
          }
        ]]
      `);
    }
  });
});

const validEnrichedPet: EnrichedPet = {
  id: 'test',
  createdAt: new Date('2023-04-12T09:12:12.763Z'),
  updatedAt: new Date('2023-04-16T15:05:49.154Z'),
  ...validInputPet,
  _links: {
    read: { href: '/api/pet/1' },
    update: { href: '/api/pet/1' },
    delete: { href: '/api/pet/1' },
  },
};

describe('enrichedPetSchema', () => {
  test('valid', () => {
    expect(enrichedPetSchema.parse(validEnrichedPet)).toEqual(validEnrichedPet);
  });

  test('invalid', () => {
    try {
      enrichedPetSchema.parse({ ...validEnrichedPet, unknown: 'unknown' });
      throw new Error('Expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "unrecognized_keys",
            "keys": [
              "unknown"
            ],
            "path": [],
            "message": "Unrecognized key: \\"unknown\\""
          }
        ]]
      `);
    }
  });
});

const validInputPetList: InputPetList = {
  offset: 0,
  limit: 20,
  filters: { name: 'name' },
  sort: { name: 'asc' },
};

describe('inputPetListSchema', () => {
  test('valid', () => {
    expect(inputPetListSchema.parse(validInputPetList)).toEqual(validInputPetList);
  });

  test('valid with inverse sorting', () => {
    expect(inputPetListSchema.parse({ ...validInputPetList, sort: { name: 'desc' } })).toEqual({
      ...validInputPetList,
      sort: { name: 'desc' },
    });
  });

  test('invalid', () => {
    try {
      inputPetListSchema.parse({ ...validInputPetList, filters: { unknown: 'unknown' } });
      throw new Error('Expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
      [ZodError: [
        {
          "code": "unrecognized_keys",
          "keys": [
            "unknown"
          ],
          "path": [
            "filters"
          ],
          "message": "Unrecognized key: \\"unknown\\""
        }
      ]]
    `);
    }
  });
});

export const validPetList: PetList = {
  ...validInputPetList,
  items: [validPet],
  count: 2,
};

describe('petListSchema', () => {
  test('valid', () => {
    expect(petListSchema.parse(validPetList)).toEqual(validPetList);
  });

  test('invalid', () => {
    try {
      petListSchema.parse({ ...validPetList, filters: { unknown: 'unknown' } });
      throw new Error('Expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "unrecognized_keys",
            "keys": [
              "unknown"
            ],
            "path": [
              "filters"
            ],
            "message": "Unrecognized key: \\"unknown\\""
          }
        ]]
      `);
    }
  });
});

const validEnrichedPetListSchema: EnrichedPetList = {
  ...validInputPetList,
  items: [validEnrichedPet],
  count: 2,
  _links: {
    create: { href: '/api/pet' },
  },
};

describe('enrichedPetListSchema', () => {
  test('valid', () => {
    expect(enrichedPetListSchema.parse(validEnrichedPetListSchema)).toEqual(validEnrichedPetListSchema);
  });

  test('invalid', () => {
    try {
      enrichedPetListSchema.parse({ ...validEnrichedPetListSchema, filters: { unknown: 'unknown' } });
      throw new Error('Expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "unrecognized_keys",
            "keys": [
              "unknown"
            ],
            "path": [
              "filters"
            ],
            "message": "Unrecognized key: \\"unknown\\""
          }
        ]]
      `);
    }
  });
});

const validInputPetListOpenApiSchema: InputPetListOpenApi = {
  offset: 0,
  limit: 20,
  'filters[name]': 'name',
  'sort[name]': 'asc',
};

describe('inputPetListOpenApiSchema', () => {
  test('valid', () => {
    expect(inputPetListOpenApiSchema.parse(validInputPetListOpenApiSchema)).toEqual(validInputPetListOpenApiSchema);
  });

  test('valid inverse sorting', () => {
    expect(inputPetListOpenApiSchema.parse({ ...validInputPetListOpenApiSchema, 'sort[name]': 'desc' })).toEqual({
      ...validInputPetListOpenApiSchema,
      'sort[name]': 'desc',
    });
  });

  test('invalid', () => {
    try {
      inputPetListOpenApiSchema.parse({ ...validInputPetListOpenApiSchema, 'filters[unknown]': 'unknown' });
      throw new Error('Expect fail');
    } catch (e) {
      expect(e).toMatchInlineSnapshot(`
        [ZodError: [
          {
            "code": "unrecognized_keys",
            "keys": [
              "filters[unknown]"
            ],
            "path": [],
            "message": "Unrecognized key: \\"filters[unknown]\\""
          }
        ]]
      `);
    }
  });
});
