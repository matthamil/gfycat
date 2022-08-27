import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testMatch: ['**/tests/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};

export default config;
