import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      NODE_ENV: 'test',
    },
    include: ['tests/integration/**/*.test.*'],
    globalSetup: ['vitest.integration.setup.ts'],
  },
});
