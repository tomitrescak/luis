const url = require('url');
const path = require('path');
const fs = require('fs');

const snapshots = path.resolve('./src/tests');

export function handler(request: any, response: any, next: any) {
  let url_parts = url.parse(request.url, true);
  let query = url_parts.query;
  let snapPath = path.join(snapshots, url_parts.path.split('?')[0]);
  let snapshotName = query.name;
  const update = query.update;

  // maybe replace with fs.readFileSync
  let snap = '{}';

  // console.log(snapshotName)

  if (update) {
    const execSync = require('child_process').execSync;
    // const jestPath = path.resolve('./fuse');
    // console.log(`UPDATE_SNAPSHOTS=true SNAPSHOT="${snapshotName}" node fuse test`);
    // const code = execSync(`UPDATE_SNAPSHOTS=true SNAPSHOT="${snapshotName}" node fuse test`);
    console.log(`Updating: ${snapshotName}`);
    const code = execSync(
      `TS_NODE_FAST=true UPDATE_SNAPSHOTS=true ./node_modules/.bin/mocha --require ./mocha.js --ui snapshots 'src/tests/client_start.ts' 'src/**/*.test.ts*' --compilers ts:ts-node/register --grep "${snapshotName}"`
    );

    console.log(code.toString());
  }

  // console.log(snapPath);

  try {
    fs.statSync(snapPath);
    snap = fs.readFileSync(snapPath, 'utf8');
  } catch (ex) {
    // console.log('Not found!')
  }

  // console.log(snap);
  // write response
  response.writeHead(200, {
    'Content-Type': 'application/json'
  });

  response.end(snap);
}
