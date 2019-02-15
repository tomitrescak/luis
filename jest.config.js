module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  //collectCoverage: true,
  verbose: false,
  reporters: [
    // 'jest-dot-reporter',
    [
      './dist/bridges/jest/reporter',
      {
        path: '/Users/tomi/Github/packages/luis/src/summary.ts',
        merge: true
      }
    ]
  ],
  // testResultsProcessor: 'luis/dist/bridges/jest/reporter',
  watchPathIgnorePatterns: ['<rootDir>/src/summary.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)']
};
