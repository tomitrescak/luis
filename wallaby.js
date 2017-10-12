const path = require('path');
const jsxTransform = require('jsx-controls-loader').loader;

module.exports = function(wallaby) {
  return {
    files: [
      'src/example/client/**/*.ts*',
      'src/example/**/*.ts*',
      '!src/**/*.d.ts*',
      '!src/example/**/*.test.tsx'
    ],
    tests: ['src/example/**/*.test.tsx', 'src/example/**/*.test.ts', 'src/**/snapshots/*.json'],
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
    testFramework: 'mocha',
    setup: function(wallaby) {
      const path = require('path');
      const snapshotDir = path.join(wallaby.localProjectDir, 'src', 'tests', 'snapshots');

      require('wafl').setup({
        wallaby,
        // if you want wallaby to save snapshots, you need to specify absolute path to their location
        snapshotDir,
        /* you can choose following snapshot mode
           * - tcp: updated snapshots are sent to VS Code extension over TCP. 
           *        Make sure the extension is enabled before running
           * - drive: updated snapshots are automatically saved to your drive
           * - both: snapshots are sent to TCP AND saved to drive
           * - test: standard mode during running your tests, when snapshots are NOT updated but compared
           */
        snapshotMode: 'drive'
      });
    }
  };
};
