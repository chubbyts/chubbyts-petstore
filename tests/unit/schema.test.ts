import { describe, expect, test } from 'vitest';
import { getTableConfig } from 'drizzle-orm/pg-core';
import { createTableRelationsHelpers, Many, One } from 'drizzle-orm';
import { pets, petsRelations, petsVaccinations, petsVaccinationsRelations } from '../../src/schema.js';

describe('schema', () => {
  test('pets', () => {
    const { name, columns, foreignKeys } = getTableConfig(pets);

    expect(name).toBe('pets');
    expect(foreignKeys).toHaveLength(0);

    expect(
      columns.map((column) => ({
        name: column.name,
        sqlType: column.getSQLType(),
        primary: column.primary,
        notNull: column.notNull,
      })),
    ).toMatchInlineSnapshot(`
      [
        {
          "name": "id",
          "notNull": true,
          "primary": true,
          "sqlType": "uuid",
        },
        {
          "name": "created_at",
          "notNull": true,
          "primary": false,
          "sqlType": "timestamp",
        },
        {
          "name": "updated_at",
          "notNull": false,
          "primary": false,
          "sqlType": "timestamp",
        },
        {
          "name": "name",
          "notNull": true,
          "primary": false,
          "sqlType": "varchar(255)",
        },
        {
          "name": "tag",
          "notNull": false,
          "primary": false,
          "sqlType": "varchar(255)",
        },
      ]
    `);
  });

  test('petsRelations', () => {
    const config = petsRelations.config(createTableRelationsHelpers(pets));

    expect(Object.keys(config)).toEqual(['vaccinations']);
    expect(config.vaccinations).toBeInstanceOf(Many);
    expect(config.vaccinations.referencedTable).toBe(petsVaccinations);
  });

  test('petsVaccinations', () => {
    const { name, columns, foreignKeys } = getTableConfig(petsVaccinations);

    expect(name).toBe('pets_vaccinations');

    expect(
      columns.map((column) => ({
        name: column.name,
        sqlType: column.getSQLType(),
        primary: column.primary,
        notNull: column.notNull,
      })),
    ).toMatchInlineSnapshot(`
      [
        {
          "name": "pet_id",
          "notNull": true,
          "primary": false,
          "sqlType": "uuid",
        },
        {
          "name": "name",
          "notNull": true,
          "primary": false,
          "sqlType": "varchar(255)",
        },
      ]
    `);

    expect(foreignKeys).toHaveLength(1);

    const foreignKey = foreignKeys[0];

    expect(foreignKey.onDelete).toBe('cascade');

    const reference = foreignKey.reference();

    expect(reference.columns).toEqual([petsVaccinations.petId]);
    expect(reference.foreignTable).toBe(pets);
    expect(reference.foreignColumns).toEqual([pets.id]);
  });

  test('petsVaccinationsRelations', () => {
    const config = petsVaccinationsRelations.config(createTableRelationsHelpers(petsVaccinations));

    expect(Object.keys(config)).toEqual(['pet']);
    expect(config.pet).toBeInstanceOf(One);
    expect(config.pet.referencedTable).toBe(pets);
    expect(config.pet.config?.fields).toEqual([petsVaccinations.petId]);
    expect(config.pet.config?.references).toEqual([pets.id]);
  });
});
