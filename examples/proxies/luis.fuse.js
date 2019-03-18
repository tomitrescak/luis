const {
  FuseBox,
  EnvPlugin,
  JSONPlugin,
  CSSPlugin,
  ImageBase64Plugin,
  WebIndexPlugin
} = require('fuse-box');

const SnapshotPlugin = require('luis/fuse-box/snapshot-plugin').SnapshotPlugin;

const luisFuse = FuseBox.init({
  homeDir: 'src',
  output: 'public/$name.js',
  target: 'browser',
  sourceMaps: true,
  plugins: [
    EnvPlugin({ NODE_ENV: 'test' }),
    SnapshotPlugin(),
    ImageBase64Plugin(),
    JSONPlugin(),
    CSSPlugin({
      group: 'luis.css',
      outFile: `public/styles/luis.css`,
      inject: false
    }),
    WebIndexPlugin({ template: 'luis.fuse.html', target: 'index.html' })
  ]
});

luisFuse.dev({
  fallback: 'index.html',
  port: 9001
});

luisFuse.bundle('luis-vendor').instructions(` ~ luis.ts`); // nothing has changed here

luisFuse
  .bundle('luis-client')
  .watch() // watch only client related code
  .hmr()
  .sourceMaps(true)
  .instructions(
    ` !> [luis.ts] + **/*.fixture.* + **/*.story.* + **/*.test.* + **/__fixtures__/* + **/__stories__/* + **/__tests__/* + **/tests/*`
  );

luisFuse.run();
