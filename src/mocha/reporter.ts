// my-reporter.js
import * as mocha from 'mocha';

function LuisReporter(this: mocha.reporters.Base, runner: mocha.IRunner) {
  mocha.reporters.Base.call(this, runner);
  var passes = 0;
  var failures = 0;

  runner.on('pass', function(test) {
    passes++;
    console.log('pass: %s', test.fullTitle());
  });

  runner.on('fail', function(test, err) {
    failures++;
    console.log('fail: %s -- error: %s', test.fullTitle(), err.message);
  });

  runner.on('end', function() {
    console.log('end: %d/%d', passes, passes + failures);
  });
}

module.exports = LuisReporter;
