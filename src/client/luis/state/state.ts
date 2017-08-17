// we need to register the proxy functions

import { IObservableArray, computed, observable } from 'mobx';
import { Reporter } from '../reporter';

import { ViewState } from './view_state';
import { StoryType, Story } from './story';

export type ModuleDefinition = {
  [index: string]: typeof Story;
};

export type FolderType = {
  name: string;
  parent: FolderType;
  folders: IObservableArray<FolderType>;
  stories: IObservableArray<StoryType>;
  allStories: StoryType[];
};

export class Folder {
  name: string;
  folders: Folder[];
  stories: StoryType[];
  parent: Folder;

  constructor(name: string = 'root', parent?: Folder) {
    this.name = name;
    this.parent = parent;
    this.folders = [];
    this.stories = [];
  }
}

export type TestModule = {
  module: ModuleDefinition;
  hmr?: RegExp;
};

// const storyMap = new Map();

export class StateType {
  @observable hidePassing = false;
  @observable runningTests = false;
  @observable snapshotView = 'react';
  @observable snapshotPanes = 'both';
  @observable actions: IObservableArray<string>;

  view: ViewState;
  root: Folder;
  stories: StoryType[];
  timeout: any;
  selectedTab: number;
  _testConfig: string[][];

  constructor() {
    this.view = new ViewState(this); // .create();
    this.root = new Folder();
    this.stories = observable([]);
    this.actions = observable([]);

    this.snapshotView = this.view.selectedSnapshot >= 0 ? 'html' : 'react';
  }

  get passingTests(): number {
    return this.stories.reduce((prev, next) => prev + next.passingTests, 0);
  }

  get failingTests(): number {
    return this.stories.reduce((prev, next) => prev + next.failingTests, 0);
  }

  get activeStory(): StoryType {
    let activeKey: string = null;
    const root = state.root;

    let story: StoryType;
    let storyPath = this.view.selectedStoryId;
    if (storyPath && storyPath.length) {
      // select by path
      activeKey = storyPath[0].toString();
      let folder = root.folders[storyPath[0]];

      for (let i = 1; i < storyPath.length - 1; i++) {
        folder = folder.folders[storyPath[i]];

        if (!folder) {
          // location.href = '/';
          return null;
        }
      }

      // now find the story
      story = folder.stories[storyPath[storyPath.length - 1]];
      if (!story) {
        // location.href = '/';
        return null;
      }
    }

    return story;
  }

  get testConfig() {
    if (this._testConfig == null) {
      let testConfig = localStorage.getItem('louisTestConfig');
      if (testConfig == null) {
        testConfig = '';
        localStorage.setItem('louisTestConfig', testConfig);
      }
      this._testConfig = testConfig.split('|').map(s => s.split('#'));
    }
    return this._testConfig;
  }

  toggleAllTests(disabled: boolean) {
    this.stories.forEach(s => s.isDisabled = disabled);
    this.saveStoryConfig();
  }

  toggleStoryTests(story: StoryType, disabled: boolean) {
    story.isDisabled = disabled;
    this.saveStoryConfig();
  }

  saveStoryConfig() {
    this._testConfig = this.stories.map(s => [s.name, s.isDisabled ? '1' : '0' ]);
    localStorage.setItem('louisTestConfig', this._testConfig.map(t => t.join('#')).join('|'));
  }

  startedTests() {
    this.runningTests = true;
  }

  finishedTests() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => (this.runningTests = false), 300);
  }

  findStoryByClassName(className: string) {
    return this.stories.find(s => s.className === className);
  }

  addModules(modules: TestModule[]) {
    for (let mod of modules) {
      // tslint:disable-next-line:forin
      for (let className in mod.module) {
        let storyDefinition = mod.module[className];
        let story = new mod.module[className]();
        let storyName = story.story;
        if (!storyName) {
          console.warn(`Class ${className}'s does not define 'story' name`);
          continue;
        }
        let folder = story.folder;
        if (!folder) {
          console.warn(`Class ${className}'s does not define 'folder' name`);
          continue;
        }

        // add story
        if (story.folder) {
          const component = story.component;
          const folder = story.folder;

          // find given folder
          const folderParts = folder.split('/');
          let parentFolder = this.root;
          while (folderParts.length > 0) {
            let folderName = folderParts.shift();
            let findFolder = parentFolder.folders.find(f => f.name === folderName);
            if (!findFolder) {
              findFolder = new Folder(folderName, parentFolder);
              parentFolder.folders.push(findFolder);

              // sort immediately
              parentFolder.folders.sort((a, b) => (a.name > b.name ? 1 : -1));
            }
            parentFolder = findFolder;
          }

          // we only restart tests on required files
          let existingStory = parentFolder.stories.find(s => s.name === storyName);
          let isStoryDisabled = this.testConfig.some(t => t[0] == storyName && t[1] == '1');
          if (!existingStory || existingStory.reload) {
            // create a new story
            // debugger;
            let newStory = new StoryType(
              storyName,
              folder,
              className,
              { [className]: storyDefinition },
              story,
              isStoryDisabled
            );
            newStory.setComponent(story);
            newStory.hmr = mod.hmr;
            // add to folder
            let index = parentFolder.stories.findIndex(s => s.name === newStory.name);
            if (index >= 0) {
              parentFolder.stories[index] = newStory;
              this.stories[this.stories.findIndex(s => s.name === newStory.name)] = newStory;
            } else {
              parentFolder.stories.push(newStory);
              parentFolder.stories.sort((a, b) => (a.name > b.name ? 1 : -1));
              this.stories.push(newStory);
              this.stories.sort((a, b) => (a.name > b.name ? 1 : -1));
            }

            // start tests asynchronously
            // setTimeout(() => story.startTests(), 1);
            newStory.reload = false;
            TestQueue.add(newStory);
          }
        }
      }
    }
  }
}

export const TestQueue = {
  queue: [] as StoryType[],
  running: false,
  add(story: StoryType) {
    // if we do not want to run tests we skip it
    if (story.isDisabled) {
      return;
    }
    TestQueue.queue.push(story);
    if (!TestQueue.running) {
      TestQueue.processQueue();
    }
  },
  async processQueue() {
    if (TestQueue.queue.length > 0) {
      TestQueue.running = true;
      let story = TestQueue.queue.shift();
      try {
        await story.startTests();
      } finally {
        TestQueue.processQueue();
      }
    } else {
      TestQueue.running = false;
    }
  }
};

let state: StateType;

export function initState() {
  if (state == null) {
    state = new StateType();
  }
  return state;
}
