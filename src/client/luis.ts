import { renderLuis } from '../client/components/index';
import { setupTestBridge } from './index';

const testResults = FuseBox.import('~/test_results.json');

setupTestBridge(testResults);

import '~/**/tests/**';

renderLuis();
