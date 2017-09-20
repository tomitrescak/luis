import * as React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { style } from 'typestyle';

export type Props = {
  state?: App.State;
}

const noMargin = style({
  marginBottom: '0px!important'
})

@inject('state')
@observer
export class TopPanel extends React.PureComponent<Props> {
  state = { activeItem: 'home' }
  
  handleItemClick = (_e: any, { name }: any) => this.props.state.viewState.snapshotView = name;

  render() {
    const view = this.props.state.viewState.snapshotView;
    const story = this.props.state.viewState.selectedStory || { passingTests: 0, failingTests: 0} ;

    return (
      <Menu pointing secondary inverted color="blue" className={noMargin}>
        <Menu.Item><Icon name="check" color="green" /><div className="lbl">{ story.passingTests }</div></Menu.Item>
        <Menu.Item><Icon name="remove" color="red" /><div className="lbl">{ story.failingTests }</div></Menu.Item>
        <Menu.Item name="react" content="React" active={view === 'react'} onClick={this.handleItemClick} />
        <Menu.Item name="html" content="Html" active={view === 'html'} icon="html5" onClick={this.handleItemClick} />
        <Menu.Item name="json" content="Json" active={view === 'json'} icon="code" onClick={this.handleItemClick} />
        <Menu.Menu position="right">
          <Menu.Item name="Update Snapshot" onClick={this.handleItemClick} />
        </Menu.Menu>
      </Menu>
    );
  }
}
