import { config } from 'chai-match-snapshot';
import { TestGroup, Test, Snapshot } from './test_data';

export function logError(message: string, ...props: string[]) {
  if (localStorage.getItem('luisLog') == null) {
    localStorage.setItem('luisLog', '1');
  }
  if (localStorage.getItem('luisLog') == '1' || localStorage.getItem('luisLog') == '2') {
    console.log(message, ...props);
  }
}

export function logInfo(message: string, ...props: string[]) {
  if (localStorage.getItem('luisLog') == null) {
    localStorage.setItem('luisLog', '1');
  }
  if (localStorage.getItem('luisLog') == '1') {
    console.log(message, ...props);
  }
}

function consoleGroup(name: string) {
  if (localStorage.getItem('luisLog') == '1' && console.group) {
    console.group(name);
  }
}

function consoleGroupEnd() {
  if (localStorage.getItem('luisLog') == '1' && console.groupEnd) {
    console.groupEnd();
  }
}

let currentTest: Test;

export class TestRunner {
  private startTime: number;

  state: App.State;

  constructor(state: App.State) {
    this.startTime = new Date().getTime();
    this.state = state;
  }

  public async testGroup(group: TestGroup) {
    if (this.state.config.isDisabled(group)) {
      return true;
    }

    group.startTime = new Date().getTime();

    consoleGroup(group.path);
    let result = true;

    if (group.before) {
      group.before();
    }

    // run all tests
    for (let test of group.tests) {
      result = (await this.startTest(test)) && result;
    }

    // run all sub groups
    for (let subGroup of group.groups) {
      await this.testGroup(subGroup);
    }

    if (group.after) {
      group.after();
    }

    group.endTime = new Date().getTime();

    // calculate passing and failing
    group.passingTests = group.countTests(true);
    group.failingTests = group.countTests(false);

    consoleGroupEnd();

    return result;
  }

  public async startTest(test: Test) {
    console.log('Executing: ' + test.name + '[' + test.uid + ']');

    const group = test.parent as TestGroup;
    test.startTime = new Date().getTime();
    test.endTime = 0;
    currentTest = test;

    try {
      if (group.beforeEach) {
        group.beforeEach();
      }

      config.currentTask = {
        title: test.name,
        className: group.fileName
      };
      config.snapshotCalls = null;

      await test.impl.call(null);

      test.error = null;
      // tslint:disable-next-line:no-console
      logInfo(`%c SUCCESS! '${test.name}' after ${new Date().getTime() - test.startTime}ms`, 'color: green');

      return true;
    } catch (e) {
      // we ignore when error relates to waiting for a snapshot
      if (e.message === 'Snapshot request pending') {
        return false;
      }

      test.error = e;

      let parts = e.stack.split('    at ');

      // tslint:disable-next-line:no-console
      logError(
        `%c ERROR! '${test.name}':` +
          `%c '${e.message.substring(0, 300)}'... after ${new Date().getTime() -
            test.startTime}ms \n    at ${parts[1]}    at ${parts[2]}`,
        'color: red; font-weight: bold',
        'color: red'
      );

      return false;
    } finally {
      if (test.parent.afterEach) {
        group.afterEach();
      }

      test.endTime = new Date().getTime();
    }
  }
}

// process snapshot requires global variable

config.onProcessSnapshots = (_taskName: string, snapshotName: string, current: string, expected: string) => {
  if (currentTest) {
    // if (!currentStory.snapshots) {
    //   currentStory.snapshots = observable([]);
    // }
    let name = snapshotName;
    while (name.length > 0 && name[name.length - 1].match(/[1\s]/)) {
      name = name.substring(0, name.length - 1);
    }
    const index = currentTest.snapshots.findIndex(s => s.name === name);

    const snapshot: Snapshot = new Snapshot({
      test: currentTest,
      expected,
      current,
      matching: current === expected,
      name
    });
    if (index === -1) {
      currentTest.snapshots.push(snapshot);
    } else {
      currentTest.snapshots[index] = snapshot;
    }

    console.log('Adding snapshot: ' + currentTest.name + '[' + currentTest.uid + ']');
  } else {
    console.log('No current test ...');
  }
};
