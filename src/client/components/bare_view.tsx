import * as React from 'react';

import { content } from './component_styles';
import { TopPanelSingle } from './top_panel_bare';
import { StoryView } from './story_view';

//@ts-ignore
import { StateModel } from '../models/state_model';


export type ComponentProps = {
  state?: Luis.State;
};

export const BareView = ({ state }: ComponentProps) => (
  <div className={content}>
    <TopPanelSingle state={state} />
    <StoryView state={state} />
  </div>
);
