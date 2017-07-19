import * as route from 'path-match';

export default function createRouter(view: any, routes: {}) {
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