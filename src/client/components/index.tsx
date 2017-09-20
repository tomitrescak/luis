import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Provider } from 'mobx-react';
import { setupLuis } from 'wafl';

import { Layout } from './layout';
import { initState } from '../config/state';
import { setupTestBridge, bdd } from '../config/bridge';

const state = initState();

setupLuis();
setupTestBridge(state, bdd);

export function renderLuis(root = '#react-root') {
  ReactDOM.render(
    <Provider state={state}>
      <Layout />     
    </Provider>,
    document.querySelector(root)
  );
}
