const {
  Sparky,
  FuseBox,
  JSONPlugin,
  CSSPlugin,
  CSSResourcePlugin,
  EnvPlugin,
  WebIndexPlugin,
  UglifyJSPlugin,
  QuantumPlugin
} = require('fuse-box');

// const StubPlugin = require('proxyrequire').FuseBoxStubPlugin(/\.tsx?/);
// const JsxControlsPugin = require('jsx-controls-loader').fuseBoxPlugin;


function runServer() {
  const serverFuse = FuseBox.init({
    homeDir: 'src',
    output: 'public/$name.js'
  });
  serverFuse
    .bundle('luis-server')
    .watch('server/**') // watch only server related code.. bugs up atm
    .instructions(' > [example/server.ts]')
    // Execute process right after bundling is completed
    // launch and restart express
    .completed(proc => proc.start());

    serverFuse.run();
}

Sparky.task('luis', () => {
  const luisFuse = FuseBox.init({
    emitHMRDependencies : true,
    homeDir: 'src',
    output: 'public/$name.js',
    plugins: [
      JSONPlugin(),
      CSSPlugin({
        group: 'luis.css',
        outFile: `public/styles/luis.css`,
        inject: false
      }),
      WebIndexPlugin({ template: 'src/client/luis.html', target: 'luis.html' }),
    ],
    shim: {
      crypto: {
        exports: '{ randomBytes: () => crypto.getRandomValues(new global.Uint16Array(1))[0] }'
      },
      stream: {
        exports: '{ Writable: function() {}, Readable: function() {}, Transform: function() {} }'
      }
    }
  });

  luisFuse.dev({
    port: 4445,
    httpServer: false
  });

  luisFuse
    .bundle('luis-vendor')
    // Watching (to add dependencies) it's damn fast anyway
    //.watch()
    // first bundle will get HMR related code injected
    // it will notify as well
    .hmr()
    .target('browser')
    .instructions(' ~ example/luis.ts'); // nothing has changed here

  luisFuse
    .bundle('luis-client')
    .watch() // watch only client related code
    .hmr()
    .target('browser')
    .sourceMaps(true)
    .instructions(' !> [example/luis.ts] + **/**.json + **/**.test.tsx')
    .completed(() => runServer());
    
  luisFuse.run();
});

