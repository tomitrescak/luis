import * as React from 'react';

import { TopPanel } from './top_panel';
import { full } from './component_styles';
import { StoryView } from './story_view';

export type ComponentProps = {
  state: Luis.State;
};

export const RightPanel = ({ state }: ComponentProps) => (
  <div className={full}>
    <TopPanel state={state} />
    <StoryView state={state} />
  </div>
);
