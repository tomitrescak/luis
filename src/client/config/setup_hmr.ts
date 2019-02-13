import { setStatefulModules } from 'fuse-box/modules/fuse-hmr';

export function setupHmr() {
  if (setStatefulModules) {
    setStatefulModules(name => {
      // Add the things you think are stateful:
      return /router/.test(name) || /state/.test(name);
    });
  }
}
