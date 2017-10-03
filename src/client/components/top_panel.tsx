import * as React from 'react';
import { Menu, Icon, Loader, Dropdown, Popup } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { style } from 'typestyle';
import { observable } from 'mobx';
import { Test } from '../config/test_data';
import { ErrorView } from './test_view';

export type Props = {
  state?: Luis.State;
};

const noMargin = style({
  marginBottom: '0px!important'
});

@inject('state')
@observer
export class TopPanel extends React.Component<Props> {
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
        <Menu.Item
          name="snapshots"
          content="Snapshots"
          active={view === 'snapshots'}
          icon="image"
          onClick={this.handleItemClick}
        />
        <Menu.Menu position="right">
          {this.updating ? (
            <Menu.Item>
              <Loader active inline size="mini" />
            </Menu.Item>
          ) : (
            <Menu.Item onClick={this.updateClick} content="Update" />
          )}
          <Menu.Item
            active={this.props.state.autoUpdateSnapshots}
            onClick={() => (this.props.state.autoUpdateSnapshots = !this.props.state.autoUpdateSnapshots)}
            icon="refresh"
            title="Auto Update Snapshots"
          />
        </Menu.Menu>
      </Menu>
    );
  }
}

@inject('state')
@observer
export class TopPanelSingle extends React.Component<Props> {
  @observable updating = false;

  handleItemClick = (e: React.MouseEvent<any>) => (this.props.state.viewState.snapshotView = e.currentTarget.getAttribute('data-name'));

  updateClick = async (_e: any) => {
    if (this.props.state.viewState.selectedStory) {
      this.props.state.updatingSnapshots = true;
      this.props.state.testQueue.canAddTest = true;
      this.props.state.testQueue.add(this.props.state.viewState.selectedStory);
    }
  };

  render() {
    const view = this.props.state.viewState.snapshotView;
    const story = this.props.state.viewState.selectedStory || { passingTests: 0, failingTests: 0 };
    const test: Test = this.props.state.viewState.selectedTest;
    const viewState = this.props.state.viewState;

    return (
      <Menu pointing secondary inverted color="blue" className={noMargin}>
        <Menu.Item>
          {test && test.error ? (
            <Popup trigger={<Icon name="remove" color="red" />} wide="very">
              <Popup.Content>
                <ErrorView test={test} />
              </Popup.Content>
            </Popup>
            
          ) : (
            <Icon name="check" color="green" />
          )}
          { test && test.duration ? test.duration : 0 }ms
        </Menu.Item>
        <Menu.Item data-name="react" active={view === 'react'} icon="cube" onClick={this.handleItemClick} />
        <Menu.Item data-name="html" active={view === 'html'} icon="html5" onClick={this.handleItemClick} />
        <Menu.Item data-name="json" active={view === 'json'} icon="code" onClick={this.handleItemClick} />
        {test &&
          test.snapshots && (
            <Dropdown item text={viewState.selectedSnapshot ? viewState.selectedSnapshot.name : 'Select Snapshot'}>
              <Dropdown.Menu>
                {test.snapshots.map((s, i) => (
                  <a
                    href=""
                    key={s.name + i}
                    className="item"
                    onClick={e => {
                      e.preventDefault();
                      viewState.snapshotName = s.url;
                      viewState.snapshotView = 'html';
                    }}
                  >
                    <Icon name="image" /> {s.name}
                  </a>
                ))}
                <Dropdown.Divider />
                <Dropdown.Item
                  data-name="snapshots"
                  content="All Snapshots"
                  active={view === 'snapshots'}
                  icon="image"
                  onClick={this.handleItemClick}
                />
              </Dropdown.Menu>
            </Dropdown>
          )}

        <Menu.Menu position="right">
          {this.updating ? (
            <Menu.Item>
              <Loader active inline size="mini" />
            </Menu.Item>
          ) : (
            <Menu.Item onClick={this.updateClick} icon="refresh" title="Update Snapshot" />
          )}
          <Menu.Item
            active={this.props.state.autoUpdateSnapshots}
            onClick={() => (this.props.state.autoUpdateSnapshots = !this.props.state.autoUpdateSnapshots)}
            icon="lock"
            title="Auto Update Snapshots"
          />
        </Menu.Menu>
      </Menu>
    );
  }
}
