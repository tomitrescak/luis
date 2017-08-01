import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { bottomTabPane } from './story_common';
import { StoryType } from '../state/story';
import { StateType } from '../state/state';

export interface ActionProps {
  title: any;
  story: StoryType;
  state?: StateType;
}
export const Actions = inject('state')(observer(({ story, state }: ActionProps) => {
  return (
    <div className={bottomTabPane}>
      {state.actions.map((a, i) => (
        <pre key={i}>{a}</pre>
      ))}
    </div>
  );
}));
