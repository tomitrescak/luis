// more info at: https://jasmine.github.io/tutorials/custom_reporter

var myReporter: jasmine.Reporter = {
  // THIS IS WHAT TYPE DEFINITION TELLS ME TO USE

  reportSpecStarting(_spec: jasmine.Spec) {},
  reportSpecResults(_spec: jasmine.Spec) {},
  reportRunnerResults(_runner: jasmine.Runner) {},
  reportRunnerStarting(_runner: jasmine.Runner) {},
  reportSuiteResults(_suite: jasmine.Suite) {},

  // THIS IS WHAT DOCUMENTATION TELLS ME TO USE

  // REMOVE THIS WHEN YOU WILL FIND OUT WHAT TO USE
  //@ts-ignore
  jasmineStarted: function(suiteInfo: jasmine.SuiteInfo) {
    console.log('Running suite with ' + suiteInfo.totalSpecsDefined);
  },

  suiteStarted: function(result: jasmine.CustomReporterResult) {
    console.log(
      'Suite started: ' + result.description + ' whose full description is: ' + result.fullName
    );
  },
  specStarted: function(result: jasmine.CustomReporterResult) {
    console.log(
      'Spec started: ' + result.description + ' whose full description is: ' + result.fullName
    );
  },
  specDone: function(result: jasmine.CustomReporterResult) {
    console.log('Spec: ' + result.description + ' was ' + result.status);

    for (var i = 0; i < result.failedExpectations.length; i++) {
      console.log('Failure: ' + result.failedExpectations[i].message);
      console.log(result.failedExpectations[i].stack);
    }
    console.log(result.passedExpectations.length);
  },
  suiteDone: function(result: jasmine.CustomReporterResult) {
    console.log('Suite: ' + result.description + ' was ' + result.status);
    for (var i = 0; i < result.failedExpectations.length; i++) {
      console.log('Suite ' + result.failedExpectations[i].message);
      console.log(result.failedExpectations[i].stack);
    }
  },
  jasmineDone: function(result: jasmine.CustomReporterResult) {
    console.log('Finished suite: ' + (result as any).overallStatus);
    for (var i = 0; i < result.failedExpectations.length; i++) {
      console.log('Global ' + result.failedExpectations[i].message);
      console.log(result.failedExpectations[i].stack);
    }
  }
};
jasmine.getEnv().addReporter(myReporter);
