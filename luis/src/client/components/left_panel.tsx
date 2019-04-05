import * as React from 'react';

import { observer } from 'mobx-react';

import { LeftMenu } from './left_menu';
import { StoryList } from './story_list';

export type ComponentProps = {
  state: Luis.State;
};

export const LeftPanel = observer(({ state }) => (
  <>
    <LeftMenu state={state} />
    <StoryList state={state} />
  </>
));
