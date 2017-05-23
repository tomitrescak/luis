import { findStory, findTestPath } from './louis';
import { StoryType } from './state/story';
import { TestConfig } from 'fuse-test-runner';
import { StoryDefinition, initState } from './state/state';
import { TestType } from './state/fuse_web_test_runner';

let currentStory: StoryType = null;

export declare type Task = {
  method: string;
  title: string;
  fn: Function;
  fileName: string;
  className: string;
  cls: StoryDefinition
};

export interface Report {
  data: {
    success: boolean
    error?: { message: string };
  };
  item: Task;
}

export class Reporter {
  currentStory: StoryType;
  test: TestType;
  state = initState();

  public initialize(_tests: {}) { /* */
  }

  public startFile() {
    this.state.startedTests();
  }
  public startClass(_name: string, item: Task) {
    // console.log(item.title)
    const story = findStory(findTestPath(item));
    if (story) {
      story.isRunning(true);
    }
    currentStory = story;
  }
  public endClass(_name: string, item: Task) {
    // $printLine();
    // $printSubCategory(item.title)
    const story = findStory(findTestPath(item));
    if (story) {
      story.isRunning(false);
    }
  }

  public testCase(report: Report) {
    TestConfig.snapshotCalls = null;
    const folder = report.item.cls.folder;
    let testPath = null;

    let story: StoryType = null;

    if (folder) {
      testPath = findTestPath(report.item);
      story = findStory(testPath);
    }

    let testName = testPath[testPath.length - 1];
    this.test = story.tests.find(t => t.name === testName);
    if (!this.test) {
      this.test = new TestType(testName);
      story.addTest(this.test);
    }

    // if (report.error) {
    //   console.error(report.error);
    // }

    if (report.data.success) {
      this.test.setResult('');
      // console.log(report.item.title || report.item.method)
    } else {
      if (report.data.error.message && report.data.error.message.match(/Snapshot file/)) {
        if (story.snapshots) {
          this.test.setResult(report.data.error.message);
        }
      } else {
        this.test.setResult(report.data.error.message);
      }
      // let message = report.data.error.message ? report.data.error.message : report.data.error;
    }
  }

  public endTest(_stats: {}, _took: {}) {
    this.state.finishedTests();
  }
}

TestConfig.onProcessSnapshots = (_taskName: string, snapshotName: string, current: string, expected: string) => {
  if (currentStory) {
    if (!currentStory.snapshots) {
      currentStory.snapshots = [];
    }
    const index = currentStory.snapshots.findIndex(s => s.name === snapshotName);
    const snapshot = {
      expected,
      current,
      matching: current === expected,
      storyName: currentStory.name,
      html: current,
      name: snapshotName,
    };
    if (index === -1) {
      currentStory.snapshots.push(snapshot);
    } else {
      currentStory.snapshots[index] = snapshot;
    }
  }
};
