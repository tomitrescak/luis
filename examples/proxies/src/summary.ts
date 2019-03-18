module.exports.report = {
  "numFailedTests": 3,
  "numPassedTests": 5,
  "numTotalTests": 8,
  "testResults": [
    {
      "testFilePath": "/tests/with_actions.test",
      "testResults": [
        {
          "ancestorTitles": [
            "With Actions"
          ],
          "duration": 34,
          "failureMessages": [],
          "fullName": "With Actions renders correctly",
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
      "testFilePath": "/tests/with_context.test",
      "testResults": [
        {
          "ancestorTitles": [
            "With Context"
          ],
          "duration": 15,
          "failureMessages": [],
          "fullName": "With Context renders",
          "location": null,
          "numPassingAsserts": 0,
          "status": "passed",
          "title": "renders"
        }
      ],
      "numFailingTests": 0,
      "numPassingTests": 1
    },
    {
      "testFilePath": "/tests/with_apollo.test",
      "testResults": [
        {
          "ancestorTitles": [
            "With Apollo"
          ],
          "duration": 36,
          "failureMessages": [],
          "fullName": "With Apollo renders",
          "location": null,
          "numPassingAsserts": 0,
          "status": "passed",
          "title": "renders"
        },
        {
          "ancestorTitles": [
            "With Apollo"
          ],
          "duration": 5,
          "failureMessages": [],
          "fullName": "With Apollo renders with helper",
          "location": null,
          "numPassingAsserts": 0,
          "status": "passed",
          "title": "renders with helper"
        },
        {
          "ancestorTitles": [
            "With Apollo"
          ],
          "duration": 6,
          "failureMessages": [
            "Error: \u001b[2mexpect(\u001b[22m\u001b[31mvalue\u001b[39m\u001b[2m).toMatchSnapshot()\u001b[22m\n\n\u001b[31mReceived value\u001b[39m does not match \u001b[32mstored snapshot \"With Apollo renders with error: Error 1\"\u001b[39m.\n\n\u001b[32m- Snapshot\u001b[39m\n\u001b[31m+ Received\u001b[39m\n\n\u001b[2m  <pre>\u001b[22m\n\u001b[31m+   Error:\u001b[7m \u001b[27m\u001b[39m\n\u001b[2m    {\u001b[22m\n\u001b[32m-   \"graphQLErrors\": [],\u001b[39m\n\u001b[32m-   \"networkError\": {},\u001b[39m\n\u001b[32m-   \"message\": \"Network error: Missing mock for operation 'People'. You mocked only: ['failWith']\"\u001b[39m\n\u001b[31m+   \"graphQLErrors\": [\u001b[39m\n\u001b[31m+     {\u001b[39m\n\u001b[31m+       \"message\": [\u001b[39m\n\u001b[31m+         \"This is my error message\"\u001b[39m\n\u001b[31m+       ]\u001b[39m\n\u001b[31m+     }\u001b[39m\n\u001b[31m+   ],\u001b[39m\n\u001b[31m+   \"networkError\": null,\u001b[39m\n\u001b[31m+   \"message\": \"GraphQL error: This is my error message\"\u001b[39m\n\u001b[2m  }\u001b[22m\n\u001b[2m  </pre>\u001b[22m\n    at Object.<anonymous> (/Users/tomi/Github/packages/luis-workspace/examples/proxies/src/tests/with_apollo.test.tsx:80:20)\n    at step (/Users/tomi/Github/packages/luis-workspace/examples/proxies/src/tests/with_apollo.test.tsx:36:23)\n    at Object.next (/Users/tomi/Github/packages/luis-workspace/examples/proxies/src/tests/with_apollo.test.tsx:17:53)\n    at fulfilled (/Users/tomi/Github/packages/luis-workspace/examples/proxies/src/tests/with_apollo.test.tsx:8:58)"
          ],
          "fullName": "With Apollo renders with error",
          "location": null,
          "numPassingAsserts": 0,
          "status": "failed",
          "title": "renders with error"
        }
      ],
      "numFailingTests": 1,
      "numPassingTests": 2
    },
    {
      "testFilePath": "/tests/with_error.test",
      "testResults": [
        {
          "ancestorTitles": [
            "With Error"
          ],
          "duration": 20,
          "failureMessages": [],
          "fullName": "With Error renders correctly",
          "location": null,
          "numPassingAsserts": 0,
          "status": "passed",
          "title": "renders correctly"
        },
        {
          "ancestorTitles": [
            "With Error"
          ],
          "duration": 4,
          "failureMessages": [
            "Error: \u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m).toEqual(\u001b[22m\u001b[32mexpected\u001b[39m\u001b[2m)\u001b[22m\n\nDifference:\n\n\u001b[32m- Expected\u001b[39m\n\u001b[31m+ Received\u001b[39m\n\n\u001b[32m- Expected Value\u001b[39m\n\u001b[31m+ Actual Value\u001b[39m\n    at Object.<anonymous> (/Users/tomi/Github/packages/luis-workspace/examples/proxies/src/tests/with_error.test.tsx:17:28)\n    at Object.asyncJestTest (/Users/tomi/Github/packages/luis-workspace/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)\n    at resolve (/Users/tomi/Github/packages/luis-workspace/node_modules/jest-jasmine2/build/queueRunner.js:43:12)\n    at new Promise (<anonymous>)\n    at mapper (/Users/tomi/Github/packages/luis-workspace/node_modules/jest-jasmine2/build/queueRunner.js:26:19)\n    at promise.then (/Users/tomi/Github/packages/luis-workspace/node_modules/jest-jasmine2/build/queueRunner.js:73:41)\n    at processTicksAndRejections (internal/process/next_tick.js:81:5)"
          ],
          "fullName": "With Error shows difference",
          "location": null,
          "numPassingAsserts": 0,
          "status": "failed",
          "title": "shows difference"
        },
        {
          "ancestorTitles": [
            "With Error"
          ],
          "duration": 2,
          "failureMessages": [
            "Error: \u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m).toEqual(\u001b[22m\u001b[32mexpected\u001b[39m\u001b[2m)\u001b[22m\n\nDifference:\n\n\u001b[32m- Expected\u001b[39m\n\u001b[31m+ Received\u001b[39m\n\n\u001b[2m  Object {\u001b[22m\n\u001b[32m-   \"bobo\": \"2\",\u001b[39m\n\u001b[31m+   \"bobo\": \"3\",\u001b[39m\n\u001b[2m    \"dodo\": \"5\",\u001b[22m\n\u001b[32m-   \"lolo\": \"rer\",\u001b[39m\n\u001b[2m    \"tomi\": \"1\",\u001b[22m\n\u001b[2m  }\u001b[22m\n    at Object.<anonymous> (/Users/tomi/Github/packages/luis-workspace/examples/proxies/src/tests/with_error.test.tsx:25:8)\n    at Object.asyncJestTest (/Users/tomi/Github/packages/luis-workspace/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)\n    at resolve (/Users/tomi/Github/packages/luis-workspace/node_modules/jest-jasmine2/build/queueRunner.js:43:12)\n    at new Promise (<anonymous>)\n    at mapper (/Users/tomi/Github/packages/luis-workspace/node_modules/jest-jasmine2/build/queueRunner.js:26:19)\n    at promise.then (/Users/tomi/Github/packages/luis-workspace/node_modules/jest-jasmine2/build/queueRunner.js:73:41)\n    at processTicksAndRejections (internal/process/next_tick.js:81:5)"
          ],
          "fullName": "With Error shows multiline difference",
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
      "testResults": [],
      "numFailingTests": 0,
      "numPassingTests": 0
    },
    {
      "testFilePath": "/tests/apollo.test",
      "testResults": [],
      "numFailingTests": 0,
      "numPassingTests": 0
    },
    {
      "testFilePath": "/tests/boo.test",
      "testResults": [],
      "numFailingTests": 0,
      "numPassingTests": 0
    },
    {
      "testFilePath": "/tests/foo.test",
      "testResults": [
        {
          "ancestorTitles": [
            "Component",
            "Foo"
          ],
          "duration": 22,
          "failureMessages": [
            "Error: \u001b[2mexpect(\u001b[22m\u001b[31mvalue\u001b[39m\u001b[2m).toMatchSnapshot()\u001b[22m\n\n\u001b[31mReceived value\u001b[39m does not match \u001b[32mstored snapshot \"Component Foo renders correctly: rendered 1\"\u001b[39m.\n\n\u001b[32m- Snapshot\u001b[39m\n\u001b[31m+ Received\u001b[39m\n\n\u001b[2m  <div>\u001b[22m\n\u001b[32m-   This is the component version\u001b[39m\n\u001b[31m+   <div\u001b[39m\n\u001b[31m+     className=\"ui red inverted top fixed menu\"\u001b[39m\n\u001b[31m+   >\u001b[39m\n\u001b[31m+     <div\u001b[39m\n\u001b[31m+       className=\"item\"\u001b[39m\n\u001b[31m+       onClick={[Function]}\u001b[39m\n\u001b[31m+     >\u001b[39m\n\u001b[31m+       Test\u001b[39m\n\u001b[31m+     </div>\u001b[39m\n\u001b[31m+     <a\u001b[39m\n\u001b[31m+       className=\"icon item\"\u001b[39m\n\u001b[31m+       onClick={[Function]}\u001b[39m\n\u001b[31m+     >\u001b[39m\n\u001b[31m+       <i\u001b[39m\n\u001b[31m+         aria-hidden=\"true\"\u001b[39m\n\u001b[31m+         className=\"plus icon\"\u001b[39m\n\u001b[31m+         onClick={[Function]}\u001b[39m\n\u001b[31m+       />\u001b[39m\n\u001b[31m+ \u001b[7m      \u001b[27m\u001b[39m\n\u001b[31m+     </a>\u001b[39m\n\u001b[31m+     <a\u001b[39m\n\u001b[31m+       className=\"icon item\"\u001b[39m\n\u001b[31m+       onClick={[Function]}\u001b[39m\n\u001b[31m+     >\u001b[39m\n\u001b[31m+       <i\u001b[39m\n\u001b[31m+         aria-hidden=\"true\"\u001b[39m\n\u001b[31m+         className=\"minus icon\"\u001b[39m\n\u001b[31m+         onClick={[Function]}\u001b[39m\n\u001b[31m+       />\u001b[39m\n\u001b[31m+ \u001b[7m      \u001b[27m\u001b[39m\n\u001b[31m+     </a>\u001b[39m\n\u001b[31m+   </div>\u001b[39m\n\u001b[31m+   <div\u001b[39m\n\u001b[31m+     style={\u001b[39m\n\u001b[31m+       Object {\u001b[39m\n\u001b[31m+         \"paddingTop\": \"40px\",\u001b[39m\n\u001b[31m+       }\u001b[39m\n\u001b[31m+     }\u001b[39m\n\u001b[31m+   >\u001b[39m\n\u001b[31m+     This is the component version ERROR:\u001b[7m \u001b[27m\u001b[39m\n\u001b[31m+     0\u001b[39m\n\u001b[31m+   </div>\u001b[39m\n\u001b[2m  </div>\u001b[22m\n    at Object.<anonymous> (/Users/tomi/Github/packages/luis-workspace/examples/proxies/src/tests/foo.test.tsx:14:23)\n    at Object.asyncJestTest (/Users/tomi/Github/packages/luis-workspace/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)\n    at resolve (/Users/tomi/Github/packages/luis-workspace/node_modules/jest-jasmine2/build/queueRunner.js:43:12)\n    at new Promise (<anonymous>)\n    at mapper (/Users/tomi/Github/packages/luis-workspace/node_modules/jest-jasmine2/build/queueRunner.js:26:19)\n    at promise.then (/Users/tomi/Github/packages/luis-workspace/node_modules/jest-jasmine2/build/queueRunner.js:73:41)\n    at processTicksAndRejections (internal/process/next_tick.js:81:5)"
          ],
          "fullName": "Component Foo renders correctly",
          "location": null,
          "numPassingAsserts": 0,
          "status": "failed",
          "title": "renders correctly"
        },
        {
          "ancestorTitles": [
            "Component",
            "Foo"
          ],
          "duration": 2,
          "failureMessages": [
            "Error: \u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m).toEqual(\u001b[22m\u001b[32mexpected\u001b[39m\u001b[2m)\u001b[22m\n\nDifference:\n\n\u001b[32m- Expected\u001b[39m\n\u001b[31m+ Received\u001b[39m\n\n\u001b[32m- Expected Value\u001b[39m\n\u001b[31m+ Actual Value\u001b[39m\n    at Object.<anonymous> (/Users/tomi/Github/packages/luis-workspace/examples/proxies/src/tests/foo.test.tsx:18:30)\n    at Object.asyncJestTest (/Users/tomi/Github/packages/luis-workspace/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)\n    at resolve (/Users/tomi/Github/packages/luis-workspace/node_modules/jest-jasmine2/build/queueRunner.js:43:12)\n    at new Promise (<anonymous>)\n    at mapper (/Users/tomi/Github/packages/luis-workspace/node_modules/jest-jasmine2/build/queueRunner.js:26:19)\n    at promise.then (/Users/tomi/Github/packages/luis-workspace/node_modules/jest-jasmine2/build/queueRunner.js:73:41)\n    at processTicksAndRejections (internal/process/next_tick.js:81:5)"
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
            "Error: \u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m\u001b[2m).toEqual(\u001b[22m\u001b[32mexpected\u001b[39m\u001b[2m)\u001b[22m\n\nDifference:\n\n\u001b[32m- Expected\u001b[39m\n\u001b[31m+ Received\u001b[39m\n\n\u001b[2m  Object {\u001b[22m\n\u001b[32m-   \"bobo\": \"2\",\u001b[39m\n\u001b[31m+   \"bobo\": \"3\",\u001b[39m\n\u001b[2m    \"dodo\": \"5\",\u001b[22m\n\u001b[32m-   \"lolo\": \"rer\",\u001b[39m\n\u001b[2m    \"tomi\": \"1\",\u001b[22m\n\u001b[2m  }\u001b[22m\n    at Object.<anonymous> (/Users/tomi/Github/packages/luis-workspace/examples/proxies/src/tests/foo.test.tsx:26:10)\n    at Object.asyncJestTest (/Users/tomi/Github/packages/luis-workspace/node_modules/jest-jasmine2/build/jasmineAsyncInstall.js:102:37)\n    at resolve (/Users/tomi/Github/packages/luis-workspace/node_modules/jest-jasmine2/build/queueRunner.js:43:12)\n    at new Promise (<anonymous>)\n    at mapper (/Users/tomi/Github/packages/luis-workspace/node_modules/jest-jasmine2/build/queueRunner.js:26:19)\n    at promise.then (/Users/tomi/Github/packages/luis-workspace/node_modules/jest-jasmine2/build/queueRunner.js:73:41)\n    at processTicksAndRejections (internal/process/next_tick.js:81:5)"
          ],
          "fullName": "Component Foo shows multiline difference",
          "location": null,
          "numPassingAsserts": 0,
          "status": "failed",
          "title": "shows multiline difference"
        }
      ],
      "numFailingTests": 3,
      "numPassingTests": 0
    }
  ]
}

module.exports.snapshots = {
    '/tests/with_actions.test':  require('./tests/__snapshots__/with_actions.test.tsx.snap'),
    '/tests/with_apollo.test':  require('./tests/__snapshots__/with_apollo.test.tsx.snap'),
    '/tests/with_context.test':  require('./tests/__snapshots__/with_context.test.tsx.snap'),
    '/tests/with_error.test':  require('./tests/__snapshots__/with_error.test.tsx.snap'),
}