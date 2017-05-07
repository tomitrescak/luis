import { IObservableArray, observable } from 'mobx';
import { formatComponent } from './helpers';

export interface Snapshot {
  current: string;
  expected: string;
  name: string;
  storyName: string;
  matching: boolean;
  html: string;
}

export class Story {
  name: string;
  info: string;
  renderedComponent: Function;
  component: Function;
  className: string;
  
  actions: IObservableArray<string>;
  runTests = false;
  tests: () => void;

  @observable activeSnapshot: number = 0;
  @observable snapshots: Snapshot[] = [];
  @observable testing: boolean = true;

  decorator: any;

  constructor(storyName: string, info: string, component: Function, decorator: Function) {
    this.name = storyName;
    this.info = '';
    this.component = component;
    this.renderedComponent = this.tryRender(component, decorator);
    this.actions = observable([]);

    if (info) {
      this.info = '### Description\n\n' + info + '\n\n';
    }

    this.info += '### Usage';
    let mount = component();

    if (mount) {
      this.info += `
\`\`\`javascript
${formatComponent(mount)}
\`\`\`
      `;
    }
  }

  tryRender(component: Function, decorator: Function) {
    return () => {
      try {
        return decorator ? decorator(() => component(false)) : component(false);
      } catch (ex) {
        console.error(ex);
        return 'Error: ' + ex.mesage;
      }
    };
  }
}
