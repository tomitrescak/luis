import { reaction } from 'mobx';

const reg = /\/\?([^=]+)=([^&]+)(\&test=([^&]+))?(\&snapshot=([^&]+))?(\&view=([^&]+))?(\&fullscreen=([^&]+))?/;

export default function createRouter(state: Luis.State) {
  return function(path: string) {
    let match = path.match(reg);

    if (match) {
      let viewType = match[1];
      let name = match[2];
      let test = match[4];
      let snapshot = match[6];
      // let view = match[8];
      let fullscreen = match[10];
      state.viewState.openStory(name, test, snapshot, viewType === 'story', fullscreen === 'true');
    }
    return true;
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

  const router = createRouter(state);

  window.onpopstate = function historyChange(ev) {
    if (ev.type === 'popstate') {
      router(window.location.pathname + window.location.search);
    }
  };
  router(window.location.pathname + window.location.search);
}
