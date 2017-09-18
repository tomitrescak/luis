import { observable, action } from 'mobx';
import { SemanticCOLORS } from 'semantic-ui-react';

export type Impl = () => void;

export class TestGroup {
  name: string;
  groups: TestGroup[];
  tests: Test[];
  parent: TestGroup;

  beforeAll: Impl;
  before: Impl;
  beforeEach: Impl;

  afterAll: Impl;
  after: Impl;
  afterEach: Impl;

  startTime: number;
  endTime: number;
  @observable duration: number = 0;
  @observable version: number = 0;
  @observable passingTests = 0;
  @observable failingTests = 0;

  noSpaceName: string;

  constructor(parent: TestGroup, name: string) {
    this.parent = parent;
    this.name = name;
    this.tests = observable([]);
    this.groups = observable([]);
    this.noSpaceName = name.replace(/\s/g, '');

    if (parent) {
      parent.groups.push(this);
    }
  }

  get fileName(): string {
    return (this.parent == null || this.parent.parent == null ? '' : (this.parent.fileName + '_')) + this.noSpaceName;
  }

  get path(): string {
    if (this.parent == null) {
      return '';
    }
    return (this.parent == null || this.parent.parent == null ? '' : (this.parent.path + ' > ')) + this.name;
  }

  get isRoot() {
    return this.parent == null;
  }

  get icon(): { name: string, color: SemanticCOLORS } {
    return {
      name: 'check',
      color: 'green'
    }
  }

  get color() {
    const passing = this.countTests(true);
    const failing = this.countTests(false);
    if (failing == 0) {
      return 'green';
    } else if (passing == 0) {
      return 'red';
    } else return 'orange';
  }

  /**
   * Decides where in the update tree the new group will be put
   * If it is the top level group it depends whether it is a completely new group
   * or one that is being updated
   * 
   * @param {string} groupName 
   * @param {App.State} state 
   * @returns 
   * @memberof TestGroup
   */
  getGroup(name: string, state: App.State) {
    let possibleRoot = state.currentGroup.groups.find(g => g.name === name);
    return possibleRoot ? possibleRoot : new TestGroup(state.currentGroup, name);
  }

  countTests(passing: boolean) {
    let count = 0;
    const queue: TestGroup[] = [this];
    while (queue.length > 0) {
      let current = queue.shift();
      for (let group of current.groups) {
        for (let test of group.tests) {
          if (passing && test.error == null) {
            count ++;
          } else if (!passing && test.error != null) {
            count ++;
          }
        }
        queue.push(group);
      }
    }
    return count;
  }

  @action updateCounts() {
    this.passingTests = this.countTests(true);
    this.failingTests = this.countTests(false);
  }
}

export class Story extends TestGroup {
  component: JSX.Element;
}

export class Test {
  name: string;
  impl: () => void;
  snapshots: Snapshot[];
  group: TestGroup;
  error: Error;

  startTime: number;
  endTime: number;
  @observable duration: number = 0;

  constructor(name: string, group: TestGroup, impl: () => void) {
    this.name = name;
    this.impl = impl;
    this.snapshots = [];
    this.group = group;
  }

  get icon(): { name: string, color: SemanticCOLORS } {
    return {
      name: this.error ? 'remove' : 'check',
      color: this.error ? 'red' : 'green'
    }
  }
}

export class Snapshot {
  name: string;
  expected: string;
  current: string;
  matching?: boolean;
}