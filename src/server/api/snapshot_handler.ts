import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';

const snapshotPath = path.resolve('./src/tests/snapshots');

export function handler(request: any, response: any, next: any) {
  const body = request.body;

  const mocha = body.mocha;
 
  if (mocha) {
    const extraParams = body.extraParams || '';
    const snapshotName = body.name;
    const execSync = require('child_process').execSync;
    const command = `TS_NODE_FAST=true UPDATE_SNAPSHOTS=true ./node_modules/.bin/mocha --require ./mocha.js --ui snapshots ${extraParams} 'src/**/*.test.ts*' --compilers ts:ts-node/register --grep "${snapshotName}"`;
    console.log(`Updating snapshots of "${snapshotName}" with mocha`);
    console.log(command);
    try {
      const code = execSync(command);
    } catch (ex) {}
  } else {
    const name = body.name;
    const isCss = name.indexOf('.css') >= 0;
    let snapshots = body.snapshots;

    if (!isCss) {
      snapshots = JSON.stringify(snapshots, null, 2);
    }
    
    const fullPath = path.join(snapshotPath, isCss ? name : (name + '_snapshots.json'));
    const dirname = path.dirname(fullPath);

    console.log('Saving snapshots to: ' + fullPath);

    try {
      fs.statSync(dirname);
    } catch (ex) {
      console.log('Directory does not exist. Creating directory at: ' + dirname);
      fs.mkdirSync(dirname);
    }

    try {
      fs.writeFileSync(fullPath, snapshots);
    } catch (ex) {
      console.error('Error writing snapshots: ' + ex.message);
    }
  }

  response.end('ok lll');
}
