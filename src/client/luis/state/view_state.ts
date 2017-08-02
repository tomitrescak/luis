import { IObservableArray, observable, computed, action } from 'mobx';
import { Story, StoryType } from './story';
import { StateType } from './state';

export class ViewState {
  @observable selectedStoryId: IObservableArray<number> = observable([]);
  @observable selectedStoryName: IObservableArray<string> = observable([]);
  @observable selectedSnapshot: number = -1;
  
  constructor(private state: StateType) {  }

  @computed get currentUrl() {
    if (this.selectedStoryId.length) {
      if (this.selectedSnapshot >= 0) {
        return '/' + this.selectedStoryName.join('-') + '/' + this.selectedStoryId.join('-') + '/' + this.selectedSnapshot;
      }
      return '/' + this.selectedStoryName.join('-') + '/' + this.selectedStoryId.join('-');
    }
    return '/';
  }

  @action openStory(pathNames: string = '', pathIds: string = '', activeSnapshot = -1) {
    if (pathIds) {
      this.selectedStoryId.replace(pathIds.split('-').map(i => parseInt(i, 10)));
      this.selectedStoryName.replace(pathNames.split('-'));
    } else {
      this.selectedStoryId.clear();
      this.selectedStoryName.clear();
    }

    this.selectedSnapshot = activeSnapshot;

    if (activeSnapshot >= 0) {
      // also select snapshot  
      this.state.snapshotView = 'html'; 
    }
  }
}

