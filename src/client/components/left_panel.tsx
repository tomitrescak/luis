import * as React from 'react';

import { observer } from 'mobx-react';

import { LeftMenu } from './left_menu';
import { StoryList } from './story_list';
import { pane } from './component_styles';

export type ComponentProps = {
  state: Luis.State;
};

export const LeftPanel = observer(({ state }) => (
  <div>
    {!state.hideTestMenus && <LeftMenu state={state} />}
    <div style={{ backgroundColor: '#f0f0f1' }} className={pane(state.hideTestMenus)}>
      <StoryList state={state} />
    </div>
  </div>
));
