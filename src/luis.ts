import { renderLuis } from './client/components/index';

renderLuis({
  ...require('./summary'),
  tests: () => require('~/**.test')
});
