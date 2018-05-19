import { createBridge, Snapshots } from './bridge';
import { Bridge, setupBridge } from '../../client/index';

export const bridge: Bridge = {
  onReconciled(_state) {},
  async updateSnapshots(state, name) {
    if (name) {
      state.updatingSnapshots = true;
      await fetch(`/tests?name=${name}`);
      state.updatingSnapshots = false;
    }
  },
  hmr(_path, _content, _dependants) {}
};

export function setupJestBridge(
  testData: jest.AggregatedResult = {} as any,
  snapshots: Snapshots = {}
) {
  setupBridge(state => {
    // // merge data
    // let previousResult = state.previousResults;
    // testData = merge(previousResult, testData);
    // state.previousResults = testData;
    if (!state.previousResults) {
      state.previousResults = testData;
    } else {
      let merged: jest.AggregatedResult = state.previousResults;
      merged.numFailedTests = testData.numFailedTests;
      merged.numPassedTests = testData.numPassedTests;

      for (let result of testData.testResults) {
        let p = merged.testResults.findIndex(f => f.testFilePath === result.testFilePath);
        if (p >= 0) {
          merged.testResults[p] = result;
        }
      }
      state.previousResults = merged;
      testData = merged;
    }

    // create new bridge
    createBridge(state, testData, snapshots);

    // return the new bridge
    return bridge;
  });
}

export const setupTestBridge = setupJestBridge;
