import { findStory, findTestPath } from './louis';
import { Story, StoryType, Test, TestType } from './state/story';
import { TestConfig } from 'fuse-test-runner';
import { initState } from "./state/state";

let currentStory: StoryType = null;

export interface ITestItem {
  title: string;
  className: string;
  cls: any;
}

export interface IReport {
  data: {
    success: boolean
    error: { message: string } ;
  }
  item: ITestItem;
}

export class Reporter {
  currentStory: StoryType;
  test: TestType;
  
  public initialize(tests: any) { /* */
  }

  public startFile(name: string) {
    // console.log(name);
  }
  public startClass(name: string, item: ITestItem) {
    // console.log(item.title)
    const story = findStory(findTestPath(item));
    if (story) {
      story.isRunning(true);
    }
    currentStory = story;
  }
  public endClass(name: string, item: ITestItem) {
    // $printLine();
    // $printSubCategory(item.title)
    const story = findStory(findTestPath(item));
    if (story) {
      story.isRunning(false);
    }
  }

  public testCase(report: IReport) {
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
      this.test = Test.create({ name: testName });
      story.tests.push(this.test);
    }

    if (report.data.success) {
      this.test.result = null;
      // console.log(report.item.title || report.item.method)
    } else {
      if (report.data.error.message && report.data.error.message.match(/Snapshot file/)) {
        if (story.snapshots) {
          this.test.result = report.data.error.message;
        }
      } else {
        this.test.result = report.data.error.message;
      }
      // let message = report.data.error.message ? report.data.error.message : report.data.error;
      // console.log(report.item.title || report.item.method, message)
    }
  }

  public endTest(stats: any, took: any) {
    // console.log(stats, took);
  }
}

TestConfig.onProcessSnapshots = (taskName: string, snapshotName: string, current: string, expected: string) => {
  if (currentStory) {
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
