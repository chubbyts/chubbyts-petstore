import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/integration/**/*.test.*'],
    globalSetup: ['vitest.integration.setup.ts'],
  },
});
