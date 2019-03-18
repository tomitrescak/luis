import * as Mocha from 'mocha';
const LuisReporter = require('../jest/reporter');

import { formatMochaError, colored } from './formatError';

const hasError = (test: Mocha.Test = {} as any) => {
  return test.err instanceof Error || (test.err && Object.keys(test.err).length > 0);
};
const toMochaError = (test: Mocha.Test) => (hasError(test) ? `${formatMochaError(test)}` : null);

const getFailureMessages = (tests: Mocha.Test[]) => {
  const failureMessages = tests.filter(hasError).map(toMochaError);

  return failureMessages.length ? failureMessages : null;
};

const getAncestorTitle = (test: Mocha.Test | Mocha.Suite): string[] => {
  if (test.parent && test.parent.title) {
    return [test.parent.title].concat(getAncestorTitle(test.parent));
  }

  return [];
};

function padLeft(str: string, targetLength: number, padString: string = ' ') {
  for (let i = 0; i < targetLength; i++) {
    str = padString + str;
  }
  return str;
}

type TestResult = {
  stats: Mocha.Stats;
  files: FileResult[];
  coverage: any;
};

const toTestResult = ({ stats, files }: TestResult): Partial<jest.AggregatedResult> => {
  // const effectiveTests = tests;

  // Merge failed tests that don't exist in the tests array so that we report
  // all tests even if an error occurs in a beforeEach block.
  // failures.forEach(test => {
  //   if (!tests.some(t => t === test)) {
  //     tests.push(test);
  //   }
  // });

  return {
    // coverage,
    numFailedTests: stats.failures,
    numPassedTests: stats.passes,
    numPendingTests: stats.pending,
    // perfStats: {
    //   end: +new Date(stats.end),
    //   start: +new Date(stats.start)
    // },
    // skipped: false,
    snapshot: {
      added: 0,
      matched: 0,
      unchecked: 0,
      unmatched: 0,
      updated: 0
    } as any,
    // sourceMaps: {},
    // testExecError: null,
    testResults: files.map((file: FileResult) => {
      return {
        console: null,
        perfStats: null,
        skipped: false,
        snapshot: null,
        sourceMaps: null,
        testFilePath: file.path,
        numFailingTests: file.failures.length,
        numPassingTests: file.passes.length,
        numPendingTests: file.pending.length,
        failureMessage: getFailureMessages(file.tests).join('\n'),
        testResults: file.tests.map((test: Mocha.Test) => {
          const failureMessage = toMochaError(test);
          return {
            ancestorTitles: getAncestorTitle(test).reverse(),
            duration: test.duration,
            failureMessages: failureMessage ? [failureMessage] : [],
            fullName: test.fullTitle(),
            numPassingAsserts: hasError(test) ? 1 : 0,
            status: hasError(test) ? 'failed' : ('passed' as jest.Status),
            title: test.title
          };
        })
      };
    })
  };
};

type FileResult = {
  path: string;
  tests: Mocha.Test[];
  pending: Mocha.Test[];
  failures: Mocha.Test[];
  passes: Mocha.Test[];
};

type ReporterOptions = {
  path?: string;
};

class Reporter extends Mocha.reporters.Base {
  parents: any[] = [];

  constructor(runner: Mocha.Runner, options: ReporterOptions = {}) {
    super(runner);

    const files: FileResult[] = [];

    // let tests = [];
    // let pending = [];
    // let failures = [];
    // let passes = [];

    let fileName = '';
    let file: FileResult;

    runner.on('suite', (test: Mocha.Test) => {
      if (test.file && fileName != test.file) {
        file = {
          path: test.file,
          tests: [],
          pending: [],
          failures: [],
          passes: []
        };
        files.push(file);
        fileName = test.file;
        // console.log('Adding: ' + test.file);
      }
    });

    runner.on('test end', test => file.tests.push(test));

    runner.on('pass', test => {
      let l = getAncestorTitle(test).length * 2;

      this.paintParent(test);
      console.log(padLeft(colored('bright pass', '✔ Pass: ') + test.title, l));

      file.passes.push(test);
    });
    runner.on('fail', (test, err) => {
      // console.log('---------------------');
      // console.log(typeof err);
      // console.log(err.message);
      // console.log(err);
      // console.log('---------------------');
      let l = getAncestorTitle(test).length * 2;
      console.log(padLeft(colored('bright fail', '✘ Fail: ') + test.title, l));
      console.log(padLeft(err, l + 8));

      test.err = err;
      file.failures.push(test);
    });
    runner.on('pending', test => file.pending.push(test));
    runner.on('end', () => {
      let result = toTestResult({
        stats: this.stats,
        files,
        coverage: (global as any).__coverage__
        // jestTestPath: testPath
      });

      try {
        console.log('');
        const reporter = new LuisReporter(null, {
          path: process.env.SAVE_REPORT_PATH || options.path || 'src/summary.ts'
        });
        reporter.onRunComplete(null, result);
        console.log('🏁  DONE');
        // console.log(JSON.stringify(result, null, 2));
      } catch (ex) {
        console.log(ex);
      }
    });
  }

  paintParent(test: Mocha.Test) {
    let parents = getAncestorTitle(test).reverse();
    for (let i = 0; i < parents.length; i++) {
      if (parents[i] != this.parents[i]) {
        if (i == 0) {
          console.log();
        }
        console.log(padLeft(parents[i], i * 2));
      }
    }
    this.parents = parents;
  }
}

function ExportedReporter(runner: Mocha.Runner, options: ReporterOptions) {
  return new Reporter(runner, options);
}

module.exports = ExportedReporter;
