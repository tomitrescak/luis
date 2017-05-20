
import { Story } from './state/story';
import { state } from './state/state';

export class StoryGroup {
  name: string;
  storyGroups?: StoryGroup[];
  stories: Story[];
  parent: StoryGroup;

  private _decorator?: any;

  constructor(name: string, parent?: StoryGroup) {
    this.stories = [];
    this.storyGroups = [];
    this.name = name;
    this.parent = parent;
  }

  get root() {
    let parent: StoryGroup = this;
    while (parent.parent != null) { parent = parent.parent; }
    return parent;
  }

  get decorator() {
    if (this._decorator) {
      return this._decorator;
    }
    if (this.parent) {
      return this.parent.decorator;
    }
    return null;
  }

  set decorator(dec: any) {
    this._decorator = dec;
  }



  addGroup(group: StoryGroup) {
    this.storyGroups.push(group);
    this.storyGroups.sort((a, b) => a.name < b.name ? -1 : 1);
  }
}

let parentGroup: StoryGroup = null;
let currentGroup: StoryGroup = null;
let currentStory: Story;

export function initParent() {
  parentGroup = new StoryGroup('List of UIS');
  currentGroup = parentGroup;
}

///////////////////////////////
// new functionality

export function describe(storyName, func, decorator) {

  // add to stories
  let storyGroup = currentGroup.storyGroups.find(s => s.name === storyName);

  if (!storyGroup) {
    storyGroup = new StoryGroup(storyName, currentGroup);
    currentGroup.addGroup(storyGroup);
  }
  currentGroup = storyGroup;

  // add decorator
  if (decorator) {
    currentGroup.decorator = decorator;
  }

  if (func()) {
    func();
  }

  currentGroup = currentGroup.parent;
  // currentGroup.storyGroups.sort((a, b) => a.name < b.name ? -1 : 1);


};

export function story(storyName: string, className: string, info: string | Function, component?: Function) {
  const story = new Story(
    storyName,
    component != null ? info as string : '',
    component != null ? component : info as Function,
    currentGroup.decorator);

  story.className = className;
  currentStory = story;
  currentGroup.stories.push(story);

  const runGroup = currentGroup;
}

export function decorator(decorator: any) {
  currentGroup.decorator = decorator;
}

export function changeStory(story: Story) {
  state.viewedStory = story;
}

export function stories(state: { runningTests: boolean }) {
  if (!state.runningTests) {
    // setTimeout
  }
  return parentGroup;
}

export function findStory(testPath: string[]): Story {
  if (!testPath) {
    return null;
  }
  // find the story
  const storyPath = [...testPath];
  let group = parentGroup;
  let story: Story = null;

  while (storyPath.length > 1) {
    if (storyPath.length > 2) {
      group = group.storyGroups.find(s => s.name === storyPath[0]);
    } else {
      story = group.stories.find(s => s.name === storyPath[0]);
    }
    storyPath.shift();
  }

  return story;
}

export function findTestPath(item: any): string[] {
  if (!item.cls || !item.cls.folder || !item.cls.story) {
    return null;
  }
  return [...item.cls.folder.split('/'), item.cls.story, item.title];
}

function recursive(path: string[], finalFn: Function, decorator: Function) {
    if (path.length == 0) {
        return finalFn;
    }
    var folder = path.shift();
    return () => describe(folder, recursive(path, finalFn, decorator), path.length === 0 ? decorator : null);
    
}

export function process(modules: any[]) {
  let obj = {};
  for (let mod of modules) {
    for (let n in mod) {
      let cls = mod[n];
      let name = cls.name;
      if (!name) { continue; }

      obj[name] = { [name]: cls };

      // add story
      if (cls['folder']) {
        const split = cls['folder'].split('/');
        const component = cls['createComponent'] ? cls['createComponent']() : cls['component'];
        let storyFn = () => story(cls['story'], cls.name, () => component);
        
        if (split.length == 1) {
          describe(cls['folder'], storyFn, cls['decorator']);
        } else {
          recursive(split, storyFn, cls['decorator'])();
        }
      }
    }
  }
  return obj;
}




