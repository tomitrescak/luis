import 'tslib';
import { config } from 'chai-match-snapshot';
import { render as renderLuis } from './luis/index';
import { initState, ModuleDefinition, TestModule, TestQueue } from './luis/state/state';
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

const requests: { name: string, requestReturned?: boolean}[] = [];

config.snapshotDir = '';
config.snapshotExtension = 'json';
config.snapshotCalls = null;
config.snapshotLoader = (name: string, className: string) => {
  var story = initState().findStoryByClassName(className);

  var index = name.indexOf('/tests');
  if (index >= 0) {
    name = name.substring(name.indexOf('/tests'));
  } else {
    name = '/tests/snapshots' + (name[0] === '/' ? '' : '/') + name;
  }

  let request = requests.find(r => r.name === name);
  if (!request) {
    request = { name, requestReturned: false };
    requests.push(request);
  }

  // console.log(name);
  let val = FuseBox.import(name, (modules: {}) => {
    if (!request.requestReturned) {
      request.requestReturned = true;
      TestQueue.add(story);
    }
  });

  if (!request.requestReturned) {
    throw new Error('Snapshot request pending');
  }
  // if (!val) {
  //   console.clear();
  // }
  return val;
};

export function action(name: string, func?: (...args: any[]) => string) {
  return function(...args: any[]) {
    if (func) {
      state.actions.push(`[${name}]: ${func.apply(null, args)}`);
    } else {
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
    }
  }
}

export const monitor = action;

export type ModuleImport = TestModule | any;

export function startTests(modules: ModuleImport[]) {
  // console.clear();
  
  // eliminate previous snapshot calls
  config.snapshotCalls = null;
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

