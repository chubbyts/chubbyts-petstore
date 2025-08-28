import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

const baseFields = {
  id: uuid().primaryKey(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at'),
};

export const pets = pgTable('pets', {
  ...baseFields,
  name: varchar({ length: 255 }).notNull(),
  tag: varchar({ length: 255 }),
});

export type PetsColumns = keyof typeof pets.$inferSelect;

export const petsRelations = relations(pets, ({ many }) => ({
  vaccinations: many(petsVaccinations),
}));

export const petsVaccinations = pgTable('pets_vaccinations', {
  petId: uuid('pet_id')
    .references(() => pets.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar({ length: 255 }).notNull(),
});

export const petsVaccinationsRelations = relations(petsVaccinations, ({ one }) => ({
  pet: one(pets, {
    fields: [petsVaccinations.petId],
    references: [pets.id],
  }),
}));
