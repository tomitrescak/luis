import { config } from 'chai-match-snapshot';

export function loadSnapshots() {
  if (global.FuseBox) {
    const snapshotsRaw = FuseBox.import('~/tests/snapshots/*.json');
    const snapshots: { [index: string]: object } = {};
    for (let key of Object.getOwnPropertyNames(snapshotsRaw)) {
      let parts = key.split('/');
      // take the filename
      let name = parts[parts.length - 1].toLowerCase();
      // remove the _snapshot.json suffix
      name = name.replace('_snapshots.json', '');
      snapshots[name] = snapshotsRaw[key];
    }
    config.snapshotLoader = (name: string, className: string) => {
      return snapshots[className];
    };
  }
}