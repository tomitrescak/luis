// const transform = require("fuse-test-runner").wallabyFuseTestLoader;
const path = require('path');
const jsxTransform = require('jsx-controls-loader').loader;

module.exports = function(wallaby) {
  // var load = require;

  return {
    files: [
      'src/example/client/**/*.ts*',
      'src/example/**/*.ts*',
      '!src/**/*.d.ts*',
      '!src/example/**/*.test.tsx',
    ],
    // debug: true,
    tests: [
      'src/example/**/*.test.tsx',
      'src/example/**/*.test.ts',
      'src/**/snapshots/*.json'
    ],
    filesWithNoCoverageCalculated: [
      'src/**/*mocha*.ts',
      'src/**/*wallaby*.ts',
      'src/**/test_*.ts',
    ],
    compilers: {
      '**/*.ts?(x)': wallaby.compilers.typeScript({ jsx: 'react', module: 'commonjs' })
    },
    preprocessors: {
      // '**/*.ts': file => transform(file.content),
      // '**/*.tsx': file => transform(jsxtransform(file.content))
      '**/*.tsx': file => jsxTransform(file.content)
    },
    env: {
      type: 'node'
      // runner: '/usr/local/bin/node'
    },
    testFramework: 'mocha',
    setup: function(wallaby) {
      // const { config } = require('chai-match-snapshot');
      // config.snapshotDir = '/Users/tomi/Github/packages/louis/src/tests/snapshots';

      require('wafl').setup({ 
        wallaby, 
        snapshotDir: '/Users/tomi/Github/packages/louis/src/tests/snapshots',
        snapshotsOverTcp: true });
    }
  };
};

