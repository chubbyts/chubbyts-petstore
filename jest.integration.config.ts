import type { Config } from 'jest';

const config: Config = {
  globalSetup: '<rootDir>/jest.integration.global-setup.ts',
  globalTeardown: '<rootDir>/jest.integration.global-teardown.ts',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
  transform: {
    '\\.ts$': '@swc/jest',
  },
  prettierPath: require.resolve('prettier-2'),
};

export default config;
