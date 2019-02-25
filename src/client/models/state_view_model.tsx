import * as React from 'react';

import { observable, computed, action } from 'mobx';

import { Test } from './test_model';
import { TestItem } from './test_item_model';
//@ts-ignore
import { Snapshot } from './snapshot_model';
import { TestGroup } from './test_group_model';

const missingStory = new TestGroup(null, 'Missing', {
  component: () => <div>Story not found. Maybe you renamed it?</div>,
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

  get frame(): Window {
    let frame = document.getElementById('contentFrame') as HTMLIFrameElement;
    if (frame) {
      return frame.contentWindow;
    }
    return undefined;
  }

  get frameState(): ViewState {
    let frame = document.getElementById('contentFrame') as HTMLIFrameElement;
    if (frame) {
      return (frame.contentWindow as any).__viewState;
    }
    return undefined;
  }

  @computed
  get currentUrl() {
    const prefix = this.bare ? '?story' : '?stories';
    if (this.snapshotName) {
      return (
        prefix + '=' + this.storyPath + '&test=' + this.testName + '&snapshot=' + this.snapshotName
      );
    }
    if (this.testName) {
      return prefix + '=' + this.storyPath + '&test=' + this.testName;
    }
    return prefix + '=' + this.storyPath;
  }

  get selectedSnapshot() {
    if (this.selectedStory && this.selectedTest && this.snapshotName) {
      return this.selectedTest.findSnapshotByUrlName(this.snapshotName);
    }
    return null;
  }

  openStoryFromList(
    e: React.SyntheticEvent<HTMLAnchorElement>,
    storyPath: string = '',
    testName: string = '',
    snapshotName = ''
  ) {
    e.preventDefault();
    e.stopPropagation();
    this.openStory(storyPath, testName, snapshotName);
    return false;
  }

  maximise = () => {
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
    bare: boolean = undefined
  ) {
    if (bare != null) {
      this.bare = bare;
    }
    let frameState = this.frameState;
    if (frameState) {
      frameState.openStory(groupPath, testName, snapshotName);
    }

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

    if (this.sView === 'live') {
    } else if (this.snapshotName) {
      this.sView = this.sView == 'react' ? 'html' : this.sView;
    } else if (this.testName) {
      if (this.selectedTest && this.selectedTest.snapshots.length) {
        this.sView = 'snapshots';
      } else {
        this.sView = 'react';
      }
    } else if (!this.testName) {
      this.sView = 'react';
    }
  }
}
