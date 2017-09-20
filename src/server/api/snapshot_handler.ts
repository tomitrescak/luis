const url = require('url');
const path = require('path');
const fs = require('fs');

const snapshots = path.resolve('./src/tests');

export function handler(request: any, response: any, next: any) {
  let url_parts = url.parse(request.url, true);
  let query = url_parts.query;
  let snapshotName = query.name;
  let extraParams = query.params || '';

  // console.log(snapshotName)

  const execSync = require('child_process').execSync;
  // const jestPath = path.resolve('./fuse');
  // console.log(`UPDATE_SNAPSHOTS=true SNAPSHOT="${snapshotName}" node fuse test`);
  // const code = execSync(`UPDATE_SNAPSHOTS=true SNAPSHOT="${snapshotName}" node fuse test`);
  // console.log(`Updating: ${snapshotName}`);
  const command = `TS_NODE_FAST=true UPDATE_SNAPSHOTS=true ./node_modules/.bin/mocha --require ./mocha.js --ui snapshots 'src/**/*.test.ts*' ${extraParams} --compilers ts:ts-node/register --grep "${snapshotName}"`;

  console.log(command);
  try {
    const code = execSync(command);
  } catch (ex) {
  }

  response.end('ok');
}
