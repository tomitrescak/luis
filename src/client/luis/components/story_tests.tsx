import * as React from 'react';
import { observer } from 'mobx-react';
import { Story } from '../state/story';
import { RouteState } from '../state/state';
import { bottomTabPane, hidePassing, renderFields } from './story_common';

// Story tests

export interface StoriesTitleParams {
  groupPath: string[];
  state: RouteState;
  story: Story;
}

export const StoryTestsTitle = observer(({ groupPath, story, state }: StoriesTitleParams) => {
  if (!story) {
    return <span></span>;
  }
  if (story.testing) {
    return <span>Running tests ...</span>;
  }
  const testsRoot = state.findTestRoot(groupPath);
  return (
    <span>Story Tests [<span className="pass">{state.catalogue.count(testsRoot, false)}</span> / <span className="fail">{state.catalogue.count(testsRoot, true)}</span>]</span>
  );
});

export interface StoriesParams {
  story: Story;
  groupPath: string[];
  state: RouteState;
}

export const StoryTests = observer(({ groupPath, story, state }: StoriesParams) => {
  if (story.testing) {
    return <span>Running tests ...</span>;
  }
  const testsRoot = state.findTestRoot(groupPath);
  return (
    <div className={bottomTabPane}>
      <div className={hidePassing}>
        <input type="checkbox" defaultChecked={state.catalogue.hidePassing} onChange={(e) => { state.catalogue.hidePassing = e.currentTarget.checked; }} /> Hide Passing
    </div>
      {story && story.testing && <span>Running tests ...</span>}
      {renderFields(state, testsRoot)}
    </div>
  );
});
