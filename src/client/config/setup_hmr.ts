// import { getState } from '../models/state_model';

// type NameTest = (moduleName: string) => boolean;
// let isModuleStateful: NameTest = path => /router/.test(path) || /state/.test(path);

// export function setupHmr() {
//   const customizedHMRPlugin = {
//     hmrUpdate: ({ type, path, content, _dependants }: any) => {
//       // Dependants only available when emitHMRDependencies = true
//       if (type === 'js') {
//         FuseBox.flush(function(fileName: string) {
//           return !isModuleStateful(fileName);
//         });

//         FuseBox.dynamic(path, content);

//         if (FuseBox.mainFile) {
//           FuseBox.import(FuseBox.mainFile);
//         }

//         // make sure ui reloads
//         getState().liveRoot.version++;
//         return true;
//       }
//     }
//   };
//   let w: any = window;
//   if (!w.hmrRegistered) {
//     w.hmrRegistered = true;
//     FuseBox.addPlugin(customizedHMRPlugin);
//   }
// }
