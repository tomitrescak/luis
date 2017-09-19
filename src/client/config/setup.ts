export function setupHmr() {
  if (global.FuseBox) {
    const { setStatefulModules } = require('fuse-box/modules/fuse-hmr');
    console.log('Setup HMR');
    setStatefulModules((name: string) => {
      // console.log(name);
      // Add the things you think are stateful:
      return /router/.test(name) || /state/.test(name);
    });
  }
}
