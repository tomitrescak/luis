import * as React from 'react';

import { TopPanelSingle } from './top_panel_bare';
import { StoryView } from './story_view';

//@ts-ignore
import { StateModel } from '../models/state_model';

export type ComponentProps = {
  state?: Luis.State;
};

export const BareView = ({ state }: ComponentProps) => (
  <>
    {/* {!state.hideTestMenus */ false && <TopPanelSingle state={state} />}
    <StoryView state={state} />
  </>
);
