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


Sparky.task('luis', () => {
  const luisFuse = FuseBox.init({
    homeDir: 'src',
    output: 'public/$name.js',
    plugins: [
//      JsxControlsPugin,
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
    .instructions(' !> [example/luis.ts] + **/**.json');

  luisFuse.run();

  // server

  // luisFuse
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
});



/////////////////////////////////////////////
// TEST

// Sparky.task('test', () => {
//   const testFuse = FuseBox.init({
//     homeDir: 'src',
//     output: 'dist/$name.js',
//     plugins: [
//       JsxControlsPugin,
//       StubPlugin,
//       // JSONPlugin(),
//       EnvPlugin({ NODE_ENV: 'test' })
//     ],
//     globals: {
//       proxyrequire: '*'
//     },
//     shim: {
//       crypto: {
//         exports: '{ randomBytes: () => Math.random(8) }'
//       }
//     }
//   });

//   // setup();
//   require('./setup').setupGlobals();

//   // Object.defineProperty(global, 'window', {
//   //   get: function () {
//   //     console.trace();
//   //     // return { head: { appendChild() {} }, addEventListener() {}, createElement() {} };
//   //     return {};
//   //   },
//   //   enumerable: true,
//   //   configurable: true
//   // });

//   testFuse
//     .bundle('app')
//     //.plugin(StubPlugin)
//     //.globals({ proxyrequire: '*' })
//     .test('[**/**.test.tsx]', {
//       beforeAll(config) {
//         console.log('BEFORE ALL ...')
//         require('wafl').setup({config});
//       }
//     });
// });


// "plugins": [
    //   {
    //     "name": "ts-graphql-plugin",
    //     "schema": "scripts/schema.json",
    //     "tag": "gql"
    //   }
    // ]