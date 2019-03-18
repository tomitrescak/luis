import { renderLuis } from 'luis';

const { snapshots, report } = require('./summary');
renderLuis({
  snapshots,
  report,
  loadTests: () => {
    // keep whatever your preference is
    // make sure these files are packed by your bundler
    // we pack following by fuse-box by default
    require('**.test');
    require('**.story');
    require('**.fixture');
  }
});
