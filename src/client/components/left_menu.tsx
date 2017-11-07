import * as React from 'react';
import { observer } from 'mobx-react';
import { Menu, Icon, Loader } from 'semantic-ui-react';

import { style } from 'typestyle';

const noMargin = style({
  marginBottom: '0px!important'
});

export type ComponentProps = {
  state: Luis.State;
};

export const LeftMenu = observer(({ state }: ComponentProps) => (
  <Menu pointing secondary inverted color="blue" className={noMargin}>
    <Menu.Item name="home">
      <Loader size="tiny" active={state.testQueue.running} />
    </Menu.Item>
    <Menu.Item active={state.showPassing} onClick={() => (state.showPassing = !state.showPassing)}>
      <Icon name="check" color="green" />
      <div className="lbl">{state.liveRoot.passingTests}</div>
    </Menu.Item>
    <Menu.Item active={state.showFailing} onClick={() => (state.showFailing = !state.showFailing)}>
      <Icon name="remove" color="red" />
      <div className="lbl">{state.liveRoot.failingTests}</div>
    </Menu.Item>
    <Menu.Item id="listView" onClick={() => state.config.toggleStoryView()}>
      <Icon name={state.config.storyView === 'list' ? 'content' : 'indent'} />
    </Menu.Item>
    <Menu.Item id="configView" onClick={() => (state.viewState.snapshotView = 'config')}>
      <Icon name="cogs" />
    </Menu.Item>
  </Menu>
));
