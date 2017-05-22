import { types, getParent } from "mobx-state-tree";
import { IObservableArray } from 'mobx';
import { IMSTNode } from "mobx-state-tree/lib/core";
import { IModelType } from "mobx-state-tree/lib/types/complex-types/object";
import { ISnapshottable } from "mobx-state-tree/lib/types/type";

export const ViewState = types.model(
  'ViewState',
  {
    selectedStoryId: types.array(types.number),
    selectedStoryName: types.array(types.string),
    get currentUrl() {
      return '/' + this.selectedStoryName.join('-') + '/' + this.selectedStoryId.join('-')
    }
  }, {
    openStory(pathNames: string = '', pathIds: string = '') {
      this.selectedStoryId.replace(pathIds.split('-').map(i => parseInt(i)));
      this.selectedStoryName.replace(pathNames.split('-'))
    }
  }
);