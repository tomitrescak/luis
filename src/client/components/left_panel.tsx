import * as React from 'react';

import { observer } from 'mobx-react';

import { SideBar } from './side_bar';
import { StoryList } from './story_list';
import { pane } from './component_styles';

export type ComponentProps = {
  state: Luis.State;
};

export const LeftPanel = observer(({ state }) => (
  <div>
    <SideBar state={state} />
    <div className={pane}>
      <StoryList state={state} />
    </div>
  </div>
));
