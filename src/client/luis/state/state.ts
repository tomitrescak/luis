// we need to register the proxy functions
import { observable } from 'mobx';
import { Router } from 'yester';
import { TestCatalogue } from './catalogue';
import { Story } from './story';
import { FuseBoxTestRunner } from 'fuse-test-runner';

export const globalCatalogue = new TestCatalogue();

// example mobx store 
export class RouteState {
  @observable path: number[] = [];
  @observable runningTests = false;
  viewedStory: Story = null;
  activeTab = 3;
  catalogue = globalCatalogue;
  requests = {};
  tests = {};
  runner: FuseBoxTestRunner = null;

  findTestRoot(groupPath: string[]) {
    let testsRoot = this.catalogue.catalogue[groupPath[0]];
    for (let i = 1; i < groupPath.length; i++) {
      if (testsRoot) {
        testsRoot = testsRoot[groupPath[i]];
      }
    }
    return testsRoot;
  }
}
export const state = new RouteState();

// render app
const router = new Router([
  {
    $: '/:name/:path',
    enter: ({ params }) => {
      state.path = params['path'].split('-').map(p => parseInt(p, 10));
    }
  },
]);

router.init();
