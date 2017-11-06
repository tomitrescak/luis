import { TestRunner } from './test_runner';
import { TestGroup } from '../models/test_group_model';

function clearExtension(path: string) {
  return path.substring(0, path.lastIndexOf('.'));
}


export class TestQueue {
  queue: TestGroup[] = [];
  testRunner: TestRunner;
  running = false;
  stopped = false;

  canAddTest = true;
  hmrQueue: string[] = [];

  testIndex = 0;

  constructor(testRunner: TestRunner) {
    this.testRunner = testRunner;

    if (typeof FuseBox !== 'undefined') {
      FuseBox.on("before-import", (_exports: any, _require: any, _module: any, filename: string) => {                
        let file = clearExtension(filename);
        if (this.hmrQueue.indexOf(file) >= 0) {
          // console.log('Allowing to add test for: ' + file);
          this.canAddTest = true;
        }
      });
      
      FuseBox.on("after-import", (_exports: any, _require: any, _module: any, filename: string) => {                
        let file = clearExtension(filename);
        if (this.hmrQueue.indexOf(file) >= 0) {
          this.hmrQueue.splice(this.hmrQueue.indexOf(file), 1);
          // console.log('Removing access for: ' + file);
          this.canAddTest = false;
        }
      });
    }
  }
  stop() {
    // console.log('Stopping queue');
    this.stopped = true;
  }

  start() {
    // console.log('Starting queue');
    this.stopped = false;
    if (!this.running) {
      this.processQueue();
    }
  }

  add(group: TestGroup) {
    if (group.tests.length == 0) {
      // console.log('Ignoring for no tests: ' + group.name);
      return;
    }

    if (!this.canAddTest) {
      // console.log('Not running tests as not part of HMR: ' + group.name);
      return;
    }

    // if we do not want to run tests we skip it
    if (this.queue.indexOf(group) == -1) {
      this.queue.push(group);
    }
    
    if (!this.stopped && !this.running) {
      this.processQueue();
    }
  }


  hmr(name: string, _content: string, dependants: any) {
    // KNOWN ISSUE: If JSON and JS come in the same HMR batch 
    //   and js is loaded after json, not all tests will be run
    //   should not happen very often though
    //   probably can be solved with some timer

    // enable hmr
    // changed snapshot reloads all tests
    if (name.substring(name.length - 5) == '.json') {
      // console.log('Adding all tests ...');
      this.canAddTest = true;
    } else {
      // we perform selective tests
      this.canAddTest = false; 
    }
    
    if (name.indexOf('.test') > 0) {
      this.hmrQueue.push(clearExtension(name));
    }

    // use breadth first search to find dependent test files
    // also avoid loops
    if (dependants[name]) {

      const queue: string[] = [name];
      dependants[name].visited = true;

      while (queue.length > 0) {
        let current = queue.shift();
        if (current.indexOf('.test') > 0) {
          // console.log('Adding test after hmr: ' + current);
          this.hmrQueue.push(clearExtension(current));
        }
        if (dependants[current]) {
          for (let dependencyName of dependants[current]) {
            if (dependants[dependencyName] && !dependants[dependencyName].visited) {
              queue.push(dependencyName);
            }
          }
        }
        // mark as visited
        dependants[current].visited = true;
      }
    } else {
      // console.log('Ignoring file with no dependants: ' + name)
    }
  }

  async processQueue() {
    if (this.queue.length > 0) {
      this.running = true;
      let group = this.queue.shift();

      // console.log(`Running ${this.queue.length} tests for: ` + group.name);

      try {
        await this.testRunner.testGroup(group);
      } finally {
        this.processQueue();
      }
    } else {
      this.running = false;
      // console.log('Finished all tests');
      // update count of passed and failed tests
      this.testRunner.state.liveRoot.updateCounts();
    }
  }
};