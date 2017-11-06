import * as React from 'react';

import { content } from './component_styles';
import { TopPanelSingle } from './top_panel';
import { StoryView } from './story_view';

//@ts-ignore
import { StateModel } from '../config/state';

type ComponentProps = {
  state?: Luis.State;
};

export const BareView = ({ state }: ComponentProps) => (
  <div className={content}>
    <TopPanelSingle state={state} />
    <StoryView state={state} />
  </div>
);
