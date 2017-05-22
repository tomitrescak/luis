import { StoryType } from './state/story';
import { initState } from './state/state';


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

export function findTestPath(item: any): string[] {
  if (!item.cls || !item.cls.folder || !item.cls.story) {
    return null;
  }
  return [...item.cls.folder.split('/'), item.cls.story, item.title];
}





