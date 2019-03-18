const fs = require('fs');
const path = require('path');

function checkSaveFile(savePath: string, saveContent: string) {
  // console.log(savePath);
  try {
    fs.accessSync(savePath);
    let savedContent = fs.readFileSync(savePath, { encoding: 'utf-8' });
    if (savedContent.length != saveContent.length || savedContent !== saveContent) {
      fs.writeFileSync(savePath, saveContent);
    }
  } catch {
    fs.writeFileSync(savePath, saveContent);
  }
}

let rootPath: string = null;

function createName(testPath: string, root: string) {
  return testPath.substring(0, testPath.lastIndexOf('.')).replace(root, '');
}

function parse(
  newResults: Partial<jest.AggregatedResult>,
  oldResults: Partial<jest.AggregatedResult>,
  savePath: string,
  mergeResults: boolean
) {
  let changed = false;
  // let root = path.dirname(path.resolve(savePath));

  let parsed: Partial<jest.AggregatedResult> = {
    numFailedTests: newResults.numFailedTests,
    numPassedTests: newResults.numPassedTests,
    numTotalTests: newResults.numTotalTests
  };

  changed = !oldResults || newResults.numFailedTests !== oldResults.numFailedTests;

  if (changed) {
    console.log('Change in number of failed tests: ' + changed);
  }

  parsed.testResults = [];

  for (let i = 0; i < newResults.testResults.length; i++) {
    // the temporary directory is different in Wallaby
    // we will estimate it by the last directory
    let newResult = newResults.testResults[i];
    if (!rootPath) {
      const testParts = newResult.testFilePath.split('/');
      const saveParts = path.dirname(savePath).split('/');

      // console.log(testParts);
      // console.log(saveParts);

      rootPath = testParts
        .slice(0, testParts.lastIndexOf(saveParts[saveParts.length - 1]) + 1)
        .join('/');
      // console.log('Root Estimated to: ' + rootPath);
    }
    let partTest = createName(newResult.testFilePath, rootPath);

    let oldResult = oldResults && oldResults.testResults.find(r => r.testFilePath === partTest);

    let testResult: Partial<jest.TestResult> = {
      testFilePath: partTest,
      testResults: [],
      numFailingTests: newResult.numFailingTests,
      numPassingTests: newResult.numPassingTests
    };
    parsed.testResults.push(testResult as any);

    // now push all tests
    for (let j = 0; j < newResult.testResults.length; j++) {
      let newAssertion = newResult.testResults[j];
      let oldAssertion =
        oldResult && oldResult.testResults.find(r => r.fullName === newAssertion.fullName);

      if (!changed) {
        changed =
          !oldAssertion ||
          newAssertion.status !== oldAssertion.status ||
          newAssertion.failureMessages.some((m, k) => m !== oldAssertion.failureMessages[k]);
      }
      testResult.testResults.push(newAssertion);
    }
  }

  if (mergeResults && oldResults) {
    for (let result of oldResults.testResults) {
      if (parsed.testResults.every(t => t.testFilePath !== result.testFilePath)) {
        parsed.testResults.push(result);
      }
    }
  }
  return {
    changed,
    parsed
  };
}

function processResults(
  testData: Partial<jest.AggregatedResult>,
  previousData: Partial<jest.AggregatedResult>,
  savePath: string,
  merge: boolean
) {
  try {
    // Make sure that test data was provided
    if (!testData) {
      throw new Error('Test data missing or malformed');
    }

    let root = path.dirname(path.resolve(savePath));

    let { changed, parsed } = parse(testData, previousData, savePath, merge);
    if (!changed) {
      console.log('👍  No change from previous results');
      return parsed;
    }

    let report = JSON.stringify(parsed, null, 2);

    let saveContent = 'module.exports.report = ' + report + '\n\n';
    let imports = `module.exports.snapshots = {\n`;

    // add all snapshots
    const tests: string[] = require('glob').sync(path.join(root, '**/*.test.*'));
    for (let test of tests) {
      let name = path.basename(test);
      let snap = tests.find(t => t.match(new RegExp(name + '\\.snap$')) != null);

      if (snap) {
        let partSnap = snap.replace(root, '');
        let partFile = createName(test, root);
        imports += `  '${partFile}':  require('.${partSnap}'),\n`;
      }
    }

    imports += '}';

    // savePath = path.join(process.env.JEST_ROOT_OUTPUT_PATH || rootDir, 'snapshots.js');
    saveContent += imports;

    checkSaveFile(savePath, saveContent);
    console.log('✏️  Saved New Report');
    return parsed;
  } catch (ex) {
    console.log(ex);
  }
}

// my-custom-reporter.js
export class LuisReporter {
  savePath: string;
  merge: boolean;

  constructor(_globalConfig: any, options: any) {
    // this._globalConfig = globalConfig;
    // this._options = options;
    // console.log(options);
    this.savePath = options && options.path;
    this.merge = options && options.merge;
  }

  onRunComplete(_contexts: any, results: Partial<jest.AggregatedResult>) {
    let previous = null;
    const p = path.resolve(this.savePath);
    try {
      require.cache[p] = null;
      previous = require(p).report;
    } catch {}

    if (previous) {
      console.log('💾  Loaded previous report from: ' + p);
    }
    processResults(results, previous, this.savePath, this.merge);
  }
}

module.exports = LuisReporter;
