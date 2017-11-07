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
    <LeftMenu state={state} />
    <div className={pane}>
      <StoryList state={state} />
    </div>
  </div>
));
