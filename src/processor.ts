import { LuisReporter } from './reporter';

const rootDir = 'src';
const reporter = new LuisReporter(null, { path: process.env.SAVE_REPORT_PATH || rootDir });

module.exports = function(testData: jest.AggregatedResult) {
  return reporter.onRunComplete(null, testData);
};
