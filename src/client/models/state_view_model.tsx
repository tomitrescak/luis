import * as React from 'react';

import { observable, computed, action } from 'mobx';


import { Story } from './story_model';
import { Test } from './test_model';
import { TestItem } from './test_item_model';
//@ts-ignore
import { Snapshot } from './snapshot_model';

const missingStory = new Story(null, 'Missing', { component: <div>Story not found. Maybe you renamed it?</div>, info: 'Missing' });

export class ViewState {
  @observable storyPath = '';
  @observable testName = '';
  @observable snapshotName = '';

  @observable snapshotView = 'react';
  @observable selectedStory: Story = null;
  @observable selectedTest: Test = null;
  
  state: Luis.State;
  bare: boolean;

  constructor (state: Luis.State) {
    this.state = state;
  }

  @computed
  get currentUrl() {
    const prefix = this.bare ? '/story' : '/stories';
    if (this.snapshotName) {
      return (
        prefix + '/' + this.storyPath + '/' + this.testName + '/' + this.snapshotName
      );
    }
    if (this.testName) {
      return (
        prefix + '/' + this.storyPath + '/' + this.testName
      );
    }
    return prefix + '/' + this.storyPath;
  }

  get selectedSnapshot() {
    if (this.selectedStory && this.selectedTest && this.snapshotName) {
      return this.selectedTest.findSnapshotByUrlName(this.snapshotName);
    }
    return null;
  }

  openStoryFromList(e: React.SyntheticEvent<HTMLAnchorElement>, storyPath: string = '', testName: string = '', snapshotName = '') {
    e.preventDefault();
    e.bubbles = false;
    this.openStory(storyPath, testName, snapshotName);
    return false;
  }

  @action
  openAfterTest() {
    this.openStory(this.storyPath, this.testName, this.snapshotName);

    const selected = this.selectedTest || this.selectedStory;
    // open the path
    if (selected) {
      // check if selected story is a child
      let parent: TestItem = selected.parent;
      while (parent != null) {
        this.state.expanded[parent.id] = observable(true);
        parent = parent.parent;
      }
    }
  }

  @action
  openSingleStory(groupPath: string = '', testName: string = '', snapshotName = '') {
    this.bare = true;
    this.openStory(groupPath, testName, snapshotName);
  }

  @action
  openStory(groupPath: string = '', testName: string = '', snapshotName = '') {
    
    this.storyPath = groupPath;
    this.testName = testName;
    this.snapshotName = snapshotName;
    
    this.selectedStory = this.state.findStoryById(groupPath) as Story;
    if (this.selectedStory && testName) {
      this.selectedTest = this.selectedStory.findTestByUrlName(testName);
    }

    // detect errors and render them
    if (groupPath && !this.selectedStory) {
      this.selectedStory = missingStory;
    }

    if (this.snapshotName) {
      this.snapshotView = this.snapshotView == 'react' ? 'html' : this.snapshotView;
    } else if (!this.testName && this.snapshotView != 'snapshots') {
      this.snapshotView = 'react';
    }
  }
}
