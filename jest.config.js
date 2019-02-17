module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  verbose: false,
  reporters: [
    'jest-dot-reporter',
    [
      '../reporter',
      {
        path: 'src/example/summary.ts',
        merge: true
      }
    ]
  ],
  // testResultsProcessor: 'luis/dist/bridges/jest/reporter',
  watchPathIgnorePatterns: ['<rootDir>/example/summary.ts'],
  // testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/example/**/?(*.)+(spec|test).[jt]s?(x)']
};
