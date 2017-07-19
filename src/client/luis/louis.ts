import { StoryType } from './state/story';
import { initState } from './state/state';
import { Task } from "./reporter";


export function findStory(testPath: string[]): StoryType {
  if (!testPath) {
    return null;
  }
  // find the story
  const storyPath = [...testPath];
  const state = initState();
  let folder = state.root;
  let story: StoryType = null;

  while (storyPath.length > 1) {
    if (storyPath.length > 2) {
      folder = folder.folders.find(s => s.name === storyPath[0]);
    } else {
      story = folder.stories.find(s => s.name === storyPath[0]);
    }
    storyPath.shift();
  }

  return story;
}

export function findTestPath(item: Task): string[] {
  if (!item.cls || !item.cls.story) {
    return null;
  }
  let story = item.cls;
  return [...story.folder.split('/'), story.story, item.title];
}





