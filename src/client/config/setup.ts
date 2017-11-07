import { initState } from '../models/state_model';

type NameTest = (moduleName: string) => boolean;
/** Current names of stateful modules */
let isModuleStateful: NameTest = () => false;

/** We may request to throttle updates to avoid unnecessary reloads */
let throttle = 0;
let updateQueue: CallbackParams[] = [];
let throttleTimer: any = null;

type Dependant = {
  [index: string]: string[] | Dependant[];
};

type CallbackParams = {
  type: string;
  path: string;
  content: string;
  dependants: Dependant;
};

function queueThrottledUpdate(options: CallbackParams) {
  // ignore json files
  // if (options.path.substring(options.path.length - 5) === '.json') {
  //   return true;
  // }

  if (throttleTimer) {
    clearTimeout(throttleTimer);
  }
  updateQueue.push(options);
  throttleTimer = setTimeout(update, throttle);

  return true;
}

function update() {
  let state = initState();

  /** Flush modules modules */
  FuseBox.flush(function(fileName: string) {
    return !isModuleStateful(fileName);
  });

  while (updateQueue.length > 0) {
    let { type, path, content, dependants } = updateQueue.shift();
    if (type === 'js' || type === 'css') {
      /** If a stateful module has changed reload the window */
      if (isModuleStateful(path)) {
        window.location.reload();
      }

      state.testQueue.hmr(path, content, dependants);

      /** Patch the module at give path */
      FuseBox.dynamic(path, content);
    }
  }

  /** Re-import / run the mainFile */
  if (FuseBox.mainFile) {
    try {
      FuseBox.import(FuseBox.mainFile);
    } catch (e) {
      // in case if a package was not found
      // It probably means that it's just not in the scope
      if (typeof e === 'string') {
        // a better way but string?!
        if (/not found/.test(e)) {
          window.location.reload();
        }
      }
      console.error(e);
    }
  }
}

const customizedHMRPlugin = {
  hmrUpdate(options: CallbackParams) {
    if (throttle === 0) {
      updateQueue.push(options);
      update();
    }
    return queueThrottledUpdate(options);
  }
};

type PluginOptions = {
  throttleTime?: number;
  testStateFulModule?: NameTest;
};

/**
* Registers given module names as being stateful
* @param isStateful for a given moduleName returns true if the module is stateful
*/
export const addPlugin = ({ throttleTime = 0, testStateFulModule }: PluginOptions = {}) => {
  if (!global.alreadyRegistered) {
    global.alreadyRegistered = true;
    throttle = throttleTime;
    FuseBox.addPlugin(customizedHMRPlugin);
  }
  isModuleStateful = testStateFulModule;
};

// Test it
export function setupHmr() {
  if (global.FuseBox) {
    addPlugin({
      throttleTime: 10,
      testStateFulModule: (name: string) => {
        // Add the things you think are stateful:
        const result = /router/.test(name) || /state/.test(name);
        // console.log(`${result} ${name}`);
        return result;
      }
    });
  }
}
