import { describe, expect, test } from '@jest/globals';
import type {
  PetRequestListOpenApi,
  PetListResponse,
  PetRequestList,
  PetResponse,
  PetRequest,
  Pet,
  PetList,
} from '../../../src/pet/model';
import {
  petListSchema,
  petSchema,
  petRequestSchema,
  petResponseSchema,
  petRequestListSchema,
  petListResponseSchema,
  petRequestListOpenApiSchema,
} from '../../../src/pet/model';

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

const validPet: Pet = {
  id: 'test',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...validPetRequest,
};

describe('petSchema', () => {
  test('valid', () => {
    expect(petSchema.parse(validPet)).toEqual(validPet);
  });

  test('invalid', () => {
    try {
      petSchema.parse({ ...validPet, unknown: 'unknown' });
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

const validPetResponseSchema: PetResponse = {
  id: 'test',
  createdAt: new Date().toJSON(),
  updatedAt: new Date().toJSON(),
  ...validPetRequest,
  _links: {
    read: { href: '/api/pet/1' },
    update: { href: '/api/pet/1' },
    delete: { href: '/api/pet/1' },
  },
};

describe('petResponseSchema', () => {
  test('valid', () => {
    expect(petResponseSchema.parse(validPetResponseSchema)).toEqual(validPetResponseSchema);
  });

  test('invalid', () => {
    try {
      petResponseSchema.parse({ ...validPetResponseSchema, unknown: 'unknown' });
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

const validPetRequestListSchema: PetRequestList = {
  offset: 0,
  limit: 20,
  filters: { name: 'name' },
  sort: { name: 'asc' },
};

describe('petRequestListSchema', () => {
  test('valid', () => {
    expect(petRequestListSchema.parse(validPetRequestListSchema)).toEqual(validPetRequestListSchema);
  });

  test('invalid', () => {
    try {
      petRequestListSchema.parse({ ...validPetRequestListSchema, filters: { unknown: 'unknown' } });
      fail('Expect fail');
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

const validPetListSchema: PetList = {
  ...validPetRequestListSchema,
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

describe('petListSchema', () => {
  test('valid', () => {
    expect(petListSchema.parse(validPetListSchema)).toEqual(validPetListSchema);
  });

  test('invalid', () => {
    try {
      petListSchema.parse({ ...validPetListSchema, filters: { unknown: 'unknown' } });
      fail('Expect fail');
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
  ...validPetRequestListSchema,
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

describe('petListResponseSchema', () => {
  test('valid', () => {
    expect(petListResponseSchema.parse(validPetListResponseSchema)).toEqual(validPetListResponseSchema);
  });

  test('invalid', () => {
    try {
      petListResponseSchema.parse({ ...validPetListResponseSchema, filters: { unknown: 'unknown' } });
      fail('Expect fail');
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

  test('invalid', () => {
    try {
      petRequestListOpenApiSchema.parse({ ...validPetRequestListOpenApiSchema, 'filters[unknown]': 'unknown' });
      fail('Expect fail');
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
