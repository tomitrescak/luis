module.exports.report = {
  "numFailedTests": 4,
  "numPassedTests": 0,
  "testResults": [
    {
      "testFilePath": "/components/tests/greeting.test",
      "testResults": [
        {
          "ancestorTitles": [
            "Greeting"
          ],
          "duration": 9,
          "failureMessages": [
            "Greeting renders correctly\nAssertionError: Snapshot didn't match\n\u001b- Expected\u001b\n\u001b+ Received\u001b\n\n\u001b  \u001b\n\u001b  <div>\u001b\n\u001b-   Hello1\u001b \u001b\u001b\n\u001b+   Hello\u001b \u001b\u001b\n\u001b    Tomas\u001b\n\u001b  </div>\u001b\n\u001b  \u001b\n    at module.exports (/Users/tomi/Github/packages/luis-workspace/node_modules/mocha-jest-snapshots/src/matchSnapshot.js:35:13)\n    at Proxy.<anonymous> (/Users/tomi/Github/packages/luis-workspace/node_modules/mocha-jest-snapshots/src/index.js:24:3)\n    at Proxy.methodWrapper (/Users/tomi/Github/packages/luis-workspace/node_modules/chai/lib/chai/utils/addMethod.js:57:25)\n    at Context.<anonymous> (src/components/tests/greeting.test.tsx:20:38)\n    at Test.Runnable.run (/Users/tomi/Github/packages/luis-workspace/node_modules/mocha-jest-snapshots/src/index.js:19:22)"
          ],
          "fullName": "Greeting renders correctly",
          "numPassingAsserts": 1,
          "status": "failed",
          "title": "renders correctly"
        },
        {
          "ancestorTitles": [
            "Greeting"
          ],
          "duration": 1,
          "failureMessages": [
            "Greeting fails\nAssertionError: expected '123' to equal '456'\n\u001b- Expected\u001b\n\u001b+ Received\u001b\n\n\u001b- 456\u001b\n\u001b+ 123\u001b\n    at Context.<anonymous> (src/components/tests/greeting.test.tsx:24:22)\n    at Test.Runnable.run (/Users/tomi/Github/packages/luis-workspace/node_modules/mocha-jest-snapshots/src/index.js:19:22)"
          ],
          "fullName": "Greeting fails",
          "numPassingAsserts": 1,
          "status": "failed",
          "title": "fails"
        },
        {
          "ancestorTitles": [
            "Greeting"
          ],
          "duration": 1,
          "failureMessages": [
            "Greeting fails multiline\nAssertionError: expected { a: 1, b: 2, c: 3 } to equal { a: 1, b: 3, d: 4, c: 3, e: 6 }\n\u001b- Expected\u001b\n\u001b+ Received\u001b\n\n\u001b  {\u001b\n\u001b    \"a\": 1\u001b\n\u001b-   \"b\": 3\u001b\n\u001b+   \"b\": 2\u001b\n\u001b    \"c\": 3\u001b\n\u001b-   \"d\": 4\u001b\n\u001b-   \"e\": 6\u001b\n\u001b  }\u001b\n    at Context.<anonymous> (src/components/tests/greeting.test.tsx:32:11)\n    at Test.Runnable.run (/Users/tomi/Github/packages/luis-workspace/node_modules/mocha-jest-snapshots/src/index.js:19:22)"
          ],
          "fullName": "Greeting fails multiline",
          "numPassingAsserts": 1,
          "status": "failed",
          "title": "fails multiline"
        },
        {
          "ancestorTitles": [
            "Greeting"
          ],
          "duration": 1,
          "failureMessages": [
            "Greeting fails message\nAssertionError: expected 123 to be above 456\n    at Context.<anonymous> (src/components/tests/greeting.test.tsx:42:23)\n    at Test.Runnable.run (/Users/tomi/Github/packages/luis-workspace/node_modules/mocha-jest-snapshots/src/index.js:19:22)"
          ],
          "fullName": "Greeting fails message",
          "numPassingAsserts": 1,
          "status": "failed",
          "title": "fails message"
        }
      ],
      "numFailingTests": 4,
      "numPassingTests": 0
    }
  ]
}

module.exports.snapshots = {
  '/components/tests/greeting.test':  require('./components/tests/__snapshots__/greeting.test.tsx.snap'),
}