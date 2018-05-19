export { renderLuis, Luis } from './components/index';
export { StateModel, Bridge, Config, setupBridge } from './models/state_model';
export { Test } from './models/test_model';
export { TestGroup } from './models/test_group_model';
export { Snapshot } from './models/snapshot_model';
export { setupJestBridge, setupTestBridge } from '../bridges/jest';

declare global {
  interface StoryConfig {
    [index: string]: any;
    component?: JSX.Element;
    info?: string;
    cssClassName?: string;
    componentWithData?(
      ...props: any[]
    ):
      | JSX.Element
      | {
          [index: string]: any;
          component: JSX.Element;
          documentRoot?: HTMLElement;
        };
  }
}
