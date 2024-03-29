/* eslint-disable no-undef */
/* eslint-disable functional/immutable-data */
module.exports = {
  globalSetup: '<rootDir>/jest.integration.global-setup.js',
  globalTeardown: '<rootDir>/jest.integration.global-teardown.js',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
  transform: {
    '\\.ts$': '@swc/jest',
  },
  prettierPath: require.resolve('prettier-2'),
};
