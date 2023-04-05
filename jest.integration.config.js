module.exports = {
  globalSetup: '<rootDir>/jest.integration.global-setup.js',
  globalTeardown: '<rootDir>/jest.integration.global-teardown.js',
  testEnvironment: '@shelf/jest-mongodb/lib/environment.js',
  testMatch: ['<rootDir>/tests/integration/**/*.test.ts'],
  transform: {
    '\\.ts$': '@swc/jest',
  },
};
