import { createBridge, Snapshots } from './bridge';
import { Bridge, setupBridge } from '../../client/index';

export const bridge: Bridge = {};

export function setupJestBridge(
  testData: jest.AggregatedResult = {} as any,
  snapshots: Snapshots = {}
) {
  setupBridge(state => {
    // hide top menus if we have no test results
    if (!Array.isArray(testData.testResults) || testData.testResults.length === 0) {
      state.hideMenus(true);
    }

    // create new bridge
    createBridge(state, testData, snapshots);

    // return the new bridge
    return bridge;
  });
}

export const setupTestBridge = setupJestBridge;
