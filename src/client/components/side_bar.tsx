import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Sidebar, Menu, Icon, Loader, Button } from 'semantic-ui-react';

import { style } from 'typestyle';
import { StoryComponent } from './story_component';
import { StoryConfig } from './story_config';

const menuButton = style({
  margin: '0px!important',
  padding: '12px 0px!important',
  width: '100%',
  $nest: {
    '& .lbl': {
      marginTop: '6px'
    }
  }
});

const noMargin = style({
  marginBottom: '0px!important'
})

export type Props = {
  state?: App.State;
};

@inject('state')
@observer
export class SideBar extends React.PureComponent<Props> {
  render() {
    const state = this.props.state;

    return (
      <Menu
        pointing secondary inverted color="blue" className={noMargin}
      >
        <Menu.Item name="home">
          <Loader size="tiny" active={state.testQueue.running} />
        </Menu.Item>
        <Menu.Item active={state.showPassing} onClick={() => state.showPassing = !state.showPassing}>
          <Icon name="check" color="green" /><div className="lbl">{ state.liveRoot.passingTests }</div>
        </Menu.Item>
        <Menu.Item active={state.showFailing} onClick={() => state.showFailing = !state.showFailing}>
          <Icon name="remove" color="red" /><div className="lbl">{ state.liveRoot.failingTests }</div>
        </Menu.Item>
        <Menu.Item onClick={() => state.config.toggleStoryView()}>
          <Icon name={state.config.storyView === 'list' ? 'content' : 'indent'} />
        </Menu.Item>
        <StoryConfig />

      </Menu>
    );
  }
}
