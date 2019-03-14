module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '$root',
  reporters: [
    'default',
    [
      'luis/jest/reporter',
      {
        path: '$root/summary.ts',
        merge: true
      }
    ]
  ],
  watchPathIgnorePatterns: ['$ignore']
};
