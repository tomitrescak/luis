import { renderLuis } from './client/components/index';

renderLuis({
  tests: () => require('~/**.test')
});
