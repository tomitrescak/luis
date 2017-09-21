import { TestGroup } from './test_data';
import { TestRunner } from './test_runner';

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

  constructor(testRunner: TestRunner) {
    this.testRunner = testRunner;

    FuseBox.on("before-import", (_exports: any, _require: any, _module: any, filename: string) => {                
      let file = clearExtension(filename);
      if (this.hmrQueue.indexOf(file) >= 0) {
        console.log('Allowing to add test for: ' + file);
        this.canAddTest = true;
      }
    });
    
    FuseBox.on("after-import", (_exports: any, _require: any, _module: any, filename: string) => {                
      let file = clearExtension(filename);
      if (this.hmrQueue.indexOf(file) >= 0) {
        this.hmrQueue.splice(this.hmrQueue.indexOf(file), 1);
        console.log('Removing access for: ' + file);
        this.canAddTest = false;
      }
    });
  }
  stop() {
    console.log('Stopping queue');

    this.stopped = true;
  }

  start() {
    console.log('Starting queue');
    
    this.stopped = false;
    if (!this.running) {
      this.processQueue();
    }
  }

  add(group: TestGroup) {
    if (group.tests.length == 0) {
      console.log('Ignoring for no tests: ' + group.name);
      return;
    }

    if (!this.canAddTest) {
      console.log('Cannot add tests for: ' + group.name);
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


  hmr(name: string, content: string, dependants: any) {
    // enable hmr
    this.canAddTest = false; 
    
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
          console.log('Adding test after hmr: ' + current);
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
      console.log('Ignoring file with no dependants: ' + name)
    }
  }

  async processQueue() {
    if (this.queue.length > 0) {
      this.running = true;
      let group = this.queue.shift();

      console.log(`Running ${this.queue.length} tests for: ` + group.name);

      try {
        await this.testRunner.testGroup(group);
      } finally {
        this.processQueue();
      }
    } else {
      this.running = false;
      console.log('Finished all tests');
      // update count of passed and failed tests
      this.testRunner.state.liveRoot.updateCounts();
    }
  }
};