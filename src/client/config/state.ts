import { observable, action, computed, IObservableValue } from 'mobx';

import { lightTheme, darkTheme, ITheme } from '../config/themes';

import { TestGroup, Snapshot, TestItem } from './test_data';
import { TestQueue } from './test_queue';
import { TestRunner } from './test_runner';

import { ViewState } from './state_view';
import { setupRouter } from './router';
import { Story } from '../client';
import { setupHmr } from './setup';

setupHmr();

// // var Client = require('fusebox-websocket').SocketClient
// // var client = new Client({
// //   port: 4445,
// //   uri: 'ws://localhost:4445',
// // });
// var client = global.__fuseClient;
// // client.connect();
// client.on('source-changed', function (data) {
//   // console.log(data);
//   console.log('445');

// });

declare global {
  namespace App { export type State = StateModel; }
}

export class StateModel {
  @observable theme: ITheme = lightTheme;
  @observable showPassing = true;
  @observable showFailing = true;

  expanded: { [index: string]: IObservableValue<boolean> } = {};

  liveRoot: TestGroup;
  updateRoot: TestGroup;
  currentGroup: TestGroup;
  viewState: ViewState;

  timer: any;
  reconciled: boolean;
  resolveReconcile: Function;
  beforeHmr = true;
  testQueue: TestQueue;
  testRunner: TestRunner;
  _testConfig: string[][];

  constructor(testRunner: TestRunner = null) {
    this.testRunner = testRunner || new TestRunner(this);
    this.liveRoot = new TestGroup(null, 'root');
    this.updateRoot = new TestGroup(null, 'update');
    this.currentGroup = this.updateRoot;
    this.testQueue = new TestQueue(this.testRunner);
    this.testRunner = testRunner;
    this.viewState = new ViewState(this);

    // create new router
    setupRouter(this);
  }

  get testConfig() {
    if (!this._testConfig) {
      this._testConfig = [];

      let storedConfig = localStorage.getItem('louisTestConfig');
      if (storedConfig == null) {
        storedConfig = '';
        localStorage.setItem('louisTestConfig', storedConfig);
      }
      const parts = storedConfig.split('|').map(s => s.split('#'));

      // add non existing items
      const queue = [this.liveRoot];
      while (queue.length > 0) {
        let current = queue.shift();
        if (current.tests.length > 0) {
          const value = parts.find(c => c[0] === current.path);
          this._testConfig.push([current.path, value ? value[1] : '1']);
        }
        for (let group of current.groups) {
          queue.push(group);
        }
      }
    }

    return this._testConfig;
  }

