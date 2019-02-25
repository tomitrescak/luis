#!/usr/bin/env node
// check if custom config exists
const fs = require('fs');
const path = require('path');

// parse parameters
let init = false;
let tests = false;
let root = 'src';
let run = 'luis.ts';
let customSet = false;

for (let i = 0; i < process.argv.length; i++) {
  let arg = process.argv[i];
  if (arg === '--init') {
    init = true;
  }
  if (arg === '--tests') {
    tests = true;
  }
  if (arg === '--root') {
    root = process.argv[i + 1];
    customSet = true;
    i++;
  }
  if (arg === '--run') {
    customSet = true;
    run = process.argv[i + 1];
    i++;
  }
}

const testLoadTemplate = `loadTests: () => {
    // keep whatever your preference is
    // make sure these files are packed by your bundler
    // we pack following by fuse-box by default
    require('**.test');
    require('**.story');
    require('**.fixture');
  }`;

if (init) {
  let file = path.resolve(path.join(root, run));
  let dir = path.dirname(file);

  try {
    fs.statSync(dir);
  } catch {
    console.log('Root directory does not exist');
    console.log('Creating: ' + dir);
    fs.mkdirSync(dir, { recursive: true });
  }

  let configPath = path.resolve(file);
  try {
    fs.statSync(configPath);
    console.log('Luis config already exists');
    return;
  } catch (ex) {
    if (tests) {
      console.log('Creating luis config with tests at: ' + file);
      fs.writeFileSync(
        configPath,
        `import { renderLuis } from 'luis';

const { snapshots, report } = require('./summary');
renderLuis({
  snapshots,
  report,
  ${testLoadTemplate}
});`,
        { encoding: 'utf-8' }
      );
    } else {
      console.log('Creating standard luis config at: ' + file);
      fs.writeFileSync(
        configPath,
        `import { renderLuis } from 'luis';

renderLuis({
  ${testLoadTemplate}
});`,
        { encoding: 'utf-8' }
      );
    }

    return;
  }
}

const customConfig = path.resolve('luis.fuse.js');

try {
  fs.statSync(customConfig);
  console.log('Found custom luis config at');
  require(customConfig);
  return;
} catch (ex) {
  console.log('Custom config not found. Launching standard configuration.');
}

if (!customConfig) {
  console.log(
    "No root and entry file specified. Estimating 'src' as project root and 'luis.ts' as the entry files."
  );
  console.log(
    "If you want to use a different entry file, please run process as 'node luis --root /your/root --run path/to/luis.ts"
  );
}
// validate paths
let fullRoot = path.resolve(root);
let fullPath = path.join(fullRoot, run);
try {
  fs.statSync(fullPath);
  console.log('Config: ' + require.resolve('./luis.fuse'));
  console.log('Luis: ' + fullPath);
  require('./luis.fuse')(root, run);
  return;
} catch (ex) {
  console.log(`Could not find your run file at: ${fullPath}`);
  console.log(`If you do not have a start file at 'src/luis.ts' plese run luis as:`);
  console.log(`yarn luis --root path/to/root --run path/to/file.js`);
}
