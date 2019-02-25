import { renderLuis } from '../../client/components';

import './proxies'; // this sets up proxies

const { snapshots, report } = require('./summary');

renderLuis({
  snapshots,
  report,
  loadTests: () => require('~/**.test')
});
