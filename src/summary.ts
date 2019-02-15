module.exports.report = {
  "numFailedTests": 3,
  "numPassedTests": 1,
  "numTotalTests": 4,
  "testResults": [
    {
      "testFilePath": "/Users/tomi/Github/packages/luis/.fusebox/cache/4.0.0-next.6/ZGXYRA-luis-client/static/tests%2Fbridge.test",
      "testResults": [],
      "numFailingTests": 0,
      "numPassingTests": 0
    },
    {
      "testFilePath": "/Users/tomi/Github/packages/luis/.fusebox/cache/4.0.0-next.6/ZGXYRA-luis-client/static/tests%2Ftest_runner.test",
      "testResults": [],
      "numFailingTests": 0,
      "numPassingTests": 0
    },
    {
      "testFilePath": "/client/components/tests/left_menu.test",
      "testResults": [],
      "numFailingTests": 0,
      "numPassingTests": 0
    },
    {
      "testFilePath": "/client/components/tests/bare_view.test",
      "testResults": [],
      "numFailingTests": 0,
      "numPassingTests": 0
    },
    {
      "testFilePath": "/client/components/tests/left_panel.test",
      "testResults": [],
      "numFailingTests": 0,
      "numPassingTests": 0
    },
    {
      "testFilePath": "/client/components/tests/story_list.test",
      "testResults": [],
      "numFailingTests": 0,
      "numPassingTests": 0
    },
    {
      "testFilePath": "/tests/test_runner.test",
      "testResults": [],
      "numFailingTests": 0,
      "numPassingTests": 0
    },
    {
      "testFilePath": "/tests/bridge.test",
      "testResults": [],
      "numFailingTests": 0,
      "numPassingTests": 0
    },
    {
      "testFilePath": "/example/tests/foo.test",
      "testResults": [],
      "numFailingTests": 0,
      "numPassingTests": 0
    },
    {
      "testFilePath": "/example/tests/boo.test",
      "testResults": [],
      "numFailingTests": 0,
      "numPassingTests": 0
    },
    {
      "testFilePath": "/example/tests/bar.test",
      "testResults": [
        {
          "ancestorTitles": [
            "Component",
            "Doo"
          ],
          "duration": 4,
          "failureMessages": [],
          "fullName": "Component Doo tests",
          "location": null,
          "numPassingAsserts": 0,
          "status": "passed",
          "title": "tests"
        },
        {
          "ancestorTitles": [
            "Component",
            "Doo",
            "Bar"
          ],
          "duration": 2,
          "failureMessages": [
            "Error: Failed miserably\n    at Object.<anonymous> (/Users/tomi/Github/packages/luis/src/example/tests/bar.test.tsx:14:15)\n    at Object.asyncJestTest (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)\n    at resolve (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:41:12)\n    at new Promise (<anonymous>)\n    at mapper (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:26:19)\n    at promise.then (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:71:41)\n    at processTicksAndRejections (internal/process/next_tick.js:81:5)"
          ],
          "fullName": "Component Doo Bar fails",
          "location": null,
          "numPassingAsserts": 0,
          "status": "failed",
          "title": "fails"
        },
        {
          "ancestorTitles": [
            "Component",
            "Doo",
            "Bar"
          ],
          "duration": 15,
          "failureMessages": [
            "Error: \u001b[2mexpect(\u001b[22m\u001b[31mvalue\u001b[39m\u001b[2m).toMatchSnapshot()\u001b[22m\n\n\u001b[31mReceived value\u001b[39m does not match \u001b[32mstored snapshot \"Component Doo Bar renders 1\"\u001b[39m.\n\n\u001b[32m- Snapshot\u001b[39m\n\u001b[31m+ Received\u001b[39m\n\n\u001b[2m  <div>\u001b[22m\n\u001b[32m-   Bar Component\u001b[39m\n\u001b[31m+   Bar Component 567\u001b[39m\n\u001b[2m  </div>\u001b[22m\n    at Object.<anonymous> (/Users/tomi/Github/packages/luis/src/example/tests/bar.test.tsx:18:46)\n    at Object.asyncJestTest (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)\n    at resolve (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:41:12)\n    at new Promise (<anonymous>)\n    at mapper (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:26:19)\n    at promise.then (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:71:41)\n    at processTicksAndRejections (internal/process/next_tick.js:81:5)"
          ],
          "fullName": "Component Doo Bar renders",
          "location": null,
          "numPassingAsserts": 0,
          "status": "failed",
          "title": "renders"
        },
        {
          "ancestorTitles": [
            "Component",
            "Doo",
            "Bar"
          ],
          "duration": 1,
          "failureMessages": [
            "Error: \u001b[2mexpect(\u001b[22m\u001b[31mvalue\u001b[39m\u001b[2m).toMatchSnapshot()\u001b[22m\n\n\u001b[31mReceived value\u001b[39m does not match \u001b[32mstored snapshot \"Component Doo Bar renders1 with really long name there it is 1\"\u001b[39m.\n\n\u001b[32m- Snapshot\u001b[39m\n\u001b[31m+ Received\u001b[39m\n\n\u001b[2m  <div>\u001b[22m\n\u001b[32m-   Bar Component\u001b[39m\n\u001b[31m+   Bar Component 567\u001b[39m\n\u001b[2m  </div>\u001b[22m\n    at Object.<anonymous> (/Users/tomi/Github/packages/luis/src/example/tests/bar.test.tsx:22:46)\n    at Object.asyncJestTest (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)\n    at resolve (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:41:12)\n    at new Promise (<anonymous>)\n    at mapper (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:26:19)\n    at promise.then (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:71:41)\n    at processTicksAndRejections (internal/process/next_tick.js:81:5)"
          ],
          "fullName": "Component Doo Bar renders1 with really long name there it is",
          "location": null,
          "numPassingAsserts": 0,
          "status": "failed",
          "title": "renders1 with really long name there it is"
        }
      ],
      "numFailingTests": 3,
      "numPassingTests": 1
    },
    {
      "testFilePath": "/client/components/tests/layout.test",
      "testResults": [],
      "numFailingTests": 0,
      "numPassingTests": 0
    }
  ]
}

module.exports.snapshots = {
    '/example/tests/bar.test':  require('./example/tests/__snapshots__/bar.test.tsx.snap'),
}