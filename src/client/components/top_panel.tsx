import * as React from 'react';
import { Menu, Icon, Loader } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { style } from 'typestyle';
import { observable } from 'mobx';

export type Props = {
  state?: App.State;
};

const noMargin = style({
  marginBottom: '0px!important'
});

@inject('state')
@observer
export class TopPanel extends React.PureComponent<Props> {
  @observable updating = false;

  handleItemClick = (_e: any, { name }: any) => (this.props.state.viewState.snapshotView = name);

  updateClick = async (_e: any) => {
    // this.updating = true;
    // const story = this.props.state.viewState.selectedStory;
    // if (story) {
    //   await fetch(`/tests?name=${story.name.replace(/\s/g, '')}&extraParams=${this.props.state.renderOptions.extraUpdateProps}`);
    //   this.updating = false;
    // }
    if (this.props.state.viewState.selectedStory) {
      this.props.state.updatingSnapshots = true;
      this.props.state.testQueue.canAddTest = true;
      this.props.state.testQueue.add(this.props.state.viewState.selectedStory);
    }
  };

  render() {
    const view = this.props.state.viewState.snapshotView;
    const story = this.props.state.viewState.selectedStory || { passingTests: 0, failingTests: 0 };

    return (
      <Menu pointing secondary inverted color="blue" className={noMargin}>
        <Menu.Item>
          <Icon name="check" color="green" />
          <div className="lbl">{story.passingTests}</div>
        </Menu.Item>
        <Menu.Item>
          <Icon name="remove" color="red" />
          <div className="lbl">{story.failingTests}</div>
        </Menu.Item>
        <Menu.Item name="react" content="React" active={view === 'react'} onClick={this.handleItemClick} />
        <Menu.Item name="html" content="Html" active={view === 'html'} icon="html5" onClick={this.handleItemClick} />
        <Menu.Item name="json" content="Json" active={view === 'json'} icon="code" onClick={this.handleItemClick} />
        <Menu.Item name="snapshots" content="Snapshots" active={view === 'snapshots'} icon="image" onClick={this.handleItemClick} />
        <Menu.Menu position="right">
          
          {this.updating ? (
            <Menu.Item>
              <Loader active inline size="mini" />
            </Menu.Item>
          ) : (
            <Menu.Item onClick={this.updateClick} content="Update" />
          )}
          <Menu.Item active={this.props.state.autoUpdateSnapshots} onClick={() => this.props.state.autoUpdateSnapshots = !this.props.state.autoUpdateSnapshots} icon="refresh" title="Auto Update Snapshots" />
        </Menu.Menu>
      </Menu>
    );
  }
}
