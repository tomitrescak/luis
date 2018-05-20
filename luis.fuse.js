const { FuseBox, WebIndexPlugin, ImageBase64Plugin, JSONPlugin } = require('fuse-box');
const JsxControlsPugin = require('jsx-controls-loader').fuseBoxPlugin;

const { SnapshotPlugin } = require('luis/dist/bridges/jest/snapshot_plugin');

module.exports = function(root, entry) {
  const fuse = FuseBox.init({
    homeDir: root,
    target: 'browser@es6',
    output: '../../luis/$name.js',
    plugins: [
      WebIndexPlugin({ template: 'index.html', target: 'index.html' }),
      JsxControlsPugin,
      ImageBase64Plugin(),
      JSONPlugin(),
      SnapshotPlugin()
    ],
    sourceMaps: true
  });
  const historyAPIFallback = require('connect-history-api-fallback');

  fuse.dev({ port: 3000 }, server => {
    const app = server.httpServer.app;
    app.use(historyAPIFallback());
  });

  fuse
    .bundle('vendor')
    // Watching (to add dependencies) it's damn fast anyway
    // first bundle will get HMR related code injected
    .instructions(` ~ ${entry}`); // nothing has changed here

  fuse
    .bundle('app')
    .instructions(` !> [${entry}]`)
    .hmr()
    .watch();
  fuse.run();
};
