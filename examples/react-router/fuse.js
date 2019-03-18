const {
  FuseBox,
  JSONPlugin,
  CSSPlugin,
  ImageBase64Plugin,
  EnvPlugin,
  WebIndexPlugin
} = require('fuse-box');

const SnapshotPlugin = require('luis/fuse-box/snapshot-plugin').SnapshotPlugin;

const luisFuse = FuseBox.init({
  homeDir: 'src',
  output: 'public/$name.js',
  target: 'browser@esnext',
  sourceMaps: true,
  plugins: [
    SnapshotPlugin(),
    ImageBase64Plugin(),
    JSONPlugin(),
    EnvPlugin({ NODE_ENV: 'development' }),
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
  port: 3000
});

luisFuse.bundle('vendor').instructions(' ~ index.tsx'); // nothing has changed here

luisFuse
  .bundle('client')
  .watch() // watch only client related code
  .hmr()
  .sourceMaps(true)
  .instructions(' !> [index.tsx] + **/*.test.* + **/__tests__/* + **/**.snap');

luisFuse.run();
