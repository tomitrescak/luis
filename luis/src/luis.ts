#!/usr/bin/env node
// check if custom config exists
const fs = require('fs');
const path = require('path');

// parse parameters
let init = false;
let tests = '';
let root = 'src';
let entryFile = 'luis.';
let language = 'ts';
let customSet = false;
let start = true;
let bundler = 'fusebox';

function rtl(source: string) {
  const templatePath = require.resolve(`./templates/${source}`);
  // console.log('Loading: ' + templatePath);
  return fs.readFileSync(templatePath, { encoding: 'utf-8' });
}

function launch(program: string) {
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
    entryFile = process.argv[i + 1];
    i++;
  }
}

if (init) {
  console.log('✏️  Initialising Luis');
  let file = path.resolve(path.join(root, entryFile + language));
  let dir = path.dirname(file);

  if (!fs.existsSync(dir)) {
    console.log('Root directory does not exist');
    console.log('📁  Creating: ' + dir);
    fs.mkdirSync(dir, { recursive: true });
  }

  // load test file
  const configFile = tests ? rtl('entry_tests.js') : rtl('entry_no_tests.js');

  let configPath = path.resolve(file);
  if (fs.existsSync(configPath)) {
    console.log('🔧  Luis config already exists');
  } else {
    console.log('✅  Luis config created at: ' + file);
    fs.writeFileSync(configPath, configFile, { encoding: 'utf-8' });
  }

  if (tests === 'jest') {
    let testFilePath = path.resolve(`jest.config.js`);
    if (fs.existsSync(testFilePath)) {
      console.log('🔧  Jest config already exists');
    } else {
      let testFile = language === 'js' ? rtl('jest.config.js') : rtl('jest.config.ts');
      testFile = testFile
        .replace(/\$root/g, root)
        .replace('$ignore', `<rootDir>/${root}/summary.${language}`);
      fs.writeFileSync(testFilePath, testFile, { encoding: 'utf-8' });
      console.log('✅  Jest config created at: ' + testFilePath);
    }
  } else if (tests === 'mocha') {
    console.log('❌  Mocha currently not supported');
  } else if (tests === 'jasmine') {
    console.log('❌  Jasmine currently not supported');
  } else if (tests) {
    console.error('❌  Test not supported: ' + tests);
  }

  let bundlerPath, bundlerConfig;
  if (bundler === 'fusebox') {
    bundlerPath = path.resolve('luis.fuse.js');
    bundlerConfig = rtl('luis.fuse.js')
      .replace('$root', root)
      .replace(/\$entry/g, entryFile + language);

    let entryPath = path.resolve('luis.fuse.html');
    if (!fs.existsSync(entryPath)) {
      let entryContent = rtl('luis.fuse.html');
      fs.writeFileSync(entryPath, entryContent, { encoding: 'utf-8' });
      console.log('✅  Fuse-Box entry created at: ' + entryPath);
    }
  } else if (bundler === 'parcel') {
  } else if (bundler === 'webpack') {
  } else if (bundler === 'cra') {
  } else {
    throw new Error('❌  Bundler not supported: ' + bundler);
  }
  if (!fs.existsSync(bundlerPath)) {
    fs.writeFileSync(bundlerPath, bundlerConfig, { encoding: 'utf-8' });
    console.log('✅  Bundler config file created at: ' + bundlerPath);
  }
}

if (!init) {
  const fuseConfig = path.resolve('luis.fuse.js');
  const parcelConfig = path.resolve('luis.index.html');
  const webpackConfig = path.resolve('luis.webpack.js');
  const cra = path.resolve('node_modules/react-scripts');

  if (fuseConfig) {
    console.log('🚀  Found Fuse-Box config. Fusing Luis in 3..2..1');
    launch('node luis.fuse.js');
  } else if (parcelConfig) {
  } else if (webpackConfig) {
  } else if (cra) {
  } else {
    console.log(
      '❌  Luis could not find a runtime file for any supported bundler. Please run "luis init" and see the documentation for all cli options'
    );
  }
}
