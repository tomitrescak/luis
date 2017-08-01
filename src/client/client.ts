import 'tslib';
import { FuseBoxTestRunner, TestConfig } from 'fuse-test-runner';
import { render as renderLuis } from './luis/index';
import { initState, ModuleDefinition, TestModule } from './luis/state/state';
import { StoryType, Decorator } from './luis/state/story';

import {setStatefulModules} from 'fuse-box/modules/fuse-hmr';

const state = initState();

setStatefulModules((name: string) => {
  const stories = state.stories.filter(s => !s.hmr || s.hmr.test(name));
  if (stories.length) {
    stories.forEach(s => s.reload = true);
  }
  // Add the things you think are stateful:
  return /router/.test(name) || /state/.test(name);
});

const requests: { name: string, rerun: boolean}[] = [];

TestConfig.snapshotDir = '';
TestConfig.snapshotExtension = 'json';
TestConfig.snapshotCalls = null;
TestConfig.snapshotLoader = (name: string, className: string) => {
  var story = initState().findStoryByClassName(className);

  var index = name.indexOf('/tests');
  if (index >= 0) {
    name = name.substring(name.indexOf('/tests'));
  } else {
    name = '/tests/snapshots' + (name[0] === '/' ? '' : '/') + name;
  }

  // console.log(name);

  let val = FuseBox.import(name, (modules: {}) => {
    if (!requests.some(r => r.name === name && r.rerun === true)) {
      requests.push({ name, rerun: true });
      story.startTests();
    }
  });
  // if (!val) {
  //   console.clear();
  // }
  return val;
};

export function action(name: string, func?: () => string) {
  return function() {
    let args = Array.from(arguments);
    let state = initState();

    state.actions.push(`[${name}]: {${args.map(function(a) {
      if (a == Object(a)) {
        return a.constructor.name;
      }
      try {
        return JSON.stringify(a).substring(0, 20);
      } catch (ex) {
        return 'Circular';
      }}).join(', ')}}`);
    if (func) {
      state.actions.push(func());
    }
  }
}

export type ModuleImport = TestModule | any;

export function startTests(modules: ModuleImport[]) {
  // console.clear();
  
  // eliminate previous snapshot calls
  TestConfig.snapshotCalls = null;
  let converted: TestModule[] = modules.map(m => {
    if (m.module) {
      return { module: m.module, hmr: m.hmr };
    }
    return { module: m, hmr: null }
  });


  // process all modules and prepare them for testing
  initState().addModules(converted);
}

export function render() {
  renderLuis();
}

export function decorate(classes: StoryType[], folder: string, decorator: Decorator = null) {
  for (let cls of classes) {
    cls.folder = folder;
    cls.decorator = decorator;
  }
}

export { Story, Decorator } from './luis/state/story';

