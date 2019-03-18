import * as React from 'react';

import { TopPanelSingle } from './top_panel_bare';

//@ts-ignore
import { StateModel } from '../models/state_model';
import { ErrorBoundary } from './error_boundary';
import { ThemedWrapper } from './themed_wrapper';
import { StoryComponent } from './story_component';

export type ComponentProps = {
  state?: Luis.State;
};

export const BareView = ({ state }: ComponentProps) => (
  <>
    {/* {!state.hideTestMenus */ false && <TopPanelSingle state={state} />}
    <ErrorBoundary>
      <ThemedWrapper state={state}>
        <StoryComponent state={state} />
      </ThemedWrapper>
    </ErrorBoundary>
  </>
);
