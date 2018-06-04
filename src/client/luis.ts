import { renderLuis } from '../client/components/index';
import { setupTestBridge } from '.';

setupTestBridge();

import './css/semantic.min.css';
import './css/fonts.css';

import './components/tests';

renderLuis();
