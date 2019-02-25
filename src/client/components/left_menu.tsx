import * as React from 'react';
import { observer } from 'mobx-react';
import { Menu, Icon } from 'semantic-ui-react';

import { css } from './component_styles';

const noMargin = css`
  margin-bottom: 0px !important;
`;

export type ComponentProps = {
  state: Luis.State;
};

export const LeftMenu = observer(({ state }: ComponentProps) => (
  <Menu secondary inverted color="blue" className={noMargin}>
    <Menu.Item name="home" icon="lightbulb outline" content="Luis" />
    <Menu.Item
      title="Toggle passing tests"
      active={state.showPassing}
      onClick={() => (state.showPassing = !state.showPassing)}
    >
      <Icon name="check" color="green" />
      <div className="lbl">{state.liveRoot.passingTests}</div>
    </Menu.Item>
    <Menu.Item
      title="Toggle failing tests"
      active={state.showFailing}
      onClick={() => (state.showFailing = !state.showFailing)}
    >
      <Icon name="remove" color="red" />
      <div className="lbl">{state.liveRoot.failingTests}</div>
    </Menu.Item>
    <Menu.Item id="listView" onClick={() => state.config.toggleStoryView()}>
      <Icon name={state.config.storyView === 'list' ? 'content' : 'indent'} />
    </Menu.Item>
    <Menu.Item id="configView" onClick={() => (state.viewState.sView = 'config')}>
      <Icon name="cogs" />
    </Menu.Item>
  </Menu>
));
