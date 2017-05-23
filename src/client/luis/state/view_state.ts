import { types, getParent } from 'mobx-state-tree';
import { IObservableArray, observable, computed, action } from 'mobx';
import { IMSTNode } from 'mobx-state-tree/lib/core';
import { IModelType } from 'mobx-state-tree/lib/types/complex-types/object';
import { ISnapshottable } from 'mobx-state-tree/lib/types/type';

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

