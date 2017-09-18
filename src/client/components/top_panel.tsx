import * as React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { TestGroup } from '../config/test_data';

export type Props = {
  state?: App.State;
}

@inject('state')
@observer
export class TopPanel extends React.PureComponent<Props> {
  state = { activeItem: 'home' }
  
  handleItemClick = (_e: any, { name }: any) => this.props.state.viewState.snapshotView = name;

  render() {
    const view = this.props.state.viewState.snapshotView;
    const story = this.props.state.viewState.selectedStory || { passingTests: 0, failingTests: 0} ;

    return (
      <Menu pointing secondary inverted color="blue">
        <Menu.Item><Icon name="check" color="green" /><div className="lbl">{ story.passingTests }</div></Menu.Item>
        <Menu.Item><Icon name="remove" color="red" /><div className="lbl">{ story.failingTests }</div></Menu.Item>
        <Menu.Item name="react" content="React" active={view === 'react'} onClick={this.handleItemClick} />
        <Menu.Item name="html" content="Html" active={view === 'html'} onClick={this.handleItemClick} />
        <Menu.Item name="json" content="Json" active={view === 'json'} onClick={this.handleItemClick} />
        <Menu.Menu position="right">
          <Menu.Item name="Update Snapshot" onClick={this.handleItemClick} />
        </Menu.Menu>
      </Menu>
    );
  }
}
