import { TestGroup, Test, Snapshot, StateModel } from '../../client/index';

export type Impl = () => void;

export type Map<T> = { [name: string]: T };

export type Snapshots = Map<Map<string>>;

function clean(message: string) {
  message = message.replace(/\u001b/g, '');
  message = message.replace(/\[\d+m/g, '');
  return message;
}

function addTests(
  state: StateModel,
  group: TestGroup,
  testData: jest.AggregatedResult,
  snapshots: Snapshots
) {
  // add info
  group.passingTests = 0;
  group.failingTests = 0;

  // browse all test results and find test belonging to this group
  const path = group.simplePath;

  for (let suite of testData.testResults) {
    const suiteSnapshots = snapshots[suite.testFilePath] || {};
    const keys = Object.getOwnPropertyNames(suiteSnapshots);

    for (let test of suite.testResults) {
      const testPath = test.ancestorTitles.join(' ');
      if (testPath == path) {
        const t = new Test(test.title, group, null);
        t.duration = test.duration || 1;
        t.endTime = test.duration || 1;

        if (test.status === 'pending') {
          let previous = state.liveRoot.findTest(t.name, t.parent.name);

          if (previous) {
            if (previous.error) {
              group.failingTests++;
            } else {
              group.passingTests++;
            }
            group.tests.push(previous);
            continue;
          }
        }

        if (test.status == 'passed') {
          group.passingTests++;
        } else if (test.status == 'failed') {
          group.failingTests++;
        }

        // add failures
        if (test.failureMessages.length) {
          // disect equality
          let message = clean(test.failureMessages[0]);


          let expected = null;
          let actual = null;

          // equality matcher
          let match = message.match(/Expected value to equal:\s+(.*)\s+Received:\s+(.*)/);
          if (match) {
            expected = match[2];
            actual = match[1];
          }

          // snapshot matcher
          if (message.indexOf('expect(value).toMatchSnapshot()') > 0) {
            let lines = message.split('\n');
            expected = '';
            actual = '';

            let started = false;
            for (let line of lines) {
              if (!started && line.indexOf('+ Received') >= 0) {
                started = true;
                continue;
              }

              if (started && line.match('^    at')) {
                // expected = expected.trim();
                // actual = actual.trim();
                break;
              }

              if (started) {
                let d = line[0];
                let rest = line.substring(1);

                if (d !== '+') {
                  expected += rest + '\n';
                }
                if (d !== '-') {
                  actual += rest + '\n';
                }
              }
            }
            if (expected === '') {
              expected = null;
              actual = null;
            }
          }

          let error = new Error(test.failureMessages[0]) as any;
          error.expected = expected;
          error.actual = actual;
          t.error = error;
        }

        // add snapshots
        const matchingSnapshots = keys.filter(k => k.indexOf(test.fullName) >= 0);

        if (matchingSnapshots.length) {
          let index = 1;
          t.snapshots.replace(
            matchingSnapshots.map(
              m =>
                new Snapshot({
                  current: suiteSnapshots[m],
                  name: 'Snapshot ' + index++,
                  originalName: m,
                  matching: true,
                  test: t,
                  expected: t.error ? t.error.actual : suiteSnapshots[m]
                })
            )
          );
        }

        group.tests.push(t);
      }
    }
  }
}

export function createBridge(
  state: StateModel,
  testData: jest.AggregatedResult,
  snapshots: Snapshots
) {
  const glob: any = global;

  state.updateRoot.groups = [];
  state.liveRoot.passingTests = testData.numPassedTests;
  state.liveRoot.failingTests = testData.numFailedTests;

  glob.describe = function(name: string, impl: Impl) {
    const group = state.currentGroup.getGroup(name, state);
    const parent = group.parent;
    state.currentGroup = group;

    try {
      impl();
    } finally {
      state.currentGroup = parent;
    }

    addTests(state, group, testData, snapshots);

    // start reconciliation
    state.reconciliate(false);
  };

  glob.storyOf = function(name: string, props: StoryConfig, impl: (props: any) => void) {
    // config can also be a single function
    if (props instanceof Function) {
      const component = (props as any)();
      props = {
        get component() {
          return component;
        }
      };
    }

    const group = state.currentGroup.getStory(name, props, state);
    const parent = group.parent;
    state.currentGroup = group;

    try {
      if (impl) {
        impl(props);
      }
    } finally {
      state.currentGroup = parent;
    }

    addTests(state, group, testData, snapshots);

    // start reconciliation
    state.reconciliate(false);
  };

  glob.xit = function() {};

  glob.xdescribe = function() {};

  glob.it = function(name: string, impl: Impl) {};

  glob.before = function(impl: Impl) {};

  glob.beforeAll = function(impl: Impl) {};

  glob.beforeEach = function(impl: Impl) {};

  glob.after = function(impl: Impl) {};

  glob.afterAll = function(impl: Impl) {};

  glob.afterEach = function(impl: Impl) {};
}

declare global {
  function storyOf<T extends StoryConfig>(
    name: string,
    config: T,
    implementation?: (params: T) => void
  ): void;
}
