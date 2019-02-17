import { observable, action, IObservableValue } from 'mobx';

import { lightTheme, ITheme } from '../config/themes';
import { TestGroup } from './test_group_model';
import { ViewState } from './state_view_model';
import { AppConfig } from '../config/app_config';
import { TestItem } from './test_item_model';

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
  namespace Luis {
    export type State = StateModel;
  }
}

export function mapBridgeToState(setup: (state: StateModel) => void) {
  setup(initState());
}

export type RenderOptions = {
  root?: string;
  extraUpdateProps?: string;
  updateUrl?: string;
  loadTests?: () => any;
  report?: any;
  snapshots?: any;
};

let id = 0;

export class StateModel {
  @observable theme: ITheme = lightTheme;
  @observable autoUpdateSnapshots = false;
  @observable showPassing = true;
  @observable showFailing = true;
  @observable running = false;
  @observable hideTestMenus = false; // = localStorage.getItem('LUIS.showTestMenus') === 'true';

  expanded: { [index: string]: IObservableValue<boolean> } = {};

  liveRoot: TestGroup;
  currentGroup: TestGroup;
  viewState: ViewState;
  testResults: any;
  renderOptions: RenderOptions;

  timer: any;

  config: AppConfig;
  uid: number;

  constructor() {
    this.uid = id++;

    this.liveRoot = new TestGroup(null, 'root');
    this.currentGroup = this.liveRoot;
    this.viewState = new ViewState(this);
    this.config = new AppConfig(this);

    // create new router
    // setupRouter(this);
  }

  findStoryByFileName(fileName: string) {
    return this.liveRoot.findGroup(g => g.fileName === fileName);
  }

  findStoryById(id: string) {
    return this.liveRoot.findGroup(g => g.id === id);
  }

  createStory(name: string, props: any) {
    return new TestGroup(this.currentGroup, name, props);
  }

  hideMenus(value?: boolean) {
    this.hideTestMenus = value;
    localStorage.setItem('LUIS.showTestMenus', this.hideTestMenus ? 'true' : 'false');
  }

  @action
  isExpanded(group: TestItem) {
    const path = group.id;
    if (this.expanded[path] == null) {
      this.expanded[path] = observable.box(false);
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
  } else {
    state.liveRoot.groups = []; //.clear();
    state.currentGroup = state.liveRoot;
  }
  return state;
}

export function getState() {
  return state;
}
