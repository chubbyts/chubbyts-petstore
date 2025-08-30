import { describe, expect, test } from 'vitest';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { useObjectMock } from '@chubbyts/chubbyts-function-mock/dist/object-mock';
import type {
  PgDeleteBase,
  PgInsertBase,
  PgInsertBuilder,
  PgQueryResultHKT,
  PgSelectBase,
  PgSelectBuilder,
  PgTransaction,
  PgUpdateBase,
  PgUpdateBuilder,
} from 'drizzle-orm/pg-core';
import type { SQL } from 'drizzle-orm';
import { count } from 'drizzle-orm';
import type { PgRelationalQuery, RelationalQueryBuilder } from 'drizzle-orm/pg-core/query-builders/query';
import type { PetQueryResult } from '../../../src/pet/repository.js';
import {
  createFindPetById,
  createPersistPet,
  createRemovePet,
  createResolvePetList,
} from '../../../src/pet/repository.js';
import * as schema from '../../../src/schema.js';
import type { Schema, TablesWithRelations } from '../../../src/repository.js';
import type { Pet } from '../../../src/pet/model.js';

describe('repository', () => {
  describe('createResolvePetList', () => {
    test('minimal', async () => {
      const petResult: PetQueryResult = {
        id: 'petId',
        createdAt: new Date('2025-08-30T12:08:45.385Z'),
        updatedAt: null,
        name: 'name',
        tag: null,
        vaccinations: [],
      };

      const [pgSelectBase, pgSelectBaseMocks] = useObjectMock<PgSelectBase<'pets', { count: SQL<number> }, 'partial'>>([
        {
          name: 'where',
          callback: () => pgSelectBase,
        },
        { name: 'execute', parameters: [], return: Promise.resolve([{ count: 1 }]) },
      ]);

      const [pgSelectBuilder, pgSelectBuilderMocks] = useObjectMock<PgSelectBuilder<{ count: SQL<number> }>>([
        {
          name: 'from',
          parameters: [schema.pets],
          return: pgSelectBase,
        },
      ]);

      const [pgRelationalQuery, pgRelationalQueryMocks] = useObjectMock<PgRelationalQuery<Array<PetQueryResult>>>([
        { name: 'execute', parameters: [], return: Promise.resolve([petResult]) },
      ]);

      const [pets, petsMock] = useObjectMock<RelationalQueryBuilder<TablesWithRelations, TablesWithRelations['pets']>>([
        {
          name: 'findMany',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: () => pgRelationalQuery as any,
        },
      ]);

      const [petsVaccinations, petsVaccinationsMock] = useObjectMock<
        RelationalQueryBuilder<TablesWithRelations, TablesWithRelations['petsVaccinations']>
      >([]);

      const [db, dbMocks] = useObjectMock<NodePgDatabase<Schema>>([
        {
          name: 'select',
          parameters: [{ count: count(schema.pets.id) }],
          return: pgSelectBuilder,
        },
        { name: 'query', value: { pets, petsVaccinations } },
      ]);

      const resolvePetList = createResolvePetList(db);

      expect(await resolvePetList({ offset: 0, limit: 20, filters: { name: 'name' }, sort: { name: 'asc' } }))
        .toMatchInlineSnapshot(`
          {
            "count": 1,
            "filters": {
              "name": "name",
            },
            "items": [
              {
                "createdAt": 2025-08-30T12:08:45.385Z,
                "id": "petId",
                "name": "name",
                "tag": undefined,
                "updatedAt": undefined,
                "vaccinations": [],
              },
            ],
            "limit": 20,
            "offset": 0,
            "sort": {
              "name": "asc",
            },
          }
        `);

      expect(pgSelectBaseMocks.length).toBe(0);
      expect(pgSelectBuilderMocks.length).toBe(0);
      expect(pgRelationalQueryMocks.length).toBe(0);
      expect(petsMock.length).toBe(0);
      expect(petsVaccinationsMock.length).toBe(0);
      expect(dbMocks.length).toBe(0);
    });

    test('maximal', async () => {
      const petResult: PetQueryResult = {
        id: 'petId',
        createdAt: new Date('2025-08-30T12:08:45.385Z'),
        updatedAt: new Date('2025-08-30T12:08:45.385Z'),
        name: 'name',
        tag: 'tag',
        vaccinations: [
          {
            petId: 'petId',
            name: 'name',
          },
        ],
      };

      const [pgSelectBase, pgSelectBaseMocks] = useObjectMock<PgSelectBase<'pets', { count: SQL<number> }, 'partial'>>([
        {
          name: 'where',
          callback: () => pgSelectBase,
        },
        { name: 'execute', parameters: [], return: Promise.resolve([{ count: 1 }]) },
      ]);

      const [pgSelectBuilder, pgSelectBuilderMocks] = useObjectMock<PgSelectBuilder<{ count: SQL<number> }>>([
        {
          name: 'from',
          parameters: [schema.pets],
          return: pgSelectBase,
        },
      ]);

      const [pgRelationalQuery, pgRelationalQueryMocks] = useObjectMock<PgRelationalQuery<Array<PetQueryResult>>>([
        { name: 'execute', parameters: [], return: Promise.resolve([petResult]) },
      ]);

      const [pets, petsMock] = useObjectMock<RelationalQueryBuilder<TablesWithRelations, TablesWithRelations['pets']>>([
        {
          name: 'findMany',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: () => pgRelationalQuery as any,
        },
      ]);

      const [petsVaccinations, petsVaccinationsMock] = useObjectMock<
        RelationalQueryBuilder<TablesWithRelations, TablesWithRelations['petsVaccinations']>
      >([]);

      const [db, dbMocks] = useObjectMock<NodePgDatabase<Schema>>([
        {
          name: 'select',
          parameters: [{ count: count(schema.pets.id) }],
          return: pgSelectBuilder,
        },
        { name: 'query', value: { pets, petsVaccinations } },
      ]);

      const resolvePetList = createResolvePetList(db);

      expect(await resolvePetList({ offset: 0, limit: 20, filters: { name: 'name' }, sort: { name: 'desc' } }))
        .toMatchInlineSnapshot(`
          {
            "count": 1,
            "filters": {
              "name": "name",
            },
            "items": [
              {
                "createdAt": 2025-08-30T12:08:45.385Z,
                "id": "petId",
                "name": "name",
                "tag": "tag",
                "updatedAt": 2025-08-30T12:08:45.385Z,
                "vaccinations": [
                  {
                    "name": "name",
                  },
                ],
              },
            ],
            "limit": 20,
            "offset": 0,
            "sort": {
              "name": "desc",
            },
          }
        `);

      expect(pgSelectBaseMocks.length).toBe(0);
      expect(pgSelectBuilderMocks.length).toBe(0);
      expect(pgRelationalQueryMocks.length).toBe(0);
      expect(petsMock.length).toBe(0);
      expect(petsVaccinationsMock.length).toBe(0);
      expect(dbMocks.length).toBe(0);
    });
  });

  describe('createFindPetById', () => {
    test('not found', async () => {
      const [pgRelationalQuery, pgRelationalQueryMocks] = useObjectMock<PgRelationalQuery<PetQueryResult | null>>([
        { name: 'execute', parameters: [], return: Promise.resolve(null) },
      ]);

      const [pets, petsMock] = useObjectMock<RelationalQueryBuilder<TablesWithRelations, TablesWithRelations['pets']>>([
        {
          name: 'findFirst',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: () => pgRelationalQuery as any,
        },
      ]);

      const [petsVaccinations, petsVaccinationsMock] = useObjectMock<
        RelationalQueryBuilder<TablesWithRelations, TablesWithRelations['petsVaccinations']>
      >([]);

      const [db, dbMocks] = useObjectMock<NodePgDatabase<Schema>>([
        { name: 'query', value: { pets, petsVaccinations } },
      ]);

      const findPetById = createFindPetById(db);

      expect(await findPetById('id')).toBeUndefined();

      expect(pgRelationalQueryMocks.length).toBe(0);
      expect(petsMock.length).toBe(0);
      expect(petsVaccinationsMock.length).toBe(0);
      expect(dbMocks.length).toBe(0);
    });

    test('found', async () => {
      const petResult: PetQueryResult = {
        id: 'petId',
        createdAt: new Date('2025-08-30T12:08:45.385Z'),
        updatedAt: new Date('2025-08-30T12:08:45.385Z'),
        name: 'name',
        tag: 'tag',
        vaccinations: [
          {
            petId: 'petId',
            name: 'name',
          },
        ],
      };

      const [pgRelationalQuery, pgRelationalQueryMocks] = useObjectMock<PgRelationalQuery<PetQueryResult | null>>([
        { name: 'execute', parameters: [], return: Promise.resolve(petResult) },
      ]);

      const [pets, petsMock] = useObjectMock<RelationalQueryBuilder<TablesWithRelations, TablesWithRelations['pets']>>([
        {
          name: 'findFirst',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: () => pgRelationalQuery as any,
        },
      ]);

      const [petsVaccinations, petsVaccinationsMock] = useObjectMock<
        RelationalQueryBuilder<TablesWithRelations, TablesWithRelations['petsVaccinations']>
      >([]);

      const [db, dbMocks] = useObjectMock<NodePgDatabase<Schema>>([
        { name: 'query', value: { pets, petsVaccinations } },
      ]);

      const findPetById = createFindPetById(db);

      expect(await findPetById('id')).toMatchInlineSnapshot(`
        {
          "createdAt": 2025-08-30T12:08:45.385Z,
          "id": "petId",
          "name": "name",
          "tag": "tag",
          "updatedAt": 2025-08-30T12:08:45.385Z,
          "vaccinations": [
            {
              "name": "name",
            },
          ],
        }
      `);

      expect(pgRelationalQueryMocks.length).toBe(0);
      expect(petsMock.length).toBe(0);
      expect(petsVaccinationsMock.length).toBe(0);
      expect(dbMocks.length).toBe(0);
    });
  });

  describe('createPersistPet', () => {
    test('insert', async () => {
      const pet: Pet = {
        id: 'petId',
        createdAt: new Date('2025-08-30T12:08:45.385Z'),
        name: 'name',
        vaccinations: [
          {
            name: 'name',
          },
        ],
      };

      const [pgSelectBase, pgSelectBaseMocks] = useObjectMock<PgSelectBase<'pets', { count: SQL<number> }, 'partial'>>([
        {
          name: 'where',
          callback: () => pgSelectBase,
        },
        { name: 'execute', parameters: [], return: Promise.resolve([{ count: 0 }]) },
      ]);

      const [pgSelectBuilder, pgSelectBuilderMocks] = useObjectMock<PgSelectBuilder<{ count: SQL<number> }>>([
        {
          name: 'from',
          parameters: [schema.pets],
          return: pgSelectBase,
        },
      ]);

      const [petsPgInsertBase, petsPgInsertBaseMocks] = useObjectMock<
        PgInsertBase<typeof schema.pets, PgQueryResultHKT, undefined, undefined>
      >([{ name: 'execute', parameters: [], return: Promise.resolve(undefined) }]);

      const [petsPgInsertBuilder, petsPgInsertBuilderMocks] = useObjectMock<
        PgInsertBuilder<typeof schema.pets, PgQueryResultHKT>
      >([
        {
          name: 'values',
          parameters: [
            [
              {
                id: pet.id,
                createdAt: pet.createdAt,
                updatedAt: pet.updatedAt ?? null,
                name: pet.name,
                tag: pet.tag ?? null,
              },
            ],
          ],
          return: petsPgInsertBase,
        },
      ]);

      const [petsVaccinationsPgInsertBase, petsVaccinationsPgInsertBaseMocks] = useObjectMock<
        PgInsertBase<typeof schema.petsVaccinations, PgQueryResultHKT, undefined, undefined>
      >([{ name: 'execute', parameters: [], return: Promise.resolve(undefined) }]);

      const [petsVaccinationsPgInsertBuilder, petsVaccinationsPgInsertBuilderMocks] = useObjectMock<
        PgInsertBuilder<typeof schema.petsVaccinations, PgQueryResultHKT>
      >([
        {
          name: 'values',
          parameters: [
            pet.vaccinations?.map((vaccination) => ({
              petId: pet.id,
              name: vaccination.name,
            })) ?? [],
          ],
          return: petsVaccinationsPgInsertBase,
        },
      ]);

      const [transaction, transactionMocks] = useObjectMock<
        PgTransaction<PgQueryResultHKT, Schema, TablesWithRelations>
      >([
        {
          name: 'select',
          parameters: [{ count: count(schema.pets.id) }],
          return: pgSelectBuilder,
        },
        {
          name: 'insert',
          parameters: [schema.pets],
          return: petsPgInsertBuilder,
        },
        {
          name: 'insert',
          parameters: [schema.petsVaccinations],
          return: petsVaccinationsPgInsertBuilder,
        },
      ]);

      const [db, dbMocks] = useObjectMock<NodePgDatabase<Schema>>([
        {
          name: 'transaction',
          callback: (callback) => callback(transaction),
        },
      ]);

      const persistPet = createPersistPet(db);

      expect(await persistPet(pet)).toMatchInlineSnapshot(`
        {
          "createdAt": 2025-08-30T12:08:45.385Z,
          "id": "petId",
          "name": "name",
          "vaccinations": [
            {
              "name": "name",
            },
          ],
        }
      `);

      expect(pgSelectBaseMocks.length).toBe(0);
      expect(pgSelectBuilderMocks.length).toBe(0);
      expect(petsPgInsertBaseMocks.length).toBe(0);
      expect(petsPgInsertBuilderMocks.length).toBe(0);
      expect(petsVaccinationsPgInsertBaseMocks.length).toBe(0);
      expect(petsVaccinationsPgInsertBuilderMocks.length).toBe(0);
      expect(transactionMocks.length).toBe(0);
      expect(dbMocks.length).toBe(0);
    });

    test('update', async () => {
      const pet: Pet = {
        id: 'petId',
        createdAt: new Date('2025-08-30T12:08:45.385Z'),
        updatedAt: new Date('2025-08-30T12:08:45.385Z'),
        name: 'name',
        tag: 'tag',
        vaccinations: [
          {
            name: 'name',
          },
        ],
      };

      const [pgSelectBase, pgSelectBaseMocks] = useObjectMock<PgSelectBase<'pets', { count: SQL<number> }, 'partial'>>([
        {
          name: 'where',
          callback: () => pgSelectBase,
        },
        { name: 'execute', parameters: [], return: Promise.resolve([{ count: 1 }]) },
      ]);

      const [pgSelectBuilder, pgSelectBuilderMocks] = useObjectMock<PgSelectBuilder<{ count: SQL<number> }>>([
        {
          name: 'from',
          parameters: [schema.pets],
          return: pgSelectBase,
        },
      ]);

      const [petsVaccinationsPgDeleteBase, petsVaccinationsPgDeleteBaseMocks] = useObjectMock<
        PgDeleteBase<typeof schema.petsVaccinations, PgQueryResultHKT>
      >([
        {
          name: 'where',
          callback: () => petsVaccinationsPgDeleteBase,
        },
        { name: 'execute', parameters: [], return: Promise.resolve() },
      ]);

      const [petsPgUpdateBase, petsPgUpdateBaseMocks] = useObjectMock<
        PgUpdateBase<typeof schema.pets, PgQueryResultHKT, undefined, undefined>
      >([
        {
          name: 'where',
          callback: () => petsPgUpdateBase,
        },

        { name: 'execute', parameters: [], return: Promise.resolve(undefined) },
      ]);

      const [petsPgUpdateBuilder, petsPgUpdateBuilderMocks] = useObjectMock<
        PgUpdateBuilder<typeof schema.pets, PgQueryResultHKT>
      >([
        {
          name: 'set',
          parameters: [
            {
              id: pet.id,
              createdAt: pet.createdAt,
              updatedAt: pet.updatedAt ?? null,
              name: pet.name,
              tag: pet.tag ?? null,
            },
          ],
          return: petsPgUpdateBase,
        },
      ]);

      const [petsVaccinationsPgInsertBase, petsVaccinationsPgInsertBaseMocks] = useObjectMock<
        PgInsertBase<typeof schema.petsVaccinations, PgQueryResultHKT, undefined, undefined>
      >([{ name: 'execute', parameters: [], return: Promise.resolve(undefined) }]);

      const [petsVaccinationsPgInsertBuilder, petsVaccinationsPgInsertBuilderMocks] = useObjectMock<
        PgInsertBuilder<typeof schema.petsVaccinations, PgQueryResultHKT>
      >([
        {
          name: 'values',
          parameters: [
            pet.vaccinations?.map((vaccination) => ({
              petId: pet.id,
              name: vaccination.name,
            })) ?? [],
          ],
          return: petsVaccinationsPgInsertBase,
        },
      ]);

      const [transaction, transactionMocks] = useObjectMock<
        PgTransaction<PgQueryResultHKT, Schema, TablesWithRelations>
      >([
        {
          name: 'select',
          parameters: [{ count: count(schema.pets.id) }],
          return: pgSelectBuilder,
        },
        {
          name: 'delete',
          parameters: [schema.petsVaccinations],
          return: petsVaccinationsPgDeleteBase,
        },
        {
          name: 'update',
          parameters: [schema.pets],
          return: petsPgUpdateBuilder,
        },
        {
          name: 'insert',
          parameters: [schema.petsVaccinations],
          return: petsVaccinationsPgInsertBuilder,
        },
      ]);

      const [db, dbMocks] = useObjectMock<NodePgDatabase<Schema>>([
        {
          name: 'transaction',
          callback: (callback) => callback(transaction),
        },
      ]);

      const persistPet = createPersistPet(db);

      expect(await persistPet(pet)).toMatchInlineSnapshot(`
        {
          "createdAt": 2025-08-30T12:08:45.385Z,
          "id": "petId",
          "name": "name",
          "tag": "tag",
          "updatedAt": 2025-08-30T12:08:45.385Z,
          "vaccinations": [
            {
              "name": "name",
            },
          ],
        }
      `);

      expect(pgSelectBaseMocks.length).toBe(0);
      expect(pgSelectBuilderMocks.length).toBe(0);
      expect(petsVaccinationsPgDeleteBaseMocks.length).toBe(0);
      expect(petsPgUpdateBaseMocks.length).toBe(0);
      expect(petsPgUpdateBuilderMocks.length).toBe(0);
      expect(petsVaccinationsPgInsertBaseMocks.length).toBe(0);
      expect(petsVaccinationsPgInsertBuilderMocks.length).toBe(0);
      expect(transactionMocks.length).toBe(0);
      expect(dbMocks.length).toBe(0);
    });
  });

  test('createRemovePet', async () => {
    const pet: Pet = {
      id: 'petId',
      createdAt: new Date('2025-08-30T12:08:45.385Z'),
      updatedAt: new Date('2025-08-30T12:08:45.385Z'),
      name: 'name',
      tag: 'tag',
      vaccinations: [
        {
          name: 'name',
        },
      ],
    };

    const [petsVaccinationsPgDeleteBase, petsVaccinationsPgDeleteBaseMocks] = useObjectMock<
      PgDeleteBase<typeof schema.petsVaccinations, PgQueryResultHKT>
    >([
      {
        name: 'where',
        callback: () => petsVaccinationsPgDeleteBase,
      },
      { name: 'execute', parameters: [], return: Promise.resolve() },
    ]);

    const [petsPgDeleteBase, petsPgDeleteBaseMocks] = useObjectMock<PgDeleteBase<typeof schema.pets, PgQueryResultHKT>>(
      [
        {
          name: 'where',
          callback: () => petsPgDeleteBase,
        },
        { name: 'execute', parameters: [], return: Promise.resolve() },
      ],
    );

    const [transaction, transactionMocks] = useObjectMock<PgTransaction<PgQueryResultHKT, Schema, TablesWithRelations>>(
      [
        {
          name: 'delete',
          parameters: [schema.petsVaccinations],
          return: petsVaccinationsPgDeleteBase,
        },
        {
          name: 'delete',
          parameters: [schema.pets],
          return: petsPgDeleteBase,
        },
      ],
    );

    const [db, dbMocks] = useObjectMock<NodePgDatabase<Schema>>([
      {
        name: 'transaction',
        callback: (callback) => callback(transaction),
      },
    ]);

    const removePet = createRemovePet(db);

    await removePet(pet);

    expect(petsVaccinationsPgDeleteBaseMocks.length).toBe(0);
    expect(petsPgDeleteBaseMocks.length).toBe(0);
    expect(transactionMocks.length).toBe(0);
    expect(dbMocks.length).toBe(0);
  });
});
