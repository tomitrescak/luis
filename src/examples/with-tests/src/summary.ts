module.exports.report = {
  "numFailedTests": 0,
  "numPassedTests": 1,
  "numTotalTests": 1,
  "testResults": [
    {
      "testFilePath": "/components/stories/greeting.test",
      "testResults": [
        {
          "ancestorTitles": [
            "Greeting"
          ],
          "duration": 10,
          "failureMessages": [],
          "fullName": "Greeting renders correctly",
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
      "testFilePath": "/examples/with-tests/src/components/stories/greeting.test",
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
        }
      ],
      "numFailingTests": 0,
      "numPassingTests": 1
    }
  ]
}

module.exports.snapshots = {
    '/components/stories/greeting.test':  require('./components/stories/__snapshots__/greeting.test.tsx.snap'),
}