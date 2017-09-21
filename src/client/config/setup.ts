import { initState } from './state';

type NameTest = (moduleName: string) => boolean;
/** Current names of stateful modules */
let isModuleStateful: NameTest = () => false;

/** We may request to throttle updates to avoid unnecessary reloads */
let throttle = 0;
let throttleQueue: CallbackParams[] = [];
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
  if (throttleTimer) {
    clearTimeout(throttleTimer);
  }
  throttleQueue.push(options);
  throttleTimer = setTimeout(throttledUpdate, throttle);

  return true;
}

function throttledUpdate() {
  let state = initState();

  /** Flush modules modules */
  FuseBox.flush(function(fileName: string) {
    return !isModuleStateful(fileName);
  });

  while (throttleQueue.length > 0) {
    let { type, path, content, dependants } = throttleQueue.shift();
    if (type === 'js' || type === 'css') {
      /** If a stateful module has changed reload the window */
      if (isModuleStateful(path)) {
        window.location.reload();
      }

      /** Register this module in test queu so we run only affected tests */
      state.testQueue.hmr(path, content, dependants);

      /** Patch the module at give path */
      FuseBox.dynamic(path, content);
    }
  }

  /** Re-import / run the mainFile */
  importMainFile();
}

function simpleUpdate({ type, path, content, dependants }: CallbackParams) {
  if (type === 'js' || type === 'css') {
    /** If a stateful module has changed reload the window */
    if (isModuleStateful(path)) {
      window.location.reload();
    }

    /** Otherwise flush the other modules */
    FuseBox.flush(function(fileName: string) {
      return !isModuleStateful(fileName);
    });

    /** Patch the module at give path */
    FuseBox.dynamic(path, content);

    /** Re-import / run the mainFile */
    importMainFile();

    /** We don't want the default behavior */
    return true;
  }
}

function importMainFile() {
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
      return simpleUpdate(options);
    }
    return queueThrottledUpdate(options);
  }
};

type PluginOptions = {
  throttleTime?: number;
  testStateFulModule?: NameTest;
}

/**
* Registers given module names as being stateful
* @param isStateful for a given moduleName returns true if the module is stateful
*/
export const addPlugin = ({throttleTime = 0, testStateFulModule}: PluginOptions = {}) => {
  if (!global.alreadyRegistered) {
    global.alreadyRegistered = true;
    throttle = throttleTime;
    FuseBox.addPlugin(customizedHMRPlugin);
  }
  isModuleStateful = testStateFulModule;
};


// Test it
export function setupHmr() {
  addPlugin({
    throttleTime: 10,
    testStateFulModule: (name: string) => {
      // Add the things you think are stateful:
      const result = /router/.test(name) || /state/.test(name);
      // console.log(`${result} ${name}`);
      return result;
    }
  })
} 
