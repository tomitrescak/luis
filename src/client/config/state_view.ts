import { IObservableArray, observable, computed, action } from 'mobx';
import { Story, Snapshot } from './test_data';

export class ViewState {
  @observable selectedSnapshotIndex: number = -1;
  @observable selectedSnapshotName: string = '';
  @observable selectedPath: string = '';
  @observable snapshotView = 'react';
  @observable selectedStory: Story = null;
  @observable selectedSnapshot: Snapshot = null;

  state: App.State;

  constructor (state: App.State) {
    this.state = state;
  }

  @computed
  get currentUrl() {
    if (this.selectedSnapshotIndex >= 0) {
      return (
        '/' + this.selectedPath + '/' + this.selectedSnapshotName + '/' + this.selectedSnapshotIndex
      );
    }
    return '/' + this.selectedPath;
  }

  openStoryFromList(e: React.SyntheticEvent<HTMLAnchorElement>, path: string = '', snapshotName: string = '', activeSnapshot = -1) {
    e.preventDefault();
    e.bubbles = false;
    this.openStory(path, snapshotName, activeSnapshot);
    return false;
  }

  @action
  openAfterTest() {
    if (this.selectedStory == null && this.selectedPath != null) {
      this.openStory(this.selectedPath, this.selectedSnapshotName, this.selectedSnapshotIndex);
    }
  }

  @action
  openStory(path: string = '', snapshotName: string = '', activeSnapshot = -1) {
    if (this.selectedStory == null || this.selectedPath != path) {
      this.selectedPath = path;
      this.selectedStory = this.state.findStoryByUrl(path) as Story;
    }

    this.selectedSnapshotName = snapshotName;
    this.selectedSnapshotIndex = activeSnapshot;

    if (activeSnapshot >= 0) {
      this.snapshotView = 'html';
    } else {
      this.snapshotView = 'react';
    }
  }
}
