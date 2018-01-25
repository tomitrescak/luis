const { setup, setupJsxControls} = require('wafl');

// setup compiler
process.env.TS_NODE_FAST = true;
require('ts-node/register');

// setup snapshots for mocha
require('chai-match-snapshot/mocha').setupMocha();

// setup app
setup({
  snapshotMode: 'tcp'
});
setupJsxControls();