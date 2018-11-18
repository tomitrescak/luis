import * as fs from 'fs';
import * as path from 'path';

const rootDir = 'src';

function checkSaveFile(savePath: string, saveContent: string) {
  console.log(savePath);
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

module.exports = function(testData: jest.AggregatedResult) {
  // Make sure that test data was provided
  if (!testData) {
    throw new Error('Test data missing or malformed');
  }

  let savePath = path.join(process.env.JEST_ROOT_OUTPUT_PATH || rootDir, 'summary.json');
  let clone = { ...testData };

  delete clone.startTime;
  clone.testResults.forEach(t => delete t.perfStats);

  let saveContent = JSON.stringify(clone, null, 2);

  // find the file and check if there are any changes
  checkSaveFile(savePath, saveContent);

  let imports: any = 'module.exports = {\n';
  let root = path.resolve(process.env.JEST_ROOT_OUTPUT_PATH || rootDir);
  console.log(root);
  testData.testResults.forEach(suite => {
    let suitePath = path.dirname(suite.testFilePath);
    let snapshotPath = path.join(suitePath, '__snapshots__');

    try {
      fs.accessSync(snapshotPath);
      let files = fs.readdirSync(snapshotPath);

      for (let file of files) {
        if (file.match(/\.snap/)) {
          let fullFile = path.join(snapshotPath, file);
          let partFile = fullFile.replace(root, '');
          imports += `    '${suite.testFilePath}':  require('.${partFile}'),\n`;
        }
      }
    } catch (e) {
      console.log(e);
      fs.mkdirSync(snapshotPath);
    }
  });

  imports += '}';

  savePath = path.join(process.env.JEST_ROOT_OUTPUT_PATH || rootDir, 'snapshots.js');
  saveContent = imports;

  checkSaveFile(savePath, saveContent);

  // TODO: Possibly store results

  // const result: any = {};

  // result.startTime = testData.startTime;
  // result.numTotalTests = testData.numTotalTests;
  // result.numPassedTests = testData.numPassedTests;
  // result.numFailedTests = testData.numFailedTests;
  // result.numPendingTests = testData.numPendingTests;

  // // Loop through each test suite
  // testData.testResults.forEach((suite) => {

  //   // create directory if it does not exist
  //   let suitePath = path.dirname(suite.testFilePath);
  //   let resultPath = path.join(suitePath, '__snapshots__');

  //   // make the directory
  //   try {
  //     fs.accessSync(resultPath);
  //   } catch (e) {
  //     fs.mkdirSync(resultPath);
  //   }

  //   let file = path.basename(suite.testFilePath, path.extname(suite.testFilePath)) + '.result.js';

  //   let suiteResult: any = {};

  // 	// if (!suite.testResults || suite.testResults.length <= 0) { return; }
  // 	// // Suite filepath location
  // 	// htmlOutput.ele('div', { class: 'suite-info' }, `
  // 	// 	${suite.testFilePath} (${(suite.perfStats.end - suite.perfStats.start) / 1000}s)
  // 	// `);
  // 	// // Suite Test Table
  // 	// const suiteTable = htmlOutput.ele('table', { class: 'suite-table', cellspacing: '0', cellpadding: '0' });
  // 	// // Loop through each test case
  // 	// suite.testResults.forEach((test) => {
  // 	// 	const testTr = suiteTable.ele('tr', { class: test.status });
  // 	// 		// Suite Name(s)
  // 	// 		testTr.ele('td', { class: 'suite' }, test.ancestorTitles.join(' > '));
  // 	// 		// Test name
  // 	// 		const testTitleTd = testTr.ele('td', { class: 'test' }, test.title);
  // 	// 		// Test Failure Messages
  // 	// 		if (test.failureMessages && (config.includeFailureMsg || process.env.JEST_HTML_REPORTER_INCLUDE_FAILURE_MSG)) {
  // 	// 			const failureMsgDiv = testTitleTd.ele('div', { class: 'failureMessages' })
  // 	// 			test.failureMessages.forEach((failureMsg) => {
  // 	// 				failureMsgDiv.ele('p', { class: 'failureMsg' }, stripAnsi(failureMsg));
  // 	// 			});
  // 	// 		}
  // 	// 		// Test Result
  // 	// 		testTr.ele('td', { class: 'result' }, (test.status === 'passed') ?
  // 	// 			`${test.status} in ${test.duration / 1000}s`
  // 	// 			: test.status
  // 	// 		);
  // 	// });
  // });

  return testData;
};
