const { renderLuis } = require('./client/components/index');
const { snapshots, report } = require('./summary');

renderLuis({
  snapshots,
  report,
  tests: () => require('~/**.test')
});
