const {
  Sparky,
  FuseBox,
  JSONPlugin,
  CSSPlugin,
  CSSResourcePlugin,
  ImageBase64Plugin,
  EnvPlugin,
  WebIndexPlugin,
  UglifyJSPlugin,
  QuantumPlugin
} = require('fuse-box');

const StubPlugin = require('proxyrequire').FuseBoxStubPlugin(/\.tsx?/);
const SnapshotPlugin = require('./fues-box/snapshot-plugin').SnapshotPlugin;

// console.log(require('path').resolve('src'));
const home = require('path').resolve('src');

module.exports = function(root, entry) {
  const luisFuse = FuseBox.init({
    homeDir: home,
    output: 'public/$name.js',
    target: 'browser',
    sourceMaps: true,
    plugins: [
      SnapshotPlugin(),
      StubPlugin,
      ImageBase64Plugin(),
      JSONPlugin(),
      EnvPlugin({ NODE_ENV: 'test' }),
      CSSPlugin({
        group: 'luis.css',
        outFile: `public/styles/luis.css`,
        inject: false
      }),
      WebIndexPlugin({ template: 'index.html', target: 'index.html' })
    ]
  });

  luisFuse.dev({
    fallback: 'index.html',
    port: 9001
  });

  luisFuse.bundle('luis-vendor').instructions(' ~ luis.ts'); // nothing has changed here

  luisFuse
    .bundle('luis-client')
    .watch() // watch only client related code
    .hmr()
    .sourceMaps(true)
    .instructions(' !> [luis.ts] + proxyrequire + **/*.test.* + **/__tests__/* + **/tests/*')
    .globals({
      proxyrequire: '*'
    });

  luisFuse.run();
};
