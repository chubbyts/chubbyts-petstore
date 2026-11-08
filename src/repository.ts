import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type * as schema from './schema.js';

export type Schema = typeof schema;
export type TablesWithRelations = ExtractTablesWithRelations<Schema>;
