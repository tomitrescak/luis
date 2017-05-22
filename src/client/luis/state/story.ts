import { types, IType } from 'mobx-state-tree';
import { IMSTNode } from "mobx-state-tree/lib/core";
import { IModelType } from "mobx-state-tree/lib/types/complex-types/object";
import { ISnapshottable } from "mobx-state-tree/lib/types/type";
import { IObservableArray } from 'mobx';

import { formatComponent } from './helpers';
import { FuseBoxTestRunner } from "fuse-test-runner";
import { Reporter } from "../reporter";

export type Decorator = (story: Function) => JSX.Element;

export type Snapshot = {
  current: string;
  expected: string;
  name: string;
  storyName: string;
  matching: boolean;
  html: string;
}

export class StoryClass {
  static component: JSX.Element;
  static folder: string;
  static story: string;
  static decorator: Decorator;
}

export const Test = types.model({
  name: '',
  result: ''
});

export type TestType = typeof Test.Type;

export const Story = types.model(
  {
    name: '',
    className: '',
    definition: types.frozen,
    info: '',
    renderedComponent: types.frozen,
    component: types.frozen,
    actions: types.array(types.string),
    tests: types.array(Test),
    snapshots: types.frozen as IType<Snapshot[], Snapshot[]>,
    decorator: types.frozen as IType<Function, Function>,
    activeSnapshot: 0,
    runningTests: false,
    get passingTests(): number {
      return this.tests.filter(w => w.result == null).length;
    },
    get failingTests(): number {
      return this.tests.filter(w => w.result != null).length;
    }
  },
  {
    startTests() {
      const runner = new FuseBoxTestRunner({ reporter: Reporter });
      this.runningTests = true;
      runner.startTests({ [this.className]: this.definition });
    },
    isRunning(value: boolean) {
      this.runningTests = value;
    },
    setComponent(info: string, component: Function) {
      if (info) {
        this.info = '### Description\n\n' + info + '\n\n';
      }

      this.info += '### Usage';
      let wrapper = component();

      if (wrapper) {
        this.info += `
\`\`\`javascript
${formatComponent(wrapper)}
\`\`\`
      `;
      }

      this.renderedComponent = this.tryRender(component, this.decorator);
    },
    tryRender(component: Function, decorator: Function): object {
      return () => {
        try {
          return decorator ? decorator(() => component(false)) : component(false);
        } catch (ex) {
          console.error(ex);
          return 'Error: ' + ex.message;
        }
      };
    }
  }
);

export type StoryType = typeof Story.Type;
