import { renderLuis } from 'luis';

renderLuis({
  loadTests: () => {
    // remove whatever your preference is
    require('**.test');
    require('**.story');
    require('**.fixture');
  }
});