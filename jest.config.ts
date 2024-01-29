import type { Config } from 'jest';

const config: Config = {
  transform: {
    '\\.ts$': '@swc/jest',
  },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/unit/**/*.test.ts'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageThreshold: {
    global: {
      lines: 100,
    },
  },
  prettierPath: require.resolve('prettier-2'),
};

export default config;
