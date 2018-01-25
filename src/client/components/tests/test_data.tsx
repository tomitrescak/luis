import * as React from 'react';

import { StateModel } from '../../models/state_model';
import { ViewState } from '../../models/state_view_model';
import { TestGroup } from '../../models/test_group_model';
import { Test } from '../../models/test_model';
import { Snapshot } from '../../models/snapshot_model';
import { Story } from '../../models/story_model';

export const create = {
  state(stateOverride?: Partial<StateModel>, viewStateOverride?: Partial<ViewState>) {
    let model = new StateModel();
    if (stateOverride) {
      for (let key of Object.getOwnPropertyNames(stateOverride)) {
        (model as any)[key] = (stateOverride as any)[key];
      }
    }
    if (viewStateOverride) {
      for (let key of Object.getOwnPropertyNames(viewStateOverride)) {
        (model.viewState as any)[key] = (viewStateOverride as any)[key];
      }
    }
    return model;
  },
  stateWithTests() {
    let state = create.state({ liveRoot: create.someTests() });
    state.viewState.selectedStory = state.liveRoot.groups[0] as Story;
    return state;
  },
  group(name: string, parent: TestGroup = null) {
    return new TestGroup(parent, name);
  },
  story(name: string, parent: TestGroup = null) {
    return new Story(parent, name, {
      component: <div>Component</div>
    });
  },
  test(name: string, parent: TestGroup, error: any = null, duration: number = 0, snapshots: Snapshot[] = []) {
    let date = Date.now();
    let test = new Test(name, parent, null);
    test.error = error;
    test.startTime = date - duration;
    test.endTime = date;
    test.snapshots = snapshots as any;
    parent.tests.push(test);
  },
  someTests() {
    let group = this.group('Root');

    group.passingTests = 1;
    group.failingTests = 2;

    let child1 = this.group('Child1', group);
    let child2 = this.group('Child2', group);
    let child3 = this.group('Child1-1', child1);

    this.test('test1', child1, { message: 'Some error' }, 20);  
    this.test('test2', child3, { message: 'Not equal, expected 7 got 5', actual: '5', expected: '7' }, 40);
    this.test('test3', child3, null, 30);
    this.test('test4', child2, null, 23);
    return group;
  }
};
