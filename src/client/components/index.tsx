import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Provider } from 'mobx-react';

import { Layout } from './layout';
import { initState, RenderOptions } from '../models/state_model';
import { setupRouter } from '../config/router';
import { buildBridge } from '../../bridge';

const state = initState();

export async function renderLuis(options: RenderOptions = {}) {
  buildBridge(options.report, options.snapshots);

  options.loadTests();

  let root = document.querySelector(options.root || '#react-root');
  if (!root) {
    root = document.createElement('div');
    root.id = options.root || 'react-root';
    document.body.appendChild(root);
  }

  // create new router
  setupRouter(state);

  // make sure the left bar refreshes
  state.liveRoot.version++;

  // render application
  ReactDOM.render(
    <Provider state={state}>
      <Layout localStorage={localStorage} />
    </Provider>,
    root
  );
}

export const Luis = ({ options = {} }) => {
  state.renderOptions = options;
  return (
    <Provider state={state}>
      <Layout localStorage={localStorage} />
    </Provider>
  );
};
