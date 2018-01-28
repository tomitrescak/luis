import { createBridge, Snapshots } from './bridge';
import { Bridge, setupBridge } from '../../client/index';

export const bridge: Bridge = {
  onReconciled(state) { },
  async updateSnapshots(state, name) {
    if (name) {
      state.updatingSnapshots = true;
      await fetch(`/tests?name=${name}`);
      state.updatingSnapshots = false;
    }
  },
  hmr(path, content, dependants) { }
}

export function setupJestBridge(testData: jest.AggregatedResult, snapshots: Snapshots) {
  setupBridge((state) => {
    
    // create new brifdge
    createBridge(state, testData, snapshots);

    // return the new bridge
    return bridge;
  });
}