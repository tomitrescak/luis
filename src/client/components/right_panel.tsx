import * as React from 'react';

import { TopPanel } from './top_panel';
import { StoryView } from './story_view';

export type ComponentProps = {
  state: Luis.State;
};

export const RightPanel = ({ state }: ComponentProps) => (
  <>
    <TopPanel state={state} />
    <StoryView state={state} />
  </>
);
