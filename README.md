<table>
<tr>
<td>
<img src="https://user-images.githubusercontent.com/2682705/31411885-c22597e4-ae5e-11e7-8ea0-fa93b62596fd.png" />
</td>
<td>
<h2>LUIS: Component development and testing framework</h2>
</td>

</tr>
</table>

# TL; DR;

If you prefer video to text, check out this 3 minute video showing off all capabilities of Luis:

- React component development
- Seamless snapshot-based testing
- Snapshot management
- Web component catalogue
- Integration with VS Code and Wallaby.js
... and much more!

<iframe width="560" height="315" src="https://www.youtube.com/embed/_EhiLLOhVis" frameborder="0" allowfullscreen></iframe>

# Introduction

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

# Web Application

Web application mode runs directly from the source of of Luis package. To run it, clone the repository into any directory and run following (depending on your choice of package manager):

```
yarn // or npm install
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

The API of Luis is dead simple. It uses classic testing methodology using `describe, it, before, beforeEach, beforeAll, after, afterEach, afterAll` and `xit` for skipping tests.

The specific significance has `describe` function, which represents a `folder` in luis and it is rendered accordingly in the test tree. The new functions are `storyOf` and `itMountsAnd` and matcher `matchSnapshot`.

### storyOf

We have borrowed the naming from the very popular [Storybook](https://storybook.js.org) package. The `storyOf` function is an extension of the `describe` and its purpose is to define a React component and all the tests with snapshots. Followiong is a definition of `storyOf`:

```typescript
interface StoryConfig {
  [index: string]: any;
  component: JSX.Element;
  info?: string;
  cssClassName?: string;
  componentWithData?(...props: any[]): JSX.Element | {
    [index: string]: any;
    component: JSX.Element;
    afterMount?(wrapper: ReactWrapper): void;
  }
}

function storyOf<T extends StoryConfig>(name: string, config: T, implementation: (params: T) => void): void;
```

The only compulsory parameter of the `config` part of the `storyOf` is `component`, which needs to return a `JSX.Element`, for example `<div>Luis</div>`. The `info` stores the description of the story, and `cssClassName` adds a css class to the element which will wrap your rendered React component. `componentWithData` is a very versatile function that allows you to define variations of your component (examples below) and modify the component after it has been mounted. Following is an example of the `storyOf` function:

```jsx
storyOf(
  'My Component', 
  {
    someData: 1,
    get component() {
      return <div>My component</div>
    }
  },
  function({ someData, component }) { 
    it ('mounts component', function() {
      const wrapper = mount(component); // now do some tests
    });

    it ('tests', function() {
      expect(someData).toEqual('1');
    });
  }
)
```

### itMountsAnd

This funstion is an extension of a classic `it` function. The difference to the original `it` is that it uses `enzyme` to mount a provided component and then unmount once the test is finished. This is important in the browser, since all mounted components would stay mounted forever, until page refresh. Following is the definition of the `itMountsAnd` function:

```typescript

import { ReactElement } from 'react';
import { ReactWrapper } from 'enzyme';

type FunctionInitialiser<P> = () => ReactElement<P>;

function itMountsAnd<P>(
  name: string,
  component: FunctionInitialiser<P>,
  test: (wrapper: ReactWrapper<P, any>) => void,
  breakTest?: boolean
): void;

type WrappedComponent<P, W> = W & { component: ReactElement<P> };
type AdvancedFunctionInitialiser<P, W> = () => WrappedComponent<P, W>
type Wrapper<P, S, W> = W & { wrapper: ReactWrapper<P, S> };

function itMountsAnd<P, S, W>(
  name: string,
  component: AdvancedFunctionInitialiser<P, W>,
  test: (data: Wrapper<P, S, W> ) => void
): void;
```

While this may look mighty confusing, it is actually **DEAD SIMPLE**. The it mounts and exists in two versions. The simple version expects a React component as its parameter, and it feeds a *mounted enzyme wrapper* to the test function. Following is an example:

```typescript
const Foo = () => <div>foo</div>;

itMountsAnd('tests description', () => <Foo />, function(wrapper) {
  // do whatever you need to do with wrapper
  wrapper.should.matchSnapshot();
});
```

The second version of the `itMountsAnd` function is more versatile. It allows to pass an object as a parameter. If this is the case, the object needs to contain at least a `component` property. The test function then obtains the object itself and a wrapped React component in the `wrapper parameter`. Here is an example:

```jsx
const Foo = ({ some }) => <div>{some.param}</div>;

itMountsAnd('tests description', () => {
    const cls = new SomeClass();
    return {
      cls,
      component: <Foo some={cls} />, // this is compulsory !!!
    }
  }, function({ wrapper, cls }) {

  // do whatever you need to do with wrapper
  wrapper.should.matchSnapshot();
});
```

This allows you to prepare data for your wrapped component and then pass this data to the component. Please check out the [tests](https://github.com/tomitrescak/luis/tree/2.0/src/example/tests) directory for more examples.

### matchSnapshot

This matcher compares a current version of the object with snapshot that has been saved to disk. It operates differently from the Jest snapshot and its performance has been tuned for use with front and back-end. The main differences are:

- All snapshots saved into the same directory and named by the test name. This directory is by default `/src/tests/snapshots` but this can be configured (more on this later)
- Enzyme wrapper saves `html` representation of the component
- All other objects save circular-free json stringified representation

`matchSnapshot` has a following signature:

```typescript
type MatchOptions = {
  decorator?: (source: string) => string;
};

matchSnapshot(name?: string, options: MatchOptions): Assertion
```

If `name` is specified, snapshot is saved under this name and it is visualised in LUIS accordingly. This is a fundamental difference to `Storybook` approach, where one component has many stories. In our approach, one component is represented by one story, which contains chapters (tests), each having several bookmarks (snapshots). Decorator can add additional HTML code to your snapshot, for example if you need to wrap your component in some extra code. Check out following examples:

```typescript
// snapshot will be named by the test name
wrapper.should.matchSnapshot();

// snapshot will have its own name
wrapper.should.matchSnapshot('button click increases number');

// we will wrap snapshot with margin and add background color
// this is particularly useful, when used with VS Code extension
const decorator = (html: string) => `<div style={margin: 20px, color: black}>${html}</div>`;
wrapper.should.matchSnapshot('button click increases number', { decorator });
```

#### Snapshot Configuration 

The snapshots can be easily configured modifying the default config of `chai-match-snapshot` package. Following is the signature of the config:

```typescript
export type Config = {
  /** directory where snapshots are stored */
  snapshotDir: string;
  /** custom serialiser */
  serializer: (obj: any) => string;
  /** custom replacer for JSON.stringify */
  replacer: (key: string, value: any) => any;
};

// example
import { config } from 'chai-match-snapshot';
config.snapshotDir = '/my/custom/dir';
``` 

## Adding Test Files

If you add a new test file, you need to import to `src/example/luis`. This is the start file of Luis project. This can be changed in `fuse.js` file.

```js
import { renderLuis } from '../client/components/index';

import './tests/foo.test';
import './tests/bar.test';
import './tests/boo.test';

renderLuis();
```

# Package Mode

# Visual Studio Extension

# CI

## Troubleshooting

If at any point things start to go sideways, try deleting the .fusebox folder in the root of your project and restart Luis.

<hr />
<div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>