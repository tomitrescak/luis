import { SemanticCOLORS } from 'semantic-ui-react';
import { observable, computed, IObservableArray } from 'mobx';

import { TestItem, toUrlName } from './test_item_model';
import { TestGroup } from './test_group_model';
import { Snapshot } from './snapshot_model';

declare global {
  namespace Luis {
    type TestModel = Test;
  }
}

let uid = 0;
export class Test extends TestItem {
  private _duration: number;

  parent: TestGroup;
  name: string;

  @observable startTime: number = 0;
  @observable endTime: number = 0;

  @computed get duration() {
    if (this._duration) {
      return this._duration;
    }
    return this.endTime - this.startTime < 0 ? 0 : this.endTime - this.startTime;
  }

  set duration(value: number) {
    this._duration = value;
  }

  impl: () => void;
  snapshots: IObservableArray<Snapshot>;
  error: Error & { actual: string; expected: string };

  url: string;
  uid: number;

  constructor(name: string, group: TestGroup, impl: () => void) {
    super(name, group);

    this.impl = impl;
    this.snapshots = observable([]);
    this.url = toUrlName(name);
    this.uid = uid++;

    // console.log('Constructed: ' + name + '[' + this.uid  + ']');
  }

  get icon(): { name: string; color: SemanticCOLORS } {
    return {
      name: this.error ? 'remove' : 'check',
      color: this.error ? 'red' : 'green'
    };
  }

  get simplePath(): string {
    return this.parent.simplePath + ' ' + this.name;
  }

  findSnapshotByUrlName(urlName: string) {
    return this.snapshots.find(s => s.url === urlName);
  }
}
