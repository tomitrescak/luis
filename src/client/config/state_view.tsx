import * as React from 'react';
import { observable, computed, action } from 'mobx';
import { Story, Snapshot, TestItem, Test } from './test_data';

const missingStory = new Story(null, 'Missing', { component: <div>Story not found. Maybe you renamed it?</div>, info: 'Missing' });

export class ViewState {
  @observable storyPath = '';
  @observable testName = '';
  @observable snapshotName = '';

  @observable snapshotView = 'react';
  @observable selectedStory: Story = null;
  @observable selectedTest: Test = null;
  
  state: App.State;

  constructor (state: App.State) {
    this.state = state;
  }

  @computed
  get currentUrl() {
    if (this.snapshotName) {
      return (
        '/' + this.storyPath + '/' + this.testName + '/' + this.snapshotName
      );
    }
    return '/' + this.storyPath;
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
      let parent: TestItem = selected;
      while (parent != null) {
        this.state.expanded[parent.id] = observable(true);
        parent = parent.parent;
      }
    }
  }

  @action
  openStory(groupPath: string = '', testName: string = '', snapshotName = '') {
    
    this.storyPath = groupPath;
    this.testName = testName;
    this.snapshotName = snapshotName;
    
    this.selectedStory = this.state.findStoryById(groupPath) as Story;
    if (this.selectedStory && snapshotName) {
      this.selectedTest = this.selectedStory.findTestByUrlName(testName);
    }

    // detect errors and render them
    if (groupPath && !this.selectedStory) {
      this.selectedStory = missingStory;
    }

    if (this.snapshotName) {
      this.snapshotView = this.snapshotView == 'react' ? 'html' : this.snapshotView;
    } else {
      this.snapshotView = 'react';
    }
  }
}
