import { renderLuis } from '../client/components';

const { snapshots, report } = require('./summary');

renderLuis({
  snapshots,
  report,
  loadTests: () => require('~/**.test')
});
