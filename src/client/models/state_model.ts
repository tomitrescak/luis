import { observable, action, IObservableValue } from 'mobx';

import { lightTheme, ITheme } from '../config/themes';
import { setupHmr } from '../config/setup';
import { TestGroup } from './test_group_model';
import { ViewState } from './state_view_model';
import { AppConfig } from '../config/app_config';
import { setupRouter } from '../config/router';
import { TestItem } from './test_item_model';

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
  namespace Luis { export type State = StateModel; }
}

export type RenderOptions = {
  root?: string;
  extraUpdateProps?: string;
  updateUrl?: string;
};

export interface Bridge {
  onReconciled(state: StateModel): void;
  updateSnapshots(state: StateModel, name: string): void;
  hmr(path: string, content: string, dependants: { [name: string]: string[] }): void;
}

export interface Config {
  bridge: Bridge;
}

export const config: Config = {
  bridge: null
}

export function setupBridge(setup: (state: StateModel) => Bridge) {
  config.bridge = setup(initState());
}

let id = 0;

export class StateModel {
  @observable theme: ITheme = lightTheme;
  @observable autoUpdateSnapshots = false;
  @observable showPassing = true;
  @observable showFailing = true;
  @observable running = false;
  @observable updatingSnapshots = false;

  expanded: { [index: string]: IObservableValue<boolean> } = {};

  
  liveRoot: TestGroup;
  updateRoot: TestGroup;
  currentGroup: TestGroup;
  viewState: ViewState;
  packageConfig: Config;

  timer: any;
  reconciled: boolean;
  resolveReconcile: Function;
  beforeHmr = true;
  renderOptions: RenderOptions;

  config: AppConfig;
  uid: number;

  constructor() {
    this.uid = id++;

    this.liveRoot = new TestGroup(null, 'root');
    this.updateRoot = new TestGroup(null, 'update');
    this.currentGroup = this.updateRoot;
    this.viewState = new ViewState(this);
    this.config = new AppConfig(this);
    this.packageConfig = config;

    // create new router
    setupRouter(this);
  }

  findStoryByFileName(fileName: string) {
    return this.liveRoot.findGroup(g => g.fileName === fileName);
  }

  findStoryById(id: string) {
    return this.liveRoot.findGroup(g => g.id === id);
  }

  createStory(name: string, props: any) {
    return new TestGroup(this.currentGroup, name, props)
  }

  @action
  performReconciliation(copyValues = true) {
    // copy values so that we remember
    if (copyValues) {
      this.copyValues(this.liveRoot, this.updateRoot);
    }

    this.liveRoot.groups = [...this.updateRoot.groups];

    // remap root and run tests
    this.liveRoot.groups.forEach(g => {
      g.parent = this.liveRoot;
    });


    // clear updates
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
    this.config.loadTests();

    // start tests asynchronously
    config.bridge.onReconciled(this);
  }

  @action copyValues(from: TestGroup, to: TestGroup) {
    to.passingTests = from.passingTests;
    to.failingTests = from.failingTests;
    
    for (let test of to.tests) {
      var fromTest = from.tests.find(t => t.name === test.name);
      if (fromTest) {
        test.startTime = fromTest.startTime;
        test.endTime = fromTest.endTime;
        test.error = fromTest.error;
        test.snapshots = fromTest.snapshots;
      }
    }

    for (let group of to.groups) {
      var fromGroup = from.groups.find(g => g.name === group.name);
      if (fromGroup) {
        this.copyValues(fromGroup, group);
      }
    }
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

  reconciliate(copyValues = true) {
    this.reconciled = false;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => this.performReconciliation(copyValues), 100);
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
    (global as any).__state = state;
  }
  return state;
}
