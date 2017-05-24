import { types, IType } from 'mobx-state-tree';
import { IMSTNode } from 'mobx-state-tree/lib/core';
import { IModelType } from 'mobx-state-tree/lib/types/complex-types/object';
import { ISnapshottable } from 'mobx-state-tree/lib/types/type';
import { IObservableArray, computed, observable } from 'mobx';

import { formatComponent } from './helpers';
import { TestConfig } from 'fuse-test-runner';
import { Reporter, Task } from '../reporter';


import { ModuleDefinition, StoryDefinition } from './state';
import { TestType, FuseBoxWebTestRunner } from './fuse_web_test_runner';

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
  name = '';
  className = '';
  definition: {};
  info = '';
  folder = '';
  renderedComponent: () => JSX.Element;
  component: JSX.Element;
  actions: string[];
  tests: TestType[];
  snapshots: Snapshot[];
  decorator: Function;
  @observable activeSnapshot = 0;
  runningTests = false;
  hmr: RegExp;
  reload: boolean;

  constructor(name: string, className: string, definition: {}) {
    this.name = name;
    this.className = className;
    this.definition = definition;
    this.tests = [];
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

  setComponent(info: string, component: Function) {
    if (info) {
      this.info = '### Description\n\n' + info + '\n\n';
    }

    this.info += '### Usage';
    let wrapper = component;

    if (wrapper) {
      this.info += `
\`\`\`javascript
${formatComponent(wrapper)}
\`\`\`
      `;
    }

    this.renderedComponent = this.tryRender(component, this.decorator);
  }

  tryRender(component: Function, decorator: Function): () => JSX.Element {
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

