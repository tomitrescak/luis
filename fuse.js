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
const SnapshotPlugin = require('./fuse-box/snapshot-plugin').SnapshotPlugin;

const luisFuse = FuseBox.init({
  homeDir: 'src',
  output: 'public/$name.js',
  target: 'browser@esnext',
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

luisFuse.bundle('luis-vendor').instructions(' ~ examples/showcase/luis.ts'); // nothing has changed here

luisFuse
  .bundle('luis-client')
  .watch() // watch only client related code
  .hmr()
  .sourceMaps(true)
  .instructions(
    ' !> [examples/showcase/luis.ts] + proxyrequire + **/*.test.* + **/__tests__/* + **/**.snap'
  )
  .globals({
    proxyrequire: '*'
  });

luisFuse.run();
