import { findStory, findTestPath } from './louis';
import { Story } from './state/story';
import { state } from './state/state';
import { TestConfig } from 'fuse-test-runner';

let currentStory: Story = null;

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
  public initialize(tests) { /* */
  }

  public startFile(name: string) {
    // console.log(name);
  }
  public startClass(name: string, item: ITestItem) {
    // console.log(item.title)
    const story = findStory(findTestPath(item));
    if (story) {
      story.testing = true;
    }
    currentStory = story;
  }
  public endClass(name: string, item: ITestItem) {
    // $printLine();
    // $printSubCategory(item.title)
    const story = findStory(findTestPath(item));
    if (story) {
      story.testing = false;
    }
  }

  public testCase(report: IReport) {
    TestConfig.snapshotCalls = null;
    const folder = report.item.cls.folder;
    let testPath = null;

    let story: Story = null;

    if (folder) {
      testPath = findTestPath(report.item);
      story = findStory(testPath);
    }

    if (report.data.success) {
      // console.log('SUCCESS: ' + report.item.title);

      if (testPath) {
        state.catalogue.update(testPath);
      }
      // console.log(report.item.title || report.item.method)
    } else {
      if (report.data.error.message && report.data.error.message.match(/Snapshot file/)) {
        let className = report.item.className;
        let request = state.requests[className];
        if (request.requesting) {
          this.waitForSnapshot(request, className);
        } else {
          state.catalogue.update(testPath, report.data.error.message);
        }
      } else {
        if (testPath) {
          state.catalogue.update(testPath, report.data.error.message);
        }
      }
      // let message = report.data.error.message ? report.data.error.message : report.data.error;
      // console.log(report.item.title || report.item.method, message)
    }
  }

  public endTest(stats, took) {
    // console.log(stats, took);
  }

  private waitForSnapshot(request: any, className: string) {

    // if (request.requesting) {
    //   setTimeout(() => this.waitForSnapshot(request, className), 200);
    //   return;
    // }

    // // we finally have a response
    // let test = { [className]: state.tests[className] };
    // state.runner.startTests(test);
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
