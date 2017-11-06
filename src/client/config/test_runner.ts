import { config } from 'chai-match-snapshot';
import { updateStoredSnapshot } from './snapshot_loader';
import { Test } from '../models/test_model';
import { TestGroup } from '../models/test_group_model';
import { initState } from '../models/state_model';
import { Snapshot } from '../models/snapshot_model';

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

  state: Luis.State;

  constructor(state: Luis.State) {
    this.state = state;
  }

  public async testGroup(group: TestGroup) {
    const state = this.state.viewState;
    if (
      state.bare &&
      state.selectedTest &&
      state.selectedTest.parent.id != group.id
    ) {
      return;
    }

    if (this.state.config.isDisabled(group)) {
      return true;
    }

    consoleGroup(group.path);
    let result = true;

    if (group.before) {
      group.before();
    }

    config.snapshotCalls = null;

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

    // calculate passing and failing
    group.passingTests = group.countTests(true);
    group.failingTests = group.countTests(false);

    consoleGroupEnd();

    return result;
  }

  public async startTest(test: Test) {
    // console.log('Executing: ' + test.name + '[' + test.uid + ']');

    // in single mode we only add current tests
    const state = this.state.viewState;
    if (state.bare && state.selectedTest && state.selectedTest.name != test.name) {
      return;
    }

    const group = test.parent as TestGroup;
    test.startTime = new Date().getTime();
    test.endTime = 0;
    test.snapshots.clear();

    currentTest = test;

    try {
      if (group.beforeEach) {
        group.beforeEach();
      }

      config.currentTask = {
        title: test.name,
        className: group.fileName,
        cssClassName: null,
        decorator: null
      };

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

let timeout: any = null;
function queueUpdateSnapshot(updateGroup: TestGroup) {
  if (timeout) {
    clearTimeout(timeout);
  }
  // update snapshots in two seconds (after max timeout interval)
  timeout = setTimeout(() => updateSnapshot(updateGroup), 100);
}

function updateSnapshot(updateGroup: TestGroup) {
  let state = initState();

  // serialise all generated current styles
  let allStylesheets: any[] = [];
  for (let i = 0; i < document.styleSheets.length; i++) {
    let ss = document.styleSheets[i];
    if (!ss.href) {
      allStylesheets.push(ss);
    }
  }
  let val = '';
  for (let ss of allStylesheets) {
    for (let rule of ss.rules) {
      val += rule.cssText + '\n';
    }
  }

  // serialise css
  if (val) {
    fetch('/tests', {
      method: 'post',
      body: JSON.stringify({
        name: 'generated.css',
        snapshots: val
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      } as any
    }).catch(e => alert(e));
  }

  fetch('/tests', {
    method: 'post',
    body: JSON.stringify({
      name: updateGroup.fileName,
      snapshots: updateGroup.snapshots
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    } as any
  }).catch(e => alert(e));

  state.updatingSnapshots = false;

  // update also snapshots that we have retrieved fro server
  updateStoredSnapshot(updateGroup);
}

config.onProcessSnapshots = (_taskName: string, snapshotName: string, current: string, expected: string) => {
  let state = initState();
  if (current) {
    current = current.replace(/ style="pointer-events: all;"/g, '');
  }
  if (expected) {
    expected = expected.replace(/ style="pointer-events: all;"/g, '');
  }

  if (currentTest) {
    // if (!currentStory.snapshots) {
    //   currentStory.snapshots = observable([]);
    // }
    let name = snapshotName;
    while (name.length > 0 && name[name.length - 1].match(/[1\s]/)) {
      name = name.substring(0, name.length - 1);
    }
    const index = currentTest.snapshots.findIndex(s => s.name === name);

    // we can auto update snapshots
    expected = state.updatingSnapshots || state.autoUpdateSnapshots ? current : expected;

    const snapshot: Snapshot = new Snapshot({
      test: currentTest,
      expected,
      current,
      matching: current === expected,
      name,
      originalName: snapshotName
    });
    if (index === -1) {
      currentTest.snapshots.push(snapshot);
    } else {
      currentTest.snapshots.splice(index, 1, snapshot);
    }

    if (state.updatingSnapshots || state.autoUpdateSnapshots) {
      queueUpdateSnapshot(state.viewState.selectedStory);
      return { expected };
    }
    // console.log('Adding snapshot: ' + currentTest.name + '[' + currentTest.uid + ']');
  }

  return {
    actual: current,
    expected
  };
};
