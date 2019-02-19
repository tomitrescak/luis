module.exports.report = {
  "numFailedTests": 3,
  "numPassedTests": 5,
  "numTotalTests": 8,
  "testResults": [
    {
      "testFilePath": "/tests/foo.test",
      "testResults": [
        {
          "ancestorTitles": [
            "Component",
            "Foo"
          ],
          "duration": 2,
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
          "duration": 0,
          "failureMessages": [
            "Error: \u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m).toEqual(\u001b[22m\u001b[32mexpected\u001b[39m\u001b[2m)\u001b[22m\n\nDifference:\n\n\u001b[32m- Expected\u001b[39m\n\u001b[31m+ Received\u001b[39m\n\n\u001b[32m- Expected Value\u001b[39m\n\u001b[31m+ Actual Value\u001b[39m\n    at Object.<anonymous> (/Users/tomi/Github/packages/luis/src/example/tests/foo.test.tsx:18:30)\n    at Object.asyncJestTest (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)\n    at resolve (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:41:12)\n    at new Promise (<anonymous>)\n    at mapper (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:26:19)\n    at promise.then (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:71:41)\n    at processTicksAndRejections (internal/process/next_tick.js:81:5)"
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
            "Error: \u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m).toEqual(\u001b[22m\u001b[32mexpected\u001b[39m\u001b[2m)\u001b[22m\n\nDifference:\n\n\u001b[32m- Expected\u001b[39m\n\u001b[31m+ Received\u001b[39m\n\n\u001b[2m  Object {\u001b[22m\n\u001b[32m-   \"bobo\": \"2\",\u001b[39m\n\u001b[31m+   \"bobo\": \"3\",\u001b[39m\n\u001b[2m    \"dodo\": \"5\",\u001b[22m\n\u001b[32m-   \"lolo\": \"rer\",\u001b[39m\n\u001b[2m    \"tomi\": \"1\",\u001b[22m\n\u001b[2m  }\u001b[22m\n    at Object.<anonymous> (/Users/tomi/Github/packages/luis/src/example/tests/foo.test.tsx:26:10)\n    at Object.asyncJestTest (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)\n    at resolve (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:41:12)\n    at new Promise (<anonymous>)\n    at mapper (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:26:19)\n    at promise.then (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:71:41)\n    at processTicksAndRejections (internal/process/next_tick.js:81:5)"
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
      "testFilePath": "/tests/bar.test",
      "testResults": [
        {
          "ancestorTitles": [
            "Component",
            "With Context"
          ],
          "duration": 1,
          "failureMessages": [
            "Error: Failed miserably\n    at Object.<anonymous> (/Users/tomi/Github/packages/luis/src/example/tests/bar.test.tsx:23:13)\n    at Object.asyncJestTest (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)\n    at resolve (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:41:12)\n    at new Promise (<anonymous>)\n    at mapper (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:26:19)\n    at promise.then (/Users/tomi/Github/packages/luis/node_modules/jest-jasmine2/build/queueRunner.js:71:41)"
          ],
          "fullName": "Component With Context fails",
          "location": null,
          "numPassingAsserts": 0,
          "status": "failed",
          "title": "fails"
        },
        {
          "ancestorTitles": [
            "Component",
            "With Context"
          ],
          "duration": 3,
          "failureMessages": [],
          "fullName": "Component With Context renders",
          "location": null,
          "numPassingAsserts": 0,
          "status": "passed",
          "title": "renders"
        }
      ],
      "numFailingTests": 1,
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
          "duration": 5,
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
    },
    {
      "testFilePath": "/tests/apollo.test",
      "testResults": [
        {
          "ancestorTitles": [
            "Component",
            "With Apollo"
          ],
          "duration": 13,
          "failureMessages": [],
          "fullName": "Component With Apollo renders",
          "location": null,
          "numPassingAsserts": 0,
          "status": "passed",
          "title": "renders"
        },
        {
          "ancestorTitles": [
            "Component",
            "With Apollo"
          ],
          "duration": 6,
          "failureMessages": [],
          "fullName": "Component With Apollo renders async",
          "location": null,
          "numPassingAsserts": 0,
          "status": "passed",
          "title": "renders async"
        }
      ],
      "numFailingTests": 0,
      "numPassingTests": 2
    }
  ]
}

module.exports.snapshots = {
    '/tests/apollo.test':  require('./tests/__snapshots__/apollo.test.tsx.snap'),
    '/tests/bar.test':  require('./tests/__snapshots__/bar.test.tsx.snap'),
    '/tests/boo.test':  require('./tests/__snapshots__/boo.test.tsx.snap'),
    '/tests/foo.test':  require('./tests/__snapshots__/foo.test.tsx.snap'),
}