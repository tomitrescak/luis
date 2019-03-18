module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['luis/jest/register'],
  setupFilesAfterEnv: ['<rootDir>/proxies.ts'],
  rootDir: 'src',
  reporters: [
    'default',
    [
      'luis/jest/reporter',
      {
        path: 'src/summary.ts',
        merge: true
      }
    ]
  ],
  watchPathIgnorePatterns: ['<rootDir>/src/summary.ts']
};
