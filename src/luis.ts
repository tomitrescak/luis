import { renderLuis } from './client/components/index';

const testResults = require('./summary.json');
const snapshots = require('./snapshots');

renderLuis({
  testResults,
  snapshots,
  tests: () => require('~/**.test')
});
