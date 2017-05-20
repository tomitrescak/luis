import 'tslib';
import { FuseBoxTestRunner, TestConfig } from 'fuse-test-runner';
import { render as renderLuis } from './luis/index';
import { Reporter } from './luis/reporter';
import { state } from './luis/state/state';
import { process, initParent } from './luis/louis';
import { Story, StoryClass, Decorator } from './luis/state/story';

// let myGlobal: any = global;
// myGlobal.$_stubs_$ = {};
// function proxyRequire(require, path) {
//   let parts = path.split('/');
//   let el = parts[parts.length - 1];
//   return myGlobal.$_stubs_$[el] || require(path);
// };
// myGlobal.proxyRequire = proxyRequire;

// myGlobal.jest = {
//   mock(path, impl) {
//     let parts = path.split('/');
//     myGlobal.$_stubs_$[parts[parts.length - 1]] = impl();
//   },
//   unmock(path) {
//     let parts = path.split('/');
//     myGlobal.$_stubs_$[parts[parts.length - 1]] = null;
//   }
// };

TestConfig.snapshotDir = '';
TestConfig.snapshotExtension = 'json';
TestConfig.snapshotCalls = null;
TestConfig.snapshotLoader = (name: string, className: string) => {
  if (state.requests[className] == null) {
    state.requests[className] = {
      requesting: true
    };
  };
  var index = name.indexOf('/tests');
  if (index >= 0) {
    name = name.substring(name.indexOf('/tests'));
  } else {
    name = '/tests/snapshots' + (name[0] == '/' ? '' : '/') + name;
  }

  // console.log(name);

  let val = FuseBox.import(name, m => {
    let test = { [className]: state.tests[className] };
    state.runner.startTests(test);
    state.requests[className].requesting = false;
  });
  return val;
};

state.runner = new FuseBoxTestRunner({ reporter: Reporter });

export function startTests(modules: any[]) {
  // eliminate previous snapshot calls
  TestConfig.snapshotCalls = null;

  // create a new parent
  initParent();
  
  // process all modules and prepare them for testing
  const processed = process(modules);
  state.tests = processed;

  state.runner.startTests(state.tests);
}

export function render() {
  renderLuis();
}

export function decorate(classes: (typeof StoryClass)[], folder: string, decorator: Decorator = null) {
  for (let cls of classes) {
    cls.folder = folder;
    cls.decorator = decorator;
  }
}

export { Story, StoryClass, Decorator } from './luis/state/story';



