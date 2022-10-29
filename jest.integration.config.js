module.exports = {
  transform: {
    '\\.ts$': 'ts-jest',
  },
  testMatch: [
    '<rootDir>/tests/integration/**/*.test.ts',
  ],
  globalSetup: '<rootDir>/jest.integration.global-setup.js',
  globalTeardown: '<rootDir>/jest.integration.global-teardown.js',
  testEnvironment: '@shelf/jest-mongodb/lib/environment.js',
};
