#!/usr/bin/env node
// check if custom config exists
const fs = require('fs');
const path = require('path');

// parse parameters
let init = false;
let tests = '';
let root = 'src';
let run = 'luis.';
let language = 'ts';
let customSet = false;
let start = true;
let bundler = 'fusebox';

function rtl(source) {
  const templatePath = require.resolve(`./templates/${source}`);
  // console.log('Loading: ' + templatePath);
  return fs.readFileSync(templatePath, { encoding: 'utf-8' });
}

function launch(program) {
  require('child_process').spawnSync(program, {
    stdio: 'inherit',
    shell: true,
    cwd: path.resolve('.')
  });
}

for (let i = 0; i < process.argv.length; i++) {
  let arg = process.argv[i];
  if (arg === 'init') {
    init = true;
  }
  if (arg === 'start') {
    start = true;
  }
  if (arg === '--tests') {
    tests = process.argv[i + 1];
    i++;
  }
  if (arg === '--language') {
    language = process.argv[i + 1];
    i++;
  }
  if (arg === '--bundler') {
    bundler = process.argv[i + 1];
    i++;
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

if (init) {
  if (!customSet) {
    console.log(
      "No root and entry file specified. Estimating 'src' as project root and 'luis.ts' as the entry files."
    );
    console.log(
      "If you want to use a different entry file, please run process as 'node luis init --root /your/root --run path/to/luis.ts"
    );
  }

  let file = path.resolve(path.join(root, run + language));
  let dir = path.dirname(file);

  if (!fs.existsSync(dir)) {
    console.log('Root directory does not exist');
    console.log('Creating: ' + dir);
    fs.mkdirSync(dir, { recursive: true });
  }

  // load test file
  const configFile = tests ? rtl('entry_tests.js') : rtl('entry_no_tests.js');

  let configPath = path.resolve(file);
  if (fs.existsSync(configPath)) {
    console.log('Luis config already exists');
  } else {
    console.log('Creating: ' + file);
    fs.writeFileSync(configPath, configFile, { encoding: 'utf-8' });
  }

  if (tests === 'jest') {
    let testFilePath = path.resolve(`jest.config.js`);
    if (fs.existsSync(testFilePath)) {
      console.log('Jest config file already exists');
    } else {
      let testFile = language === 'js' ? rtl('jest.config.js') : rtl('jest.config.ts');
      testFile = testFile
        .replace(/\$root/g, root)
        .replace('$ignore', `<rootDir>/${root}/summary.${language}`);
      fs.writeFileSync(testFilePath, testFile, { encoding: 'utf-8' });
      console.log('Creating: ' + testFilePath);
    }
  } else if (tests === 'mocha') {
    console.log('Currently not supported');
  } else if (tests === 'jasmine') {
    console.log('Currently not supported');
  } else {
    console.error('Test not supported: ' + tests);
  }

  let bundlerPath, bundlerConfig;
  if (bundler === 'fusebox') {
    bundlerPath = path.resolve('luis.fuse.js');
    bundlerConfig = rtl('luis.fuse.js')
      .replace('$root', root)
      .replace(/\$entry/g, run + language);
    console.log('Creating: ' + bundlerPath);
  } else if (bundler === 'parcel') {
  } else if (bundler === 'webpack') {
  } else if (bundler === 'cra') {
  } else {
    console.error('Bundler not supported: ' + bundler);
    return;
  }
  fs.writeFileSync(bundlerPath, bundlerConfig, { encoding: 'utf-8' });
  return;
}

const fuseConfig = path.resolve('luis.fuse.js');
const parcelConfig = path.resolve('luis.index.html');
const webpackConfig = path.resolve('luis.webpack.js');
const cra = path.resolve('node_modules/react-scripts');

if (fuseConfig) {
  console.log('Found Fuse-Box config. Fusing luis in 3..2..1');
  launch('node luis.fuse.js');
} else if (parcelConfig) {
} else if (webpackConfig) {
} else if (cra) {
} else {
  console.log(
    'Luis could not find a runtime file for any supported bundler. Please run "luis init" and see the documentation for all cli options'
  );
}
