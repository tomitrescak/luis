module.exports.report = {
  "numFailedTests": 1,
  "numPassedTests": 1,
  "numTotalTests": 2,
  "testResults": [
    {
      "testFilePath": "/components/stories/greeting.test",
      "testResults": [
        {
          "ancestorTitles": [
            "Greeting"
          ],
          "duration": 11,
          "failureMessages": [],
          "fullName": "Greeting renders correctly",
          "location": null,
          "numPassingAsserts": 0,
          "status": "passed",
          "title": "renders correctly"
        },
        {
          "ancestorTitles": [
            "Greeting"
          ],
          "duration": 4,
          "failureMessages": [
            "Error: \u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m).toEqual(\u001b[22m\u001b[32mexpected\u001b[39m\u001b[2m)\u001b[22m\n\nDifference:\n\n\u001b[32m- Expected\u001b[39m\n\u001b[31m+ Received\u001b[39m\n\n\u001b[32m- 456\u001b[39m\n\u001b[31m+ 123\u001b[39m\n    at Object.<anonymous> (/Users/tomi/Downloads/with-tests/src/components/stories/greeting.test.tsx:15:19)\n    at Object.asyncJestTest (/Users/tomi/Downloads/with-tests/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)\n    at resolve (/Users/tomi/Downloads/with-tests/node_modules/jest-jasmine2/build/queueRunner.js:41:12)\n    at new Promise (<anonymous>)\n    at mapper (/Users/tomi/Downloads/with-tests/node_modules/jest-jasmine2/build/queueRunner.js:26:19)\n    at promise.then (/Users/tomi/Downloads/with-tests/node_modules/jest-jasmine2/build/queueRunner.js:71:41)\n    at processTicksAndRejections (internal/process/next_tick.js:81:5)"
          ],
          "fullName": "Greeting fails",
          "location": null,
          "numPassingAsserts": 0,
          "status": "failed",
          "title": "fails"
        }
      ],
      "numFailingTests": 1,
      "numPassingTests": 1
    }
  ]
}

module.exports.snapshots = {
    '/components/stories/greeting.test':  require('./components/stories/__snapshots__/greeting.test.tsx.snap'),
}