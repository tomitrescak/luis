import { reaction } from 'mobx';
import * as route from 'path-match';
import { initState } from './state';

export default function createRouter(view: any, routes: any) {
  const matchers = Object.keys(routes).map(path => ([route()(path), routes[path]]));
  return function(path: string) {
    return matchers.some(([matcher, f]) => {
      const result = matcher(path);
      if (result === false) {
        return false;
      }
      f.call(view, result);
      return true;
    });
  };
}

export function setupRouter(state: App.State) {
  // rewrites urls
  reaction(
    () => state.viewState.currentUrl,
    path => {
      if (window.location.pathname !== path) {
        window.history.pushState(null, null, path);
      }
    }
  );

  const router = createRouter(state.viewState, {
    '/:name': ({ name }: any) => state.viewState.openStory(name),
    '/:name/:snapshotName/:snapshot': ({ name, snapshotName, snapshot }: any) =>
      state.viewState.openStory(name, snapshotName, snapshot),
    // '/': state.viewState.openStory
  });

  window.onpopstate = function historyChange(ev) {
    if (ev.type === 'popstate') {
      router(window.location.pathname);
    }
  };
  router(window.location.pathname);
}