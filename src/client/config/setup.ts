import {setStatefulModules} from 'fuse-box/modules/fuse-hmr';
setStatefulModules((name: string) => {
  // console.log(name);
  // Add the things you think are stateful:
  return /router/.test(name) || /state/.test(name);
});