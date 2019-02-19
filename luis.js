#!/usr/bin/env node
// check if custom config exists
const fs = require('fs');
const path = require('path');

if (process.argv[0] && process.argv[0] == 'init') {
  try {
    let path = path.resolve(process.argv[1] || 'src/luis.js');
    fs.statSync(path);
    console.log('Luis config already exists');
    return;
  } catch (ex) {
    console.log('Creating standard luis config');
    fs.writeFileSync(
      path,
      `import { renderLuis } from 'luis';

renderLuis({
  ...require('./summary'),
  tests: () => require('**.test')
});`,
      { encoding: 'utf-8' }
    );
  }
}

const customConfig = path.resolve('luis.fuse.js');
let root = path.resolve('./src');

try {
  fs.statSync(customConfig);
  console.log('Found custom luis config.');
  require(customConfig);
  return;
} catch (ex) {
  console.log('Custom config not found. Launching standard configuration.');
}

var file = 'luis.ts';

if (process.argv.length == 4) {
  root = path.resolve(process.argv[2]);
  file = process.argv[3];
} else if (process.argv.length == 2) {
  console.log(
    "No root and entry file specified. Estimating 'src' as project root and 'luis.ts' as the entry files."
  );
  console.log(
    "If you want to use a different entry file, please run process as 'node luis root path/to/luis.ts"
  );
} else {
  console.log("Please run your project as 'node luis' or 'node luis root path/to/luis.ts'");
  return;
}

// var path = require('path');
// var appDir = path.dirname(require.main.filename);
// console.log(appDir);

console.log(require.resolve('./luis.fuse'));
require('./luis.fuse')(root, file);
