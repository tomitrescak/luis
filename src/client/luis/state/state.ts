// we need to register the proxy functions

import { types, IType, getParent } from 'mobx-state-tree';
import { IMSTNode } from "mobx-state-tree/lib/core";
import { IModelType } from "mobx-state-tree/lib/types/complex-types/object";
import { ISnapshottable } from "mobx-state-tree/lib/types/type";
import { IObservableArray } from 'mobx';
import { Reporter } from '../reporter';

import { ViewState } from "./view_state";
import { Story, StoryClass, StoryType } from './story';
import { IExtendedObservableMap } from "mobx-state-tree/lib/types/complex-types/map";

export type StoryDefinition = {
  name: string;
  story: string;
  info: string;
  folder: string;
  createComponent: Function;
  component: JSX.Element;
}

export type ModuleDefinition = {
  [index: string]: StoryDefinition;
}

export type FolderType = {
  name: string,
  parent: FolderType;
  folders: IObservableArray<FolderType>,
  stories: IObservableArray<StoryType>
};
export type FolderModel = IModelType<FolderType, FolderType>

export const Folder: FolderModel = types.model({
  name: types.string,
  folders: types.array(types.late<any, FolderType>(() => Folder)),
  stories: types.array(Story),
  get parent(): FolderType {
    return getParent(this)
  }
});

export const State = types.model({
  hidePassing: false,
  view: types.optional(ViewState, { selectedStoryId: [], currentUrl: '/', selectedStoryName: [] }),
  root: types.optional(Folder, { name: 'Root', folders: [], stories: [] }),
  storyMap: types.map(Story),
  get passingTests(): number {
    return this.storyMap.values().reduce((prev, next) => prev + next.passingTests, 0);
  },
  get failingTests(): number {
    return this.storyMap.values().reduce((prev, next) => prev + next.failingTests, 0);
  }
}, {
    findStoryByClassName(className: string) {
      return this.storyMap.get(className);
    },
    addModules(modules: ModuleDefinition[]) {
      for (let mod of modules) {
        for (let className in mod) {
          let storyDefinition = mod[className];

          let storyName = storyDefinition.name;
          if (!storyName) { continue; }

          // add story
          if (storyDefinition.folder) {
            const split = storyDefinition.folder.split('/');
            const component = storyDefinition.createComponent ? storyDefinition.createComponent() : storyDefinition.component;
            const folder = storyDefinition.folder;

            // find given folder
            const folderParts = folder.split('/');
            let parentFolder = this.root;
            while (folderParts.length > 0) {
              let folderName = folderParts.shift();
              let findFolder = parentFolder.folders.find(f => f.name === folderName);
              if (!findFolder) {
                findFolder = Folder.create({ name: folderName, folders: [], stories: [] });
                parentFolder.folders.push(findFolder);
              }
              parentFolder = findFolder;
            }

            // create a new story
            let story = Story.create({ name: storyName, tests: [], actions: [], className: className, definition: storyDefinition });
            story.setComponent(storyDefinition.info, component);

            // add to set
            this.storyMap.set(className, story);

            // start tests asynchronously
            setTimeout(() => story.startTests(), 1);
          }
        }
      }
    }
  });

export type StateType = typeof State.Type;

let state: StateType;

export function initState() {
  if (state == null) {
    state = State.create({});
  }
  return state;
}

