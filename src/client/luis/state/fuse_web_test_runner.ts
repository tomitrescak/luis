import { StoryDefinition, ModuleDefinition } from './state';
import { Reporter, Task } from '../reporter';
import { TestConfig } from 'fuse-test-runner';

const $isPromise = (item: Promise<{}>) => {
  return item
    && typeof item.then === 'function' &&
    typeof item.catch === 'function';
};

export type TestRunnerOptions = {
  reporter: Reporter
};

const systemProps = ['before', 'beforeAll', 'afterAll', 'beforeEach', 'after', 'afterEach'];

export class TestType {
  name = '';
  result = '';

  constructor(name: string) {
    this.name = name;
  }

  setResult(result: string) {
    this.result = result;
  }
}

export class FuseBoxWebTestRunner {
  public reporter: Reporter;

  private startTime: number;

  constructor(options: TestRunnerOptions) {
    this.reporter = options.reporter;
    this.startTime = new Date().getTime();
  }

  public startTests(tests: ModuleDefinition[]) {
    this.reporter.initialize(tests);

    var start = new Date().getTime();

    let promises: Promise<{}>[] = [];
    for (let module of tests) {
      promises = promises.concat(this.startFile(module));
    }

    // report result
    if (promises.length) {
      Promise.all(promises).then(() => {
        this.reporter.endTest({}, new Date().getTime() - start);
      });
    } else {
      this.reporter.endTest({}, new Date().getTime() - start);
    }
  }

  public startFile(module: ModuleDefinition) {
    let promises: Promise<{}>[] = [];

    this.reporter.startFile();

    // tslint:disable-next-line:forin
    for (let story in module) {
      promises = promises.concat(this.startStory(module[story]));
    }

    return promises;
  }

  public startStory(story: StoryDefinition) {
    let startTime = new Date().getTime();
    let promises: Promise<{}>[] = [];
    let className = story.name || story.constructor.name;
    let item: Task = { className, cls: story, title: null, method: null, fn: null, fileName: null };
    this.reporter.startClass(className, item);

    const instructions = this.extractInstructions(story);

    console.group(className);
    for (let test of instructions.methods) {
      if (instructions.system.beforeEach) {
        instructions.system.beforeEach();
      }

      const task: Task = {
        className: item.className,
        fileName: item.className,
        cls: story,
        fn: story.prototype[test],
        method: test,
        title: test
      };

      promises = promises.concat(this.startTest(task));
      if (instructions.system.afterEach) {
        instructions.system.afterEach();
      }
    }

    if (promises.length) {
      Promise.all(promises).then(() => {
        this.reporter.endClass(className, item);
        // tslint:disable-next-line:no-console
        console.log(`Ending in  ${new Date().getTime() - startTime}ms`);
        console.groupEnd();
      });
    } else {
      this.reporter.endClass(className, item);
      // tslint:disable-next-line:no-console
      console.log(`Ending in  ${new Date().getTime() - startTime}ms`);
      console.groupEnd();
    }

    return promises;
  }

  public startTest(item: Task) {
    const startTime = new Date().getTime();

    TestConfig.currentTask = item;
    TestConfig.currentTask.fileName = item.className;
    TestConfig.currentTask.className = item.className;

    try {
      let data = item.fn();
      if ($isPromise(data)) {
        data
          .then(() => {
            let report = { item, data: { success: true } };
            this.reporter.testCase(report);
            // tslint:disable-next-line:no-console
            console.log(`%c SUCCESS! '${report.item.title}' after ${new Date().getTime() - startTime}ms`, 'color: green');
          })
          .catch((err: {}) => {
            throw err;
          });
        return [data];

      } else {
        let report = { item, data: { success: true } };
        this.reporter.testCase(report);
        // tslint:disable-next-line:no-console
        console.log(`%c SUCCESS! '${report.item.title}' after ${new Date().getTime() - startTime}ms`, 'color: green');
      }
    } catch (e) {
      
      let error;
      if (e.constructor.name === 'Exception') {
        error = e;
        error.filename = item.fileName;
        error.className = item.className;
        error.methodName = item.method;
        error.title = item.title;
      }
      let report = {
        item: item,
        data: {
          error: error || e,
          success: false
        }
      };
      this.reporter.testCase(report);

      let parts = report.data.error.stack.split('    at ');

      // tslint:disable-next-line:no-console
      console.log(
        `%c ERROR! '${report.item.title}':` + 
        `%c '${report.data.error.message}' after ${new Date().getTime() - startTime}ms \n    at ${parts[1]}    at ${parts[2]}`, 
        'color: red; font-weight: bold', 
        'color: red');

    }
    return [];
  }

  private extractInstructions(obj: StoryDefinition) {
    let props = Object.getOwnPropertyNames(obj.prototype).filter(n => n !== 'constructor');
    let instructions = {
      methods: [] as string[],
      system: {} as { [index: string]: Function }
    };

    for (var i = 0; i < props.length; i++) {
      let propertyName = props[i];

      if (systemProps.indexOf(propertyName) === -1) {
        instructions.methods.push(propertyName);
      } else {
        if (typeof obj[propertyName] === 'function') {
          instructions.system[propertyName] = obj[propertyName];
        }
      }
    }
    return instructions;
  }
}
