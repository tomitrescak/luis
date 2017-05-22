import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { StoryType } from '../state/story';
import { bottomTabPane, hidePassing, renderFields } from './story_common';
import { StateType } from "../state/state";

// Story tests

export interface StoriesTitleParams {
  story: StoryType;
}

export const StoryTestsTitle = observer(({ story }: StoriesTitleParams) => {
  if (!story) {
    return <span></span>;
  }
  if (story.runningTests) {
    return <span>Running tests ...</span>;
  }
  return (
    <span>Story Tests [<span className="pass">{story.passingTests}</span> / <span className="fail">{story.failingTests}</span>]</span>
  );
});

export interface StoriesParams {
  story: StoryType;
  state?: StateType;
}

export const StoryTests = inject('story')(observer(({ story, state }: StoriesParams) => {
  if (story.runningTests) {
    return <span>Running tests ...</span>;
  }
  return (
    <div className={bottomTabPane}>
      <div className={hidePassing}>
        <input type="checkbox" defaultChecked={state.hidePassing} onChange={(e) => { state.hidePassing = e.currentTarget.checked; }} /> Hide Passing
    </div>
      {story && story.runningTests && <span>Running tests ...</span>}
      {renderFields(state, story.tests as any)}
    </div>
  );
}));
