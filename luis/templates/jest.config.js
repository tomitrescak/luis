module.exports = {
  testEnvironment: 'node',
  rootDir: '$root',
  setupFiles: ['luis/jest/register'],
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
