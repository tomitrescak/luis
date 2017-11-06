const path = require('path');
const jsxTransform = require('jsx-controls-loader').loader;

module.exports = function(wallaby) {
  return {
    files: [
      'src/client/**/*.ts*',
      '!src/client/**/*.png',
      'src/**/*.ts*',
      '!src/**/*.d.ts*',
      '!src/**/*.test.tsx'
    ],
    tests: ['src/client/**/*.test.tsx', 'src/client/**/*.test.ts', 'src/**/snapshots/*.json'],
    filesWithNoCoverageCalculated: ['src/**/*mocha*.ts', 'src/**/*wallaby*.ts', 'src/**/test_*.ts'],
    compilers: {
      '**/*.ts?(x)': wallaby.compilers.typeScript({ jsx: 'react', module: 'commonjs' })
    },
    preprocessors: {
      '**/*.tsx': file => jsxTransform(file.content)
    },
    env: {
      type: 'node'
    },
    hints: {
      ignoreCoverage: /ignore coverage/ // or /istanbul ignore next/, or any RegExp
    },
    testFramework: 'mocha',
    setup: function(wallaby) {
      process.env.NODE_ENV = 'test';
      
      const path = require('path');
      const snapshotDir = path.join(wallaby.localProjectDir, 'src', 'tests', 'snapshots');

      require('wafl').setup({
        wallaby,
        // if you want wallaby to save snapshots, you need to specify absolute path to their location
        snapshotDir,
        /* you can choose following snapshot mode
           * - tcp: updated snapshots are sent to VS Code extension over TCP. 
           *        [!!! IMPORTANT] Make sure the extension is enabled before running
           * - drive: updated snapshots are automatically saved to your drive
           * - both: snapshots are sent to TCP AND saved to drive
           * - test: standard mode during running your tests, when snapshots are NOT updated but compared
           */
        snapshotMode: 'tcp'
      });
    }
  };
};
