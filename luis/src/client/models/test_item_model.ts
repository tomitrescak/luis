export type Impl = () => void;

export function toUrlName (str: string, lowerCase = true) {
  let result = str.replace(/\:/g, '');
  result = result.replace(/ - /g, '-');
  result = result.replace(/\W/g, '-');
  do {
    result = result.replace(/--/g, '-');
  } while (result.indexOf('--') >= 0);
  return lowerCase ? result.toLowerCase() : result;
};

export class TestItem {
  name: string;
  parent: TestItem;
  urlName: string;

  constructor(name: string, parent: TestItem) {
    this.name = name;
    this.urlName = toUrlName(name);
    this.parent = parent;
  }

  get id(): string {
    if (this.parent == null) {
      return '';
    }
    return (this.parent == null || this.parent.parent == null ? '' : (this.parent.id + '-')) + this.urlName;
  }
}
