module.exports = {
  globalSetup: '<rootDir>/jest.integration.global-setup.js',
  globalTeardown: '<rootDir>/jest.integration.global-teardown.js',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
  transform: {
    '\\.ts$': '@swc/jest',
  },
};
