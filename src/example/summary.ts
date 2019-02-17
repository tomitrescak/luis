module.exports.report = {
  "numFailedTests": 5,
  "numPassedTests": 3,
  "numTotalTests": 8,
  "testResults": [
    {
      "testFilePath": "/tests/bar.test",
      "testResults": [
        {
          "ancestorTitles": [
            "Component",
            "Doo"
          ],
          "duration": 0,
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
          "duration": 1,
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
          "duration": 2,
          "failureMessages": [
            "Error: expect(value).toMatchSnapshot()\n\nReceived value does not match stored snapshot \"Component Doo Bar renders 1\".\n\n- Snapshot\n+ Received\n\n  <div>\n-   Bar Component\n+   Bar Component 5\n  </div>\n    at Object.<anonymous> (/Users/tomi/Github/packages/luis/src/example/tests/bar.test.tsx:18:46)\n    at Object.asyncJestTest (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)\n    at resolve (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:41:12)\n    at new Promise (<anonymous>)\n    at mapper (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:26:19)\n    at promise.then (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:71:41)\n    at processTicksAndRejections (internal/process/next_tick.js:81:5)"
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
          "duration": 2,
          "failureMessages": [
            "Error: expect(value).toMatchSnapshot()\n\nReceived value does not match stored snapshot \"Component Doo Bar renders1 with really long name there it is 1\".\n\n- Snapshot\n+ Received\n\n  <div>\n-   Bar Component\n+   Bar Component 5\n  </div>\n    at Object.<anonymous> (/Users/tomi/Github/packages/luis/src/example/tests/bar.test.tsx:22:46)\n    at Object.asyncJestTest (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)\n    at resolve (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:41:12)\n    at new Promise (<anonymous>)\n    at mapper (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:26:19)\n    at promise.then (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:71:41)\n    at processTicksAndRejections (internal/process/next_tick.js:81:5)"
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
      "testFilePath": "/tests/foo.test",
      "testResults": [
        {
          "ancestorTitles": [
            "Component",
            "Foo"
          ],
          "duration": 1,
          "failureMessages": [],
          "fullName": "Component Foo renders correctly",
          "location": null,
          "numPassingAsserts": 0,
          "status": "passed",
          "title": "renders correctly"
        },
        {
          "ancestorTitles": [
            "Component",
            "Foo"
          ],
          "duration": 1,
          "failureMessages": [
            "Error: expect(received).toEqual(expected)\n\nDifference:\n\n- Expected\n+ Received\n\n- Expected Value\n+ Actual Value\n    at Object.<anonymous> (/Users/tomi/Github/packages/luis/src/example/tests/foo.test.tsx:18:30)\n    at Object.asyncJestTest (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)\n    at resolve (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:41:12)\n    at new Promise (<anonymous>)\n    at mapper (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:26:19)\n    at promise.then (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:71:41)"
          ],
          "fullName": "Component Foo shows difference",
          "location": null,
          "numPassingAsserts": 0,
          "status": "failed",
          "title": "shows difference"
        },
        {
          "ancestorTitles": [
            "Component",
            "Foo"
          ],
          "duration": 1,
          "failureMessages": [
            "Error: expect(received).toEqual(expected)\n\nDifference:\n\n- Expected\n+ Received\n\n  Object {\n-   \"bobo\": \"2\",\n+   \"bobo\": \"3\",\n    \"dodo\": \"5\",\n-   \"lolo\": \"rer\",\n    \"tomi\": \"1\",\n  }\n    at Object.<anonymous> (/Users/tomi/Github/packages/luis/src/example/tests/foo.test.tsx:26:10)\n    at Object.asyncJestTest (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)\n    at resolve (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:41:12)\n    at new Promise (<anonymous>)\n    at mapper (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:26:19)\n    at promise.then (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:71:41)"
          ],
          "fullName": "Component Foo shows multiline difference",
          "location": null,
          "numPassingAsserts": 0,
          "status": "failed",
          "title": "shows multiline difference"
        }
      ],
      "numFailingTests": 2,
      "numPassingTests": 1
    },
    {
      "testFilePath": "/tests/boo.test",
      "testResults": [
        {
          "ancestorTitles": [
            "Boo",
            "Boo View"
          ],
          "duration": 3,
          "failureMessages": [],
          "fullName": "Boo Boo View renders correctly",
          "location": null,
          "numPassingAsserts": 0,
          "status": "passed",
          "title": "renders correctly"
        }
      ],
      "numFailingTests": 0,
      "numPassingTests": 1
    }
  ]
}

module.exports.snapshots = {
    '/tests/bar.test':  require('./tests/__snapshots__/bar.test.tsx.snap'),
    '/tests/boo.test':  require('./tests/__snapshots__/boo.test.tsx.snap'),
    '/tests/foo.test':  require('./tests/__snapshots__/foo.test.tsx.snap'),
}