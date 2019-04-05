import { toUrlName } from './test_item_model';

export interface ISnapshot {
  name: string;
  originalName: string;
  expected: string;
  current: string;
  matching?: boolean;
  test: Luis.TestModel;
}

export class Snapshot {
  name: string;
  originalName: string;
  url: string;
  parent: Luis.TestModel;

  expected: string;
  current: string;
  matching?: boolean;

  constructor(snapshot: ISnapshot) {
    this.name = snapshot.name;
    this.originalName = snapshot.originalName;
    this.parent = snapshot.test;
    this.url = toUrlName(snapshot.name);
    this.expected = snapshot.expected;
    this.current = snapshot.current;
    this.matching = snapshot.matching;
  }
}
