import 'tslib';
import { FuseBoxTestRunner, TestConfig } from 'fuse-test-runner';
import { render as renderLuis } from './luis/index';
import { initState, ModuleDefinition } from './luis/state/state';
import { Story, StoryClass, Decorator } from './luis/state/story';

TestConfig.snapshotDir = '';
TestConfig.snapshotExtension = 'json';
TestConfig.snapshotCalls = null;
TestConfig.snapshotLoader = (name: string, className: string) => {
  var story = initState().findStoryByClassName(className);

  var index = name.indexOf('/tests');
  if (index >= 0) {
    name = name.substring(name.indexOf('/tests'));
  } else {
    name = '/tests/snapshots' + (name[0] == '/' ? '' : '/') + name;
  }

  // console.log(name);

  let val = FuseBox.import(name, (modules: any) => {
    setTimeout(story.startTests());
  });
  return val;
};

export function startTests(modules: any[]) {
  // eliminate previous snapshot calls
  TestConfig.snapshotCalls = null;
  
  // process all modules and prepare them for testing
  initState().addModules(modules);
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



