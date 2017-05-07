import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { getRootNode } from './helpers';
import { StoriesView } from './components/story';
import DevTools from 'mobx-react-devtools';

// import 'rc-collapse/assets/index.css';
import { state } from './state/state';

let forceReload = 0;
export function render(root = 'react-root') {
  ReactDOM.render(<div><StoriesView state={state} forceReload={forceReload ++} /><DevTools /></div>, getRootNode(root));
}

// import { setStatefulModules } from './hmr';
// setStatefulModules(name => {
//   // Add the things you think are stateful:
//   return /state/.test(name);
// });

