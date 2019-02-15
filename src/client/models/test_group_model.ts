import { observable, computed, action } from 'mobx';
import { SemanticCOLORS } from 'semantic-ui-react';

import { TestItem, Impl, toUrlName } from './test_item_model';
import { Test } from './test_model';
import { Snapshot } from './snapshot_model';

const sortGroups = (a: TestGroup, b: TestGroup) =>
  a.groups.length == 0 && a.tests.length == 0 && (b.groups.length != 0 || b.tests.length != 0)
    ? 1
    : (a.groups.length != 0 || a.tests.length != 0) && b.groups.length == 0 && b.tests.length == 0
    ? -1
    : a.path < b.path
    ? -1
    : 1;

export class TestGroup extends TestItem {
  name: string;
  urlName: string;
  pathName: string;
  parent: TestGroup;

  groups: TestGroup[];
  tests: Test[];

  beforeAll: Impl;
  before: Impl;
  beforeEach: Impl;

  afterAll: Impl;
  after: Impl;
  afterEach: Impl;

  @observable version: number = 0;
  @observable passingTests = 0;
  @observable failingTests = 0;

  component: JSX.Element;
  decorator?: React.SFC;
  cssClassName: string;
  info: string;

  constructor(parent: TestGroup, name: string, story?: StoryConfig) {
    super(name, parent);
    this.tests = [];
    this.groups = [];
    this.urlName = toUrlName(name);
    this.pathName = toUrlName(name, false).replace(/-/g, '');
    if (parent) {
      parent.groups.push(this);
      parent.groups.sort(sortGroups);
    }

    if (story) {
      this.initStory(story);
    }
  }

  initStory(props: StoryConfig) {
    this.component =
      props.component ||
      (props.componentWithData &&
        ((props.componentWithData() as any).component || props.componentWithData()));
    if (!this.component) {
      throw new Error(
        `Story "${name}" needs to either define a "get component()" or "componentWithData()"`
      );
    }
    this.info = props.info;
    this.decorator = props.decorator;
    this.cssClassName = props.cssClassName;
  }

  @computed
  get duration() {
    let tests = this.allTests;
    return tests.reduce((prev, next) => prev + next.duration, 0);
  }

  get nestedGroupsWithTests() {
    const groups = this.findGroups(g => g.component != null || g.tests.length > 0);
    groups.sort(sortGroups);
    return groups;
  }

  get fileName(): string {
    return (
      (this.parent == null || this.parent.parent == null ? '' : this.parent.fileName + '_') +
      this.pathName
    );
  }

  get path(): string {
    if (this.parent == null) {
      return '';
    }
    return (
      (this.parent == null || this.parent.parent == null ? '' : this.parent.path + ' > ') +
      this.name
    );
  }

  get simplePath(): string {
    if (this.parent == null) {
      return this.name;
    }
    return (
      (this.parent == null || this.parent.parent == null ? '' : this.parent.simplePath + ' ') +
      this.name
    );
  }

  get isRoot() {
    return this.parent == null;
  }

  get icon(): { name: string; color: SemanticCOLORS } {
    return {
      name: 'check',
      color: 'green'
    };
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

  get snapshots() {
    let snapshots: { [index: string]: string } = {};
    this.tests.forEach(t => t.snapshots.forEach(s => (snapshots[s.originalName] = s.current)));
    return snapshots;
  }

  get allSnapshots() {
    let snapshots: Snapshot[] = [];
    this.tests.forEach(t => t.snapshots.forEach(s => snapshots.push(s)));
    return snapshots;
  }

  get allTests() {
    let tests: Test[] = [...this.tests];
    this.groups.forEach(g => (tests = tests.concat(g.allTests)));
    return tests;
  }

  findGroup(test: (group: TestGroup) => boolean): TestGroup {
    const queue: TestGroup[] = [this];
    while (queue.length > 0) {
      let current = queue.shift();
      if (test(current)) {
        return current;
      }
      for (let group of current.groups) {
        queue.push(group);
      }
    }
    return null;
  }

  findGroups(test: (group: TestGroup) => boolean): TestGroup[] {
    const result: TestGroup[] = [];
    const queue: TestGroup[] = [this];
    while (queue.length > 0) {
      let current = queue.shift();
      if (test(current)) {
        result.push(current);
      }
      for (let group of current.groups) {
        queue.push(group);
      }
    }
    return result;
  }

  /**
   * Decides where in the update tree the new group will be put
   * If it is the top level group it depends whether it is a completely new group
   * or one that is being updated
   *
   * @param {string} groupName
   * @param {Luis.State} state
   * @returns
   * @memberof TestGroup
   */
  getGroup(name: string, state: Luis.State) {
    let possibleRoot = state.currentGroup.groups.find(g => g.name === name);
    return possibleRoot ? possibleRoot : new TestGroup(state.currentGroup, name);
  }

  getStory(name: string, props: StoryConfig, state: Luis.State): TestGroup {
    let possibleRoot = state.currentGroup.groups.find(g => g.name === name);
    return possibleRoot ? possibleRoot : state.createStory(name, props);
  }

  countTests(passing: boolean) {
    let count = 0;
    const queue: TestGroup[] = [this];
    while (queue.length > 0) {
      let current = queue.shift();
      for (let test of current.tests) {
        if (passing && test.error == null) {
          count++;
        } else if (!passing && test.error != null) {
          count++;
        }
      }
      for (let group of current.groups) {
        queue.push(group);
      }
    }
    return count;
  }

  findTestByUrlName(urlName: string) {
    return this.tests.find(t => t.urlName == urlName);
  }

  searchTest(test: (group: Test) => boolean): Test {
    const queue: TestGroup[] = [this];
    while (queue.length > 0) {
      let current = queue.shift();
      for (let currentTest of current.tests) {
        if (test(currentTest)) {
          return currentTest;
        }
      }
      for (let group of current.groups) {
        queue.push(group);
      }
    }
    return null;
  }

  findTest(name: string, parent: string) {
    return this.searchTest(t => t.name == name && t.parent.name === parent);
  }

  @action
  updateCounts() {
    this.passingTests = this.countTests(true);
    this.failingTests = this.countTests(false);
  }
}
