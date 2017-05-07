import { observable, action } from 'mobx';

export class TestCatalogue {
  @observable catalogue = {};
  @observable passingTests = 0;
  @observable failingTests = 0;
  @observable hidePassing = false;

  count(current: any, failing = true) {
    let num = 0;
    Object.keys(current).map(k => {
      if (typeof current[k] === 'string') {
        num += failing && current[k] || !failing && !current[k] ? 1 : 0;
      } else {
        num += this.count(current[k], failing);
      }
    });
    return num;
  }

  @action updateHide(hide: boolean) {
    this.hidePassing = hide;
  }

  @action update(testName: string[], result?: string) {
    // if (this.hasTest(testName)) {
    //   console.error('Duplicate test name: ' + testName.join(' > '));
    // }
    // console.log('Updating: ' + testName.join('>'));
    // create path
    let current = this.catalogue;
    for (let i = 0; i < testName.length - 1; i++) {
      const name = testName[i];
      if (!current[name]) {
        current[name] = {};
      }
      current = current[name];
    }
    current[testName[testName.length - 1]] = result || '';

    this.passingTests = this.count(this.catalogue, false);
    this.failingTests = this.count(this.catalogue, true); ;
  }

  hasTest(testName: string[]): boolean {
    let current = this.catalogue;
    for (let i = 0; i < testName.length - 1; i++) {
      const name = testName[i];
      if (!current[name]) {
        return false;
      }
      current = current[name];
    }
    return Object.keys(current).indexOf(testName[testName.length - 1]) > -1;
  }
}
