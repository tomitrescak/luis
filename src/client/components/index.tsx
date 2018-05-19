import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { Provider } from 'mobx-react';

import { Layout } from './layout';
import { initState, RenderOptions } from '../models/state_model';

const state = initState();

export function renderLuis(options: RenderOptions = {}) {
  state.renderOptions = options;
  ReactDOM.render(
    <Provider state={state}>
      <Layout localStorage={localStorage} />
    </Provider>,
    document.querySelector(options.root || '#react-root')
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
