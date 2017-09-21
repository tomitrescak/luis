import { observable, action, IObservableArray } from 'mobx';
import { TestGroup } from './test_data';

export class TestConfig {
  @observable disabled = true;
  id: string;
  name: string;

  constructor(id: string, name: string, enabled: boolean) {
    this.id = id;
    this.name = name;
    this.disabled = enabled;
  }
}

export type StoryView = 'list' | 'tree';

export class AppConfig {
  tests: IObservableArray<TestConfig>;
  state: App.State;
  @observable storyView: StoryView = 'list';
  @observable logLevel = '1';
  @observable theme = 'light';
  @observable showDevTools = false;

  constructor(state: App.State) {
    this.state = state;
    this.storyView = localStorage.getItem('louisStoryView') as StoryView || 'tree';
    this.logLevel = localStorage.getItem('luisLog') || '1';
    this.showDevTools = localStorage.getItem('luisDevTools') == '1' ? true : false;
    this.theme = localStorage.getItem('luisTheme') || 'light';
    this.tests = observable([]);
    this.loadTests();
  }

  @action loadTests() {
    this.tests.clear();

    let testCollection: TestConfig[] = [];
    let storedConfigString = localStorage.getItem('louisTestConfig');
    if (storedConfigString == null) {
      storedConfigString = '';
      localStorage.setItem('louisTestConfig', storedConfigString);
    }
    const storedConfig = storedConfigString.split('|').map(s => s.split('#'));

    // add non existing items
    const queue = [this.state.liveRoot];
    while (queue.length > 0) {
      let current = queue.shift();
      if (current.tests.length > 0) {
        const value = storedConfig.find(c => c[0] === current.id);
        testCollection.push(new TestConfig(current.id, current.path, value ? value[1] == '0' : false));
      }
      for (let group of current.groups) {
        queue.push(group);
      }
    }

    testCollection.sort((a, b) => a.name < b.name ? -1 : 1);
    this.tests.replace(testCollection);
  }

  saveConfig() {
    localStorage.setItem('louisTestConfig', this.tests.map(t => `${t.id}#${t.disabled ? '0' : '1'}`).join('|'));
    localStorage.setItem('louisStoryView', this.storyView);
    localStorage.setItem('luisTheme', this.theme);
    localStorage.setItem('luisLog', this.logLevel);
    localStorage.setItem('luisDevTools', this.showDevTools ? '1' : '0');
  }

  @action toggleAllTests(disabled: boolean) {
    this.tests.forEach(t => t.disabled = disabled);
  }

  @action toggleStoryTests(id: string, disabled: boolean) {
    let config = this.tests.find(t => t.id === id);
    if (config) {
      config.disabled = disabled;
    }
  }

  @action toggleStoryView() {
    this.storyView = this.storyView === 'list' ? 'tree' : 'list';
    this.saveConfig();
  }

  isDisabled(group: TestGroup) {
    const config = this.tests.find(t => t.id === group.id);
    return config && config.disabled;
  }
}
