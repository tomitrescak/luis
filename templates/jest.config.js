module.exports = {
  testEnvironment: 'node',
  rootDir: '$root',
  reporters: [
    'default',
    [
      'luis/jest/reporter',
      {
        path: '$root/summary.js',
        merge: true
      }
    ]
  ],
  watchPathIgnorePatterns: ['$ignore']
};
