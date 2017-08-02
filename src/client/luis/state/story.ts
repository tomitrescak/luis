import { IObservableArray, computed, observable } from 'mobx';

import { formatComponent } from './helpers';
import { config } from 'chai-match-snapshot';
import { Reporter, Task } from '../reporter';


import { ModuleDefinition } from './state';
import { TestType, FuseBoxWebTestRunner } from './fuse_web_test_runner';

export class Story {
  // tslint:disable-next-line:no-any
  [key: string]: any;
  story: string;
  info: string;
  folder: string;
  get component(): JSX.Element { return null; };
}

export type Decorator = (story: Function) => JSX.Element;

export type Snapshot = {
  current: string;
  expected: string;
  name: string;
  storyName: string;
  matching: boolean;
  html: string;
};

// export class StoryClass {
//   [index: string]: Function;

//   static component: JSX.Element;
//   static folder: string;
//   static story: string;
//   static decorator: Decorator;
// }


export class StoryType {
  // @observable activeSnapshot = 0;
  @observable snapshots = [] as IObservableArray<Snapshot>;
  actions: string[] = [];
  background = 'white';
  className = '';
  cssClassName = '';
  component: JSX.Element;
  decorator: React.StatelessComponent<any>;
  definition: {};
  folder = '';
  hmr: RegExp;
  info = '';
  name = '';
  reload: boolean;
  renderedComponent: () => JSX.Element;
  runningTests = false;
  tests: TestType[];
  isSelected: true;

  constructor(name: string, className: string, definition: {}, story: Story) {
    this.name = name;
    this.className = className;
    this.definition = definition;
    this.tests = [];
    this.background = story.background;
    this.cssClassName = story.css;
  }

  get passingTests(): number {
    return this.tests.filter(w => !w.result).length;
  }

  get failingTests(): number {
    return this.tests.filter(w => w.result).length;
  }

  addTest(test: TestType) {
    this.tests.push(test);
  }

  startTests() {
    const runner = new FuseBoxWebTestRunner({ reporter: new Reporter() });
    this.runningTests = true;
    setTimeout(() => runner.startTests([this.definition]), 1);
  }

  isRunning(value: boolean) {
    this.runningTests = value;
  }

  setComponent(story: Story) {
    if (story.info) {
      this.info = '### Description\n\n' + story.info + '\n\n';
    }

    this.info += '### Usage';
    this.decorator = story.decorator;
    let wrapper = story.component;

    if (wrapper) {
      this.info += `
\`\`\`javascript
${formatComponent(wrapper)}
\`\`\`
      `;
    }

    this.renderedComponent = this.tryRender(story.component, story.decorator);
  }

  tryRender(component: JSX.Element, decorator: Function): () => JSX.Element {
    return () => {
      try {
        return decorator ? decorator(() => component) : component;
      } catch (ex) {
        // tslint:disable-next-line:no-console
        console.error(ex);
        return 'Error: ' + ex.message;
      }
    };
  }
}

