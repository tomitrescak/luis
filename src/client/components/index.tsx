import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Provider } from 'mobx-react';

import { Layout } from './layout';
import { initState, RenderOptions } from '../models/state_model';

const state = initState();

export function renderLuis(options: RenderOptions = {}) {
  let root = document.querySelector(options.root || '#react-root');
  if (!root) {
    root = document.createElement('div');
    root.id = options.root || 'react-root';
    document.body.appendChild(root);
  }

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
