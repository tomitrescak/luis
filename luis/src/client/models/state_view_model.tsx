import * as React from 'react';

import { observable, computed, action } from 'mobx';

import { Test } from './test_model';
//@ts-ignore
import { Snapshot } from './snapshot_model';
import { TestGroup } from './test_group_model';
// import { InfoMessage } from '../components/info_message';

const missingStory = new TestGroup(null, 'Missing', {
  component: () => null, // <InfoMessage state={null}>Please select a story.</InfoMessage>,
  info: 'Missing'
});

let num = 0;

export type Resolution = {
  horizontal: number;
  vertical: number;
  name: string;
  tilt?: boolean;
  active?: boolean;
  click?: any;
};

export class ViewState {
  @observable storyPath = '';
  @observable testName = '';
  @observable snapshotName = '';

  @observable sView = localStorage.getItem('Luis.snapshotView') || 'react';
  @observable selectedStory: TestGroup = null;
  @observable selectedTest: Test = null;

  state: Luis.State;
  @observable bare: boolean = false;
  @observable fullScreen: boolean = false;
  id = num++;

  resolutions: Resolution[] = [
    { horizontal: 320, vertical: 460, name: 'iPhone 5' },
    { horizontal: 375, vertical: 559, name: 'iPhone 6' },
    { horizontal: 768, vertical: 1024, name: 'iPad ' }
  ];

  constructor(state: Luis.State) {
    this.state = state;

    let max = this.resolutions.length;
    for (let i = 0; i < max; i++) {
      let r = this.resolutions[i];
      r.tilt = false;
      r.active = false;

      let tilt = {
        name: r.name,
        active: false,
        horizontal: r.vertical,
        vertical: r.horizontal,
        tilt: true
      };

      this.resolutions.push(tilt);
    }
    for (let i = 0; i < this.resolutions.length; i++) {
      let r = this.resolutions[i];
      r.click = () => {
        let pw = window.open(
          window.location.href.replace('?stories', '?story'),
          '',
          `width=${r.horizontal}, height=${
            r.vertical
          }, menubar=no, status=no, toolbar=no, resizable=no`
        );

        pw.document.onload = () => (pw.document.title = r.name);

        setTimeout(() => {
          pw.document.title = r.name;
        }, 1000);

        // this.resolutions[i].active = !this.resolutions[i].active;

        // let frameState = this.frameState;
        // if (frameState) {
        //   frameState.resolutions[i].active = !frameState.resolutions[i].active;
        // }
      };
    }
    // this.resolutions = observable(this.resolutions);

    (window as any).__viewState = this;
  }

  setSnapshotView(view: string) {
    localStorage.setItem('Luis.snapshotView', view);
    this.sView = view;
  }

  get frame(): HTMLIFrameElement {
    return document.getElementById('contentFrame') as HTMLIFrameElement;
  }

  get frameWindow(): Window {
    let frame = this.frame;
    if (frame) {
      return frame.contentWindow;
    }
    return undefined;
  }

  get frameState(): ViewState {
    let frame = this.frame;
    if (frame) {
      return (frame.contentWindow as any).__viewState;
    }
    return undefined;
  }

  @computed
  get currentUrl() {
    let url = this.bare ? '?story' : '?stories';
    url += '=' + this.storyPath;
    if (this.testName) {
      url += '&test=' + this.testName;
    }
    if (this.snapshotName) {
      url += '&snapshot=' + this.snapshotName;
    }
    // url += '&view=' + this.sView;
    if (this.fullScreen) {
      url += '&fullscreen=' + this.fullScreen;
    }

    return url;
  }

  get selectedSnapshot() {
    if (this.selectedStory && this.selectedTest && this.snapshotName) {
      return this.selectedTest.findSnapshotByUrlName(this.snapshotName);
    }
    return null;
  }

  @action
  openStoryFromList(
    e: React.SyntheticEvent<HTMLAnchorElement>,
    storyPath: string = '',
    testName: string = '',
    snapshotName = ''
  ) {
    e.preventDefault();
    e.stopPropagation();
    this.sView = 'react';
    this.openStory(storyPath, testName, snapshotName, false, false);

    // setTimeout(
    //   action(() => {
    //     this.openStory(storyPath, testName, snapshotName, false, false);
    //   }),
    //   50
    // );

    return false;
  }

  @action
  maximise = () => {
    this.sView = 'react';
    this.testName = '';
    this.snapshotName = '';
    this.fullScreen = true;
    this.bare = true;
  };

  @action
  openSingleStory(groupPath: string = '', testName: string = '', snapshotName = '') {
    this.bare = true;
    this.openStory(groupPath, testName, snapshotName);
  }

  @action
  openStory(
    groupPath: string = '',
    testName: string = '',
    snapshotName = '',
    bare: boolean = undefined,
    fullscreen = false
  ) {
    if (bare != null) {
      this.bare = bare;
    }
    let frameState = this.frameState;
    if (frameState) {
      frameState.openStory(groupPath, testName, snapshotName, true);
    }

    this.fullScreen = fullscreen;
    this.storyPath = groupPath;
    this.testName = testName;
    this.snapshotName = snapshotName;

    this.selectedStory = this.state.findStoryById(groupPath) as TestGroup;
    if (this.selectedStory && testName) {
      this.selectedTest = this.selectedStory.findTestByUrlName(testName);
    }

    // detect errors and render them
    if (groupPath && !this.selectedStory) {
      this.selectedStory = missingStory;
    }

    if (this.fullScreen || this.bare) {
      this.sView = 'react';
    } else if (this.sView === 'live') {
    } else if (this.snapshotName) {
      this.sView = 'html';
    } else if (this.testName) {
      this.sView = 'snapshots';
    } else {
      this.sView = 'react';
    }
  }
}
