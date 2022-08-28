import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testMatch: ['**/tests/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testTimeout: 30 * 1000,
};

export default config;
