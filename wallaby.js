// const transform = require("fuse-test-runner").wallabyFuseTestLoader;
const path = require('path');
const jsxTransform = require('jsx-controls-loader').loader;

module.exports = function(wallaby) {
  // var load = require;

  return {
    files: [
      'src/client/**/*.ts*',
      'src/example/**/*.ts*',
      '!src/**/*.d.ts*'
    ],
    // debug: true,
    tests: [
      'src/tests/**/*.test.tsx',
      'src/tests/**/*.test.ts',
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
      console.log('SETUP!!');  
    
      require('wafl').setup({ wallaby });
    }
  };
};

