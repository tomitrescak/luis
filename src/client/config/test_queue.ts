import { Test, TestGroup } from './test_data';
import { StateModel } from './state';
import { observable } from "mobx";
import { TestRunner } from './test_runner';

export class TestQueue {
  queue: TestGroup[] = [];
  testRunner: TestRunner;
  @observable running = false;

  constructor(testRunner: TestRunner) {
    this.testRunner = testRunner;
  }

  add(group: TestGroup) {
    // if we do not want to run tests we skip it
    this.queue.push(group);
    
    if (!this.running) {
      this.processQueue();
    }
  }

  async processQueue() {
    if (this.queue.length > 0) {
      this.running = true;
      let group = this.queue.shift();
      try {
        await this.testRunner.testGroup(group);
      } finally {
        this.processQueue();
      }
    } else {
      this.running = false;

      // update count of passed and failed tests
      this.testRunner.state.liveRoot.updateCounts();
    }
  }
};