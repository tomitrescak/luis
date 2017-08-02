import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { getRootNode } from './helpers';
import { StoriesView } from './components/story';
import DevTools from 'mobx-react-devtools';
import { Provider } from 'mobx-react';

// import 'rc-collapse/assets/index.css';
import {initState } from './state/state';
import { reaction } from 'mobx';
import createRouter from './state/router';

let forceReload = 0;
export function render(root = 'react-root') {
  ReactDOM.render(
    <Provider state={initState()}>
      <div>
        <StoriesView forceReload={forceReload ++} />
        <DevTools />
      </div>
    </Provider>, 
    getRootNode(root));
}


/**
 * Routing
 */

const state = initState();

// rewrites urls
reaction(
  () => state.view.currentUrl,
  (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState(null, null, path);
    }
  }
);

const router = createRouter(state.view, {
  '/:pathName/:pathIds': ({pathName, pathIds}: any) => state.view.openStory(pathName, pathIds),
  '/:pathName/:pathIds/:snapshot': ({pathName, pathIds, snapshot}: any) => state.view.openStory(pathName, pathIds, snapshot),
  '/':             state.view.openStory
});

window.onpopstate = function historyChange(ev) {
  if (ev.type === 'popstate') {
    router(window.location.pathname);
  }
};

router(window.location.pathname);


// import { setStatefulModules } from './hmr';
// setStatefulModules(name => {
//   // Add the things you think are stateful:
//   return /state/.test(name);
// });

