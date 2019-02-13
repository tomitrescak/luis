#!/usr/bin/env node
// check if custom config exists
const fs = require('fs');
try {
  fs.statSync(require.resolve('../../luis.fuse.js'));
  console.log('Found custom luis config.');
  require('../../luis.fuse.js');
  return;
} catch (ex) {
  console.log('Custom config not found. Launching standard configuration.');
}

var root = '../../src';
var file = 'luis.ts';

if (process.argv.length == 4) {
  root = '../../' + process.argv[2];
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
