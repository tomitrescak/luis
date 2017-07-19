import { IObservableArray, observable, computed, action } from 'mobx';

export class ViewState {
  @observable selectedStoryId: IObservableArray<number> = observable([]);
  @observable selectedStoryName: IObservableArray<string> = observable([]);
  @computed get currentUrl() {
    if (this.selectedStoryId.length) {
      return '/' + this.selectedStoryName.join('-') + '/' + this.selectedStoryId.join('-');
    }
    return '/';
  }

  @action openStory(pathNames: string = '', pathIds: string = '') {
    if (pathIds) {
      this.selectedStoryId.replace(pathIds.split('-').map(i => parseInt(i, 10)));
      this.selectedStoryName.replace(pathNames.split('-'));
    } else {
      this.selectedStoryId.clear();
      this.selectedStoryName.clear();
    }
  }
}