  findGroup(test: (group: TestGroup) => boolean, root = this.liveRoot): TestGroup {
    const queue = [root];
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

  findStoryByFileName(fileName: string) {
    return this.findGroup(g => g.fileName === fileName);
  }

  findStoryById(id: string) {
    return this.findGroup(g => g.id === id);
  }

  toggleAllTests(disabled: boolean) {
    this.testConfig.forEach(s => (s[1] = disabled ? '0' : '1'));
    this.saveStoryConfig();
  }

  toggleStoryTests(id: string, disabled: boolean) {
    let config = this.testConfig.find(t => t[0] === id);
    if (config) {
      config[1] = disabled ? '0' : '1';
    }
    this.saveStoryConfig();
  }

  isDisabled(group: TestGroup) {
    let config = this.testConfig.find(t => t[0] === group.id);
    return config && config[1] == '0';
  }

  saveStoryConfig() {
    localStorage.setItem('louisTestConfig', this.testConfig.map(t => t.join('#')).join('|'));
  }

  @action
  performReconciliation() {
    this._testConfig = null;
    this.liveRoot.groups = [...this.updateRoot.groups];

    // remap root and run tests
    this.liveRoot.groups.forEach(g => {
      g.parent = this.liveRoot;
      this.testQueue.add(g);
    });

    // start tests
    this.updateRoot.groups = [];
    this.updateRoot.tests = [];

    // delete old values from live

    this.reconciled = true;

    // notify
    if (this.resolveReconcile) {
      this.resolveReconcile(true);
    }

    this.liveRoot.version++;
    this.viewState.openAfterTest();
  }

  // @action performDeepReconciliation() {
  //   ////////////////////////////////////////
  //   // copy new values from update to live
  //   const updateQueue = [this.updateRoot];

  //   while (updateQueue.length > 0) {
  //     const currentUpdate = updateQueue.shift();

  //     // find the parent node in live nodes
  //     // root is always found
  //     // the rest is copied if necessary

  //     const live = this.find(currentUpdate, this.liveRoot);
  //     for (let updatedGroup of currentUpdate.groups) {
  //       const foundLive = live.groups.find(g => g.name === updatedGroup.name);

  //       // if we found this node we will search added nodes in children
  //       if (foundLive) {
  //         updateQueue.push(updatedGroup);

  //         // reconcile tests
  //         for (let updatedTest of updatedGroup.tests) {
  //           if (foundLive.tests.every(t => t.name !== updatedTest.name)) {
  //             foundLive.tests.push(updatedTest);
  //           }
  //         }
  //       } else {
  //         updatedGroup.parent = live;
  //         live.groups.push(updatedGroup);

  //         // in initial load we queue all tests
  //         if (this.beforeHmr) {
  //           this.testQueue.add(updatedGroup);
  //         }
  //       }
  //     }
  //   }

  //   ////////////////////////////////////////
  //   // delete extra values
  //   const liveQueue = [this.liveRoot];

  //   while (liveQueue.length > 0) {
  //     const live = liveQueue.shift();

  //     // find the parent node in live nodes
  //     // root is always found
  //     // the rest is copied if necessary

  //     const updated = this.find(live, this.updateRoot);
  //     for (let i=live.groups.length - 1; i >=0; i--) {
  //       const liveGroup = live.groups[i];
  //       const foundUpdated = updated.groups.find(g => g.name === liveGroup.name);

  //       // if we found this node we will search added nodes in children
  //       if (foundUpdated) {
  //         liveQueue.push(liveGroup);

  //         // reconcile tests
  //         for (let j=liveGroup.tests.length-1; j>=0; j--) {
  //           const liveTest = liveGroup.tests[j];
  //           if (foundUpdated.tests.every(t => t.name !== liveTest.name)) {
  //             liveGroup.tests.splice(liveGroup.tests.indexOf(liveTest), 1);
  //           }
  //         }
  //       } else {
  //         live.groups.splice(live.groups.indexOf(liveGroup), 1);
  //       }
  //     }
  //   }

  //   // remove updated
  //   this.updateRoot.groups = [];
  //   this.updateRoot.tests = [];

  //   // delete old values from live

  //   this.reconciled = true;

  //   // notify
  //   if (this.resolveReconcile) {
  //     this.resolveReconcile(true);
  //   }
  // }

  reconciliate() {
    this.reconciled = false;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => this.performReconciliation(), 100);
  }

  isReconciled() {
    if (this.reconciled) {
      return true;
    }
    return new Promise(resolve => {
      this.resolveReconcile = resolve;
    });
  }

  @action
  isExpanded(group: TestItem) {
    const path = group.id;
    if (this.expanded[path] == null) {
      this.expanded[path] = observable(false);
    }
    return this.expanded[path];
  }

  @action
  toggleExpanded(e: any, item: TestItem) {
    const path = item.id;
    if (e.target && e.target.nodeName.toLowerCase() === 'a') {
      // anchors only allow expands
      this.expanded[path].set(true);
    } else {
      this.expanded[path].set(!this.expanded[path].get());
    }
  }
}

let state: StateModel;

export function initState() {
  if (!state) {
    state = new StateModel();
    global.__state = state;
  }
  return state;
}
