import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Sidebar, Menu, Icon, Loader, Button } from 'semantic-ui-react';

import { style } from 'typestyle';
import { StoryComponent } from './story_component';

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

export type Props = {
  state?: App.State;
};

@inject('state')
@observer
export class SideBar extends React.PureComponent<Props> {
  render() {
    const state = this.props.state;

    return (
      <Sidebar
        as={Menu}
        color={state.theme.sideBarColor}
        icon
        animation="uncover"
        width="very thin"
        visible={true}
        vertical
        inverted
      >
        <Menu.Item name="home">
          <Loader size="tiny" active={state.testQueue.running} />
        </Menu.Item>
        <Menu.Item as={Button} toggle active={true} className={menuButton}>
          <Icon name="check" color="green" /><div className="lbl">{ state.liveRoot.passingTests }</div>
        </Menu.Item>
        <Menu.Item as={Button} toggle active={true} className={menuButton}>
          <Icon name="remove" color="red" /><div className="lbl">{ state.liveRoot.failingTests }</div>
        </Menu.Item>
        <Menu.Item name="camera">
          <Icon name="options" />
        </Menu.Item>
      </Sidebar>
    );
  }
}
