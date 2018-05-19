import { reaction } from 'mobx';
import * as route from 'path-match';

export default function createRouter(view: any, routes: any) {
  const matchers = Object.keys(routes).map(path => [route()(path), routes[path]]);
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

export function setupRouter(state: Luis.State) {
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
    '/:route?story=:name&test=:test&snapshot=:snapshot': ({ name, test, snapshot }: any) =>
      state.viewState.openSingleStory(name, test, snapshot),
    '/:route?stories=:name&test=:test&snapshot=:snapshot': ({ name, test, snapshot }: any) =>
      state.viewState.openStory(name, test, snapshot),
    '/:route?story=:name&test=:test': ({ name, test }: any) =>
      state.viewState.openSingleStory(name, test),
    '/:route?stories=:name&test=:test': ({ name, test }: any) =>
      state.viewState.openStory(name, test),
    '/:route?story=:name': ({ name }: any) => state.viewState.openSingleStory(name),
    '/:route?stories=:name': ({ name }: any) => state.viewState.openStory(name)

    // '/': state.viewState.openStory
  });

  window.onpopstate = function historyChange(ev) {
    if (ev.type === 'popstate') {
      router(window.location.pathname);
    }
  };
  router(window.location.pathname + window.location.search);
}
