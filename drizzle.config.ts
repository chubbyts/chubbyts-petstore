import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: ['./src/schema.ts'],
  dialect: 'postgresql',
  dbCredentials: {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    url: process.env.POSTGRES_URI!,
  },
});
