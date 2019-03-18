import { renderLuis } from 'luis';

const { snapshots, report } = require('./summary');

renderLuis({
  snapshots,
  report,
  loadTests: () => {
    require('**.test');
  }
});
