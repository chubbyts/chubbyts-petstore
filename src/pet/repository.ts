import type { InputModelList, Model, ModelList } from '@chubbyts/chubbyts-api/dist/model';
import type {
  FindModelById,
  PersistModel,
  RemoveModel,
  ResolveModelList,
} from '@chubbyts/chubbyts-api/dist/repository';
import { type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, asc, count, desc, eq } from 'drizzle-orm';
import type * as schema from '../schema.js';
import { pets, petsVaccinations } from '../schema.js';
import { type InputPetListSchema, type InputPetSchema } from './model.js';

export const createResolvePetList = (
  db: NodePgDatabase<typeof schema>,
): ResolveModelList<InputPetSchema, InputPetListSchema> => {
  return async (list: InputModelList<InputPetListSchema>): Promise<ModelList<InputPetSchema, InputPetListSchema>> => {
    const where = and(
      ...Object.entries(list.filters).map(([field, value]) => eq(pets[field as schema.PetsColumns], String(value))),
    );

    const orderBy = Object.entries(list.sort).map(([field, direction]) =>
      direction === 'desc' ? desc(pets[field as schema.PetsColumns]) : asc(pets[field as schema.PetsColumns]),
    );

    const [petCountResult, petsResult] = await Promise.all([
      db
        .select({ count: count(pets.id) })
        .from(pets)
        .where(where),
      db.query.pets.findMany({
        with: {
          vaccinations: true,
        },
        where,
        orderBy,
        limit: list.limit,
        offset: list.offset,
      }),
    ]);

    return {
      ...list,
      items: petsResult.map((petResult) => ({
        ...petResult,
        updatedAt: petResult.updatedAt ?? undefined,
        tag: petResult.tag ?? undefined,
        vaccinations: petResult.vaccinations.map((vaccinationResult) => {
          const { petId: _, ...rest } = vaccinationResult;

          return rest;
        }),
      })),
      count: petCountResult[0].count,
    };
  };
};

export const createFindPetById = (db: NodePgDatabase<typeof schema>): FindModelById<InputPetSchema> => {
  return async (id: string) => {
    const petResult = await db.query.pets.findFirst({
      with: {
        vaccinations: true,
      },
      where: eq(pets.id, id),
    });

    if (!petResult) {
      return undefined;
    }

    return {
      ...petResult,
      updatedAt: petResult.updatedAt ?? undefined,
      tag: petResult.tag ?? undefined,
      vaccinations: petResult.vaccinations.map((vaccinationResult) => {
        const { petId: _, ...rest } = vaccinationResult;

        return rest;
      }),
    };
  };
};

export const createPersistPet = (db: NodePgDatabase<typeof schema>): PersistModel<InputPetSchema> => {
  return async (pet: Model<InputPetSchema>) => {
    await db.transaction(async (transaction) => {
      const exist =
        (
          await transaction
            .select({ count: count(pets.id) })
            .from(pets)
            .where(eq(pets.id, pet.id))
        )[0].count !== 0;

      if (exist) {
        await transaction.delete(petsVaccinations).where(eq(petsVaccinations.petId, pet.id));

        await db
          .update(pets)
          .set({
            id: pet.id,
            createdAt: pet.createdAt,
            updatedAt: pet.updatedAt ?? null,
            name: pet.name,
            tag: pet.tag ?? null,
          })
          .where(eq(pets.id, pet.id));
      } else {
        await transaction.insert(pets).values({
          id: pet.id,
          createdAt: pet.createdAt,
          updatedAt: pet.updatedAt ?? null,
          name: pet.name,
          tag: pet.tag ?? null,
        });
      }

      if (pet.vaccinations && pet.vaccinations?.length > 0) {
        await transaction.insert(petsVaccinations).values(
          pet.vaccinations.map((vaccination) => ({
            petId: pet.id,
            name: vaccination.name,
          })),
        );
      }
    });

    return pet;
  };
};

export const createRemovePet = (db: NodePgDatabase<typeof schema>): RemoveModel<InputPetSchema> => {
  return async (pet: Model<InputPetSchema>) => {
    await db.transaction(async (transaction) => {
      await transaction.delete(petsVaccinations).where(eq(petsVaccinations.petId, pet.id));
      await transaction.delete(pets).where(eq(pets.id, pet.id));
    });
  };
};
