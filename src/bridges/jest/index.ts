import { merge } from 'merge-json';

import { createBridge, Snapshots } from './bridge';
import { Bridge, setupBridge } from '../../client/index';

export const bridge: Bridge = {
  onReconciled(state) {},
  async updateSnapshots(state, name) {
    if (name) {
      state.updatingSnapshots = true;
      await fetch(`/tests?name=${name}`);
      state.updatingSnapshots = false;
    }
  },
  hmr(path, content, dependants) {}
};

export function setupJestBridge(testData: jest.AggregatedResult, snapshots: Snapshots) {
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
