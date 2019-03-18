import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Provider } from 'mobx-react';

import { Layout } from './layout';
import { initState, RenderOptions } from '../models/state_model';
import { setupRouter } from '../config/router';
import { buildBridge } from '../../bridge';
import { ProxyStore } from '../models/proxy_store';
// import { setupHmr } from '../config/setup_hmr';

const state = initState();

// setupHmr();

export async function renderLuis(options: RenderOptions = {}) {
  let root = document.querySelector(options.root || '#react-root');
  if (!root) {
    root = document.createElement('div');
    root.id = options.root || 'react-root';
    document.body.appendChild(root);
  }

  // render application
  ReactDOM.render(<Luis options={options} />, root);
}

type Props = {
  options: RenderOptions;
};

export const Luis: React.FC<Props> = ({ options = {} }) => {
  state.renderOptions = options;

  buildBridge(options.report, options.snapshots);
  options.loadTests();

  // remember proxies
  if (options.proxies) {
    ProxyStore.init(options.proxies);
  }

  // create new router
  setupRouter(state);

  // make sure the left bar refreshes
  state.liveRoot.version++;

  return (
    <Provider state={state}>
      <Layout localStorage={localStorage} />
    </Provider>
  );
};
