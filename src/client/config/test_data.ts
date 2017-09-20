import { observable, action } from 'mobx';
import { SemanticCOLORS } from 'semantic-ui-react';

export type Impl = () => void;

function toUrlName (str: string) {
  let result = str.replace(/\:/g, '');
  result = result.replace(/ - /g, '-');
  result = result.replace(/\W/g, '-');
  do {
    result = result.replace(/--/g, '-');
  } while (result.indexOf('--') >= 0);
  return result.toLowerCase();
};

export class TestItem {
  name: string;
  parent: TestItem;
  urlName: string;

  @observable startTime: number = 0;
  @observable endTime: number = 0;

  constructor(name: string, parent: TestItem) {
    this.name = name;
    this.urlName = toUrlName(name);
    this.parent = parent;
  }

  get id(): string {
    if (this.parent == null) {
      return '';
    }
    return (this.parent == null || this.parent.parent == null ? '' : (this.parent.id + '-')) + this.urlName;
  }

  get duration() {
    return (this.endTime - this.startTime < 0) ? 0 : (this.endTime - this.startTime);
  }
}

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

  startTime: number = 0;
  endTime: number = 0;

  @observable version: number = 0;
  @observable passingTests = 0;
  @observable failingTests = 0;


  constructor(parent: TestGroup, name: string) {
    super(name, parent);
    this.tests = [];
    this.groups = [];
    this.urlName = toUrlName(name);
    this.pathName = this.urlName.replace(/-/g, '');
    if (parent) {
      parent.groups.push(this);
      parent.groups.sort((a, b) => a.name < b.name ? -1 : 1);
    }
  }

  get fileName(): string {
    return (this.parent == null || this.parent.parent == null ? '' : (this.parent.fileName + '_')) + this.pathName;
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

  getStory(name: string, props: StoryConfig, state: App.State): Story {
    let possibleRoot = state.currentGroup.groups.find(g => g.name === name) as Story;
    return possibleRoot ? possibleRoot : new Story(state.currentGroup, name, props);
  }

  countTests(passing: boolean) {
    let count = 0;
    const queue: TestGroup[] = [this];
    while (queue.length > 0) {
      let current = queue.shift();
      for (let test of current.tests) {
        if (passing && test.error == null) {
          count ++;
        } else if (!passing && test.error != null) {
          count ++;
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

  @action updateCounts() {
    this.passingTests = this.countTests(true);
    this.failingTests = this.countTests(false);
  }
}

export class Story extends TestGroup {
  component: JSX.Element;
  decorator?: React.SFC;
  cssClassName: string;
  info: string;

  constructor(parent: TestGroup, name: string, props: StoryConfig) { 
    super(parent, name);

    this.component = props.component;
    this.info = props.info;
    this.decorator = props.decorator;
    this.cssClassName = props.cssClassName;
  }
}

export class Test extends TestItem  {
  parent: TestGroup;
  name: string;

  impl: () => void;
  snapshots: Snapshot[];
  error: Error & { actual: string, expected: string } ;

  url: string;

  constructor(name: string, group: TestGroup, impl: () => void) {
    super(name, group);

    this.impl = impl;
    this.snapshots = observable([]);
    this.url = toUrlName(name);
  }

  get icon(): { name: string, color: SemanticCOLORS } {
    return {
      name: this.error ? 'remove' : 'check',
      color: this.error ? 'red' : 'green'
    }
  }

  findSnapshotByUrlName(urlName: string) {
    return this.snapshots.find(s => s.url === urlName);
  }
}

export interface ISnapshot {
  name: string;
  expected: string;
  current: string;
  matching?: boolean;
  test: Test
}

export class Snapshot {
  name: string;
  url: string;
  parent: Test;

  expected: string;
  current: string;
  matching?: boolean;

  constructor(snapshot: ISnapshot) {
    this.name = snapshot.name;
    this.parent = snapshot.test;
    this.url = toUrlName(snapshot.name);
    this.expected = snapshot.expected;
    this.current = snapshot.current;
    this.matching = snapshot.matching;
  }
}