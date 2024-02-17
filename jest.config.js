/* eslint-disable no-undef */
/* eslint-disable functional/immutable-data */
module.exports = {
  transform: {
    '\\.(ts|tsx)$': '@swc/jest',
  },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/unit/**/*.test.(ts|tsx)'],
  collectCoverageFrom: ['<rootDir>/src/**/*.(ts|tsx)'],
  coveragePathIgnorePatterns: ['.*/_gql/.*'],
  coverageThreshold: {
    global: {
      lines: 100,
    },
  },
  prettierPath: require.resolve('prettier-2'),
};
