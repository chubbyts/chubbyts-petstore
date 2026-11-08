import { existsSync } from 'fs';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // this config gets compiled into dist as well (see tsconfig.json), where the schema is a .js file
  schema: [existsSync('./src/schema.ts') ? './src/schema.ts' : './src/schema.js'],
  dialect: 'postgresql',
  dbCredentials: {
    // oxlint-disable-next-line @typescript-eslint/no-non-null-assertion
    url: process.env.POSTGRES_URI!,
  },
});
