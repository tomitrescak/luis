export let no: string;

declare global {
  interface StoryConfig {
    [index: string]: any;
    component?: React.ComponentType;
  }
  function addStory(story: StoryConfig): void;
}
