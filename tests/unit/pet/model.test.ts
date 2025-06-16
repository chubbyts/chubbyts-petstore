import { describe, expect, test } from 'vitest';
import type {
  PetRequestListOpenApi,
  PetListResponse,
  PetRequestList,
  PetResponse,
  PetRequest,
  Pet,
  PetList,
} from '../../../src/pet/model.js';
import {
  petListSchema,
  petSchema,
  petRequestSchema,
  petResponseSchema,
  petRequestListSchema,
  petListResponseSchema,
  petRequestListOpenApiSchema,
} from '../../../src/pet/model.js';

const validPetRequest: PetRequest = {
  name: 'name',
  tag: 'tag',
  vaccinations: [{ name: 'name' }],
};

describe('petRequestSchema', () => {
  test('valid', () => {
    expect(petRequestSchema.parse(validPetRequest)).toEqual(validPetRequest);
  });

  test('invalid', () => {
    try {
      petRequestSchema.parse({ ...validPetRequest, unknown: 'unknown' });
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
              "message": "Unrecognized key(s) in object: 'unknown'"
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
  ...validPetRequest,
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
              "message": "Unrecognized key(s) in object: 'unknown'"
            }
          ]]
        `);
    }
  });
});

const validPetResponse: PetResponse = {
  id: 'test',
  createdAt: new Date('2023-04-12T09:12:12.763Z').toJSON(),
  updatedAt: new Date('2023-04-16T15:05:49.154Z').toJSON(),
  ...validPetRequest,
  _links: {
    read: { href: '/api/pet/1' },
    update: { href: '/api/pet/1' },
    delete: { href: '/api/pet/1' },
  },
};

describe('petResponseSchema', () => {
  test('valid', () => {
    expect(petResponseSchema.parse(validPetResponse)).toEqual(validPetResponse);
  });

  test('invalid', () => {
    try {
      petResponseSchema.parse({ ...validPetResponse, unknown: 'unknown' });
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
              "message": "Unrecognized key(s) in object: 'unknown'"
            }
          ]]
        `);
    }
  });
});

const validPetRequestList: PetRequestList = {
  offset: 0,
  limit: 20,
  filters: { name: 'name' },
  sort: { name: 'asc' },
};

describe('petRequestListSchema', () => {
  test('valid', () => {
    expect(petRequestListSchema.parse(validPetRequestList)).toEqual(validPetRequestList);
  });

  test('valid with inverse sorting', () => {
    expect(petRequestListSchema.parse({ ...validPetRequestList, sort: { name: 'desc' } })).toEqual({
      ...validPetRequestList,
      sort: { name: 'desc' },
    });
  });

  test('invalid', () => {
    try {
      petRequestListSchema.parse({ ...validPetRequestList, filters: { unknown: 'unknown' } });
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
            "message": "Unrecognized key(s) in object: 'unknown'"
          }
        ]]
      `);
    }
  });
});

export const validPetList: PetList = {
  ...validPetRequestList,
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
            "message": "Unrecognized key(s) in object: 'unknown'"
          }
        ]]
      `);
    }
  });
});

const validPetListResponseSchema: PetListResponse = {
  ...validPetRequestList,
  items: [validPetResponse],
  count: 2,
  _links: {
    create: { href: '/api/pet' },
  },
};

describe('petListResponseSchema', () => {
  test('valid', () => {
    expect(petListResponseSchema.parse(validPetListResponseSchema)).toEqual(validPetListResponseSchema);
  });

  test('invalid', () => {
    try {
      petListResponseSchema.parse({ ...validPetListResponseSchema, filters: { unknown: 'unknown' } });
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
            "message": "Unrecognized key(s) in object: 'unknown'"
          }
        ]]
      `);
    }
  });
});

const validPetRequestListOpenApiSchema: PetRequestListOpenApi = {
  offset: 0,
  limit: 20,
  'filters[name]': 'name',
  'sort[name]': 'asc',
};

describe('petRequestListOpenApiSchema', () => {
  test('valid', () => {
    expect(petRequestListOpenApiSchema.parse(validPetRequestListOpenApiSchema)).toEqual(
      validPetRequestListOpenApiSchema,
    );
  });

  test('valid inverse sorting', () => {
    expect(petRequestListOpenApiSchema.parse({ ...validPetRequestListOpenApiSchema, 'sort[name]': 'desc' })).toEqual({
      ...validPetRequestListOpenApiSchema,
      'sort[name]': 'desc',
    });
  });

  test('invalid', () => {
    try {
      petRequestListOpenApiSchema.parse({ ...validPetRequestListOpenApiSchema, 'filters[unknown]': 'unknown' });
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
            "message": "Unrecognized key(s) in object: 'filters[unknown]'"
          }
        ]]
      `);
    }
  });
});
