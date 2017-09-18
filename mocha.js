const { setup, setupJsxControls} = require('wafl');

// setup mocha
require('chai-match-snapshot/mocha').setupMocha();

// setup app
setup();
setupJsxControls();