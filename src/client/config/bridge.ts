import { Impl } from '../models/test_item_model';
import { Test } from '../models/test_model';

export interface BridgeInterface {
  describe: string;
  xdescribe: string;
  it: string;
  xit: string;
  storyOf: string;
  before: string;
  beforeAll: string;
  beforeEach: string;
  after: string;
  afterAll: string;
  afterEach: string;
}

export const bdd: BridgeInterface = {
  describe: 'describe',
  xdescribe: 'xdescribe',
  it: 'it',
  xit: 'xit',
  storyOf: 'storyOf',
  before: 'before',
  beforeAll: 'beforeAll',
  beforeEach: 'beforeEach',
  after: 'after',
  afterAll: 'afterAll',
  afterEach: 'afterEach'
};

export function setupTestBridge(state: Luis.State, bridgeInterface: BridgeInterface = bdd) {
  const glob = global;


  glob[bridgeInterface.describe] = function(name: string, impl: Impl) {
    // stop test queue during execution
    state.testQueue.stop();

    const group = state.currentGroup.getGroup(name, state);
    const parent = group.parent;
    state.currentGroup = group;

    try {
      impl();
    } finally {
      state.currentGroup = parent;
    }

    // add to test queue
    state.testQueue.add(group);
    // start reconciliation
    state.reconciliate();
  };

  glob[bridgeInterface.storyOf] = function(name: string, props: StoryConfig, impl: (props: any) => void) {
    // stop test queue during execution
    state.testQueue.stop();
    
    const group = state.currentGroup.getStory(name, props, state);
    const parent = group.parent;
    state.currentGroup = group;

    try {
      impl(props);
    } finally {
      state.currentGroup = parent;
    }

    // add to test queue
    state.testQueue.add(group);
    // start reconciliation
    state.reconciliate();
  };

  glob[bridgeInterface.xit] = function() {};

  glob[bridgeInterface.xdescribe] = function() {};

  glob[bridgeInterface.it] = function(name: string, impl: Impl) {
    if (state.currentGroup.tests.every(t => t.name !== name)) {
      state.currentGroup.tests.push(new Test(name, state.currentGroup, impl));
    }
  };

  glob[bridgeInterface.before] = function(impl: Impl) {
    state.currentGroup.before = impl;
  };

  glob[bridgeInterface.beforeAll] = function(impl: Impl) {
    state.liveRoot.beforeAll = impl;
  };

  glob[bridgeInterface.beforeEach] = function(impl: Impl) {
    state.currentGroup.beforeEach = impl;
  };

  glob[bridgeInterface.after] = function(impl: Impl) {
    state.currentGroup.after = impl;
  };

  glob[bridgeInterface.afterAll] = function(impl: Impl) {
    state.liveRoot.afterAll = impl;
  };

  glob[bridgeInterface.afterEach] = function(impl: Impl) {
    state.currentGroup.afterEach = impl;
  };
}
