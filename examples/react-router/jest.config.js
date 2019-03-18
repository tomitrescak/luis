module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: [
    'jest-dot-reporter',
    [
      'luis/jest/reporter',
      {
        path: 'src/summary.ts',
        merge: true
      }
    ]
  ]
};
