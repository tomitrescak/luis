import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { StoryType } from '../state/story';
import { bottomTabPane, hidePassing, renderStory } from './story_common';
import { StateType } from '../state/state';

// Story tests

export interface StoriesTitleParams {
  story: StoryType;
  state?: StateType;
}

export const StoryTestsTitle = inject('state')(observer(({ story, state }: StoriesTitleParams) => {
  if (!story) {
    return <span>Story Tests</span>;
  }
  if (state.runningTests) {
    return <span>Story Tests</span>;
  }
  return (
    <span>Story Tests [<span className="pass">{story.passingTests}</span> / <span className="fail">{story.failingTests}</span>]</span>
  );
})
);

export interface StoriesParams {
  story: StoryType;
  state?: StateType;
}

export const StoryTests = inject('state')(observer(({ story, state }: StoriesParams) => {
  if (!story) {
    return <span>No story selected</span>;
  }
  if (state.runningTests) {
    return <span>Running tests ...</span>;
  }
  return (
    <div className={bottomTabPane}>
      <div className={hidePassing}>
        <input type="checkbox" defaultChecked={state.hidePassing} onChange={(e) => { state.hidePassing = e.currentTarget.checked; }} /> Hide Passing
    </div>
      {renderStory(state, story)}
    </div>
  );
}));
