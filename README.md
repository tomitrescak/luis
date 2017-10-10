# LUIS: Component development and testing framework

## Introduction

LUIS (**L**ist of **U**ser **I**nterface**s**) is framework for collaborative building and testing React web components. It harnesses the power of [FuseBox](https://github.com/fuse-box/fuse-box) for **fastest** bundling, hot reloads, and out-of-the-box Typescript support. Following are stats for application with 976 typescript sources and 56 imported packages:

* **StoryBook** — Start `36 seconds`, Hot Module Reload with sourcemaps `9 seconds`.
* **LUIS** — Start `400 ms`, Hot Module Reload with sourcemaps `750 ms`. Now that's what I call a significant difference.

Luis is using well known technologies ([Mocha](https://mochajs.org), [React](https://reactjs.org), optionally [Wallaby](https://wallabyjs.com)) and methodologies (TDD, BDD, Snapshot testing), so there is almost nothing new to learn (apart from two new functions, **storyOf** and **itMountsAnd**). Luis, takes away the complex configuration, using [wafl](https://github.com/tomitrescak/wafl) package to set-up your testing environment. 

To facilitate your component development, testing, and collaboration LUIS supports four different modes. Each mode is described in detail further below.

1. **Web Application** - Luis comes pre-configured to run on its own so you can start working instantly
2. **Package** - With a little bit of configuration you can bring Luis to your application and run side by side with your project
3. **Visual Studio Code plugin** - Luis incorporates seamlessly into your (my) favourite editor, where it visualises your current snapshots and automatically reloads them as you type (with help of Wallaby.js or Mocha.js in watch mode)
4. **CI** - Luis defines CI configurations so bringing your project to CI is a breeze.

Pictures are worth thousand words, so let us introduce each mode and our API with many examples.

## Web Application

Web application mode runs directly from the source of of Luis package. To run it, clone the repository into any directory and run following (depending on your choice of package manager):

```
yarn install // or npm install
yarn run luis // or npm run luis
```

Luis now runs on `http://localhost:9001`. Open this url in your browser and you should see a screen, similar to following:

![luis-ui](https://user-images.githubusercontent.com/2682705/31363176-58b63068-ada8-11e7-8e1c-1c8349814de3.png)

The main buttons of Luis interface perform following actions:

1. Tree mode / flat mode changes the way the list of tests are displayed
2. Configuration allows you to enable / disable specific tests and more
3. Update button updates current snapshot to the new version and saves it on your drive
4. Auto-update toggle allows to update snapshot automatically when tests are run. This is very useful during component development and writing of tests.

Luis has four view modes:

1. *React*: Displays a "live" React components, used mostly during component development
2. *Html*: Displays a HTML version of the snapshot and shows side-by-side comparison if snapshots differ.
3. *Json*: Displays *raw* source of the snapshot and compares the differences
4. *Snapshots*: Show all saved snapshots for a current test 

*Tree view* shows all tests and snapshots. It also shows all test results, and if possible, it shows side-by-side comparison of actual vs. expected value. The number next to the test item represent the execution time of the test. When number is:

* Green - all tests pass
* Orange - some tests pass
* Red - all tests fail

The exact functionality of each button is shown below:

![luis_introduction](https://user-images.githubusercontent.com/2682705/31411377-29cb8298-ae5d-11e7-9817-6b1368af5954.gif)

## API



```javascript
describe('User', () => {
  describe('Profile', () => {

    decorator((story) => (
      <ContextProvider>
        { story() }
      </ContextProvider>
    ));

    story('Default', () => {
      const user = new ClientUser();

      const view = <ProfileView user={user} />;
      const context = {
        state: { accounts: { userId: '1' }},
      };

      tests(() => {
        const wrapper = mount(view, { context } );
        it('Renders correctly', function () {
          expect(wrapper).toMatchSnapshot();
        });

        it('Changes Avatar', () => {
          // Other test
        });
      });

      return view;
    });
  });
});
```

Look how "handsome" is LUIS (PR welcome :). This Figure shows the Profile story. Please note, how describe statements created folders User and Profile.

<img width="843" alt="screen shot 2017-02-23 at 10 34 53 pm" src="https://cloud.githubusercontent.com/assets/2682705/23295412/9c6d1192-fac4-11e6-9508-7ad89354c46c.png">

## API

Luis’s API is simple:

- `describe (name: string, impl: Function)`: creates a new folder for stories.
- `story (name: string, description | function, impl: Function)`: creates a new story, story needs to return a React component.
- `decorator(story: Function)`: adds a new decorator that wraps all stories in the folder and all its subfolders where decorator is defined.
- `tests(impl: Function)`: wraps all your tests and assures that all contained tests are only executed during - testing phase and not during the story display (simply, prohibits running the tests when story is displayed). You do not need to use test function.
- `action(name: string)`: creates a new action handler that displays action properties in the LUIS UI
- `it (name: string, impl: Function)`: a new test case
- `xit (name: string, impl: Function)`, xdescribe: an ignored test case

Of course you can use original storybook methods: `storiesOf, add, addWithInfo`

## Importing LUIS into existing app

LUIS exists in the form of a [package as well](https://www.npmjs.com/package/luis), exposing all the necessary UIs and handlers and can be imported into your existing application, yet in the current FuseBox implementation, the hot module reload does not work properly with React Components served from the external package.
Please give LUIS a go, fasten your seat belts and enjoy the ride! I will welcome any feedback.

## Vital Information

To run LUIS with snapshot support, you need to run both client and server. If you do not wish to use snapshots, you can run client only. 

The startup file for the application is 'src/index.tsx', while for LUIS it is 'src/stories.tsx'. 
