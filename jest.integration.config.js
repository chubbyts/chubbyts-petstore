module.exports = {
  transform: {
    '\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/tests/integration/**/*.test.ts',
  ],
  globalSetup: '<rootDir>/jest.integration.global-setup.js',
  globalTeardown: '<rootDir>/jest.integration.global-teardown.js'
};
