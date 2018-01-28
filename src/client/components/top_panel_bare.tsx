import * as React from 'react';

import { style } from 'typestyle';
import { Menu, Icon, Loader, Dropdown, Popup } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { observable } from 'mobx';

import { ErrorView } from './test_view';
import { Test } from '../models/test_model';
import { Snapshot } from '../models/snapshot_model';

const menuImage = style({
  width: '18px!important',
  height: '18px',
  margin: '-2px 6px -2px 0px!important'
});

export type Props = {
  state: Luis.State;
};

const noMargin = style({
  marginBottom: '0px!important'
});

export const SnapshotTitle = ({ s }: { s: Snapshot }) => {
  if (s.expected == null) {
    return (
      <span>
        <Icon name="ban" title="Snapshot missing on server" color="red" /> {s.name}
      </span>
    );
  }
  if (s.expected != s.current) {
    return (
      <span>
        <Icon name="bug" title="Snapshots do not match" color="red" /> {s.name}
      </span>
    );
  }
  return (
    <span>
      <Icon name="image" /> {s.name}
    </span>
  );
};

@inject('state')
@observer
export class TopPanelSingle extends React.Component<Props> {
  handleItemClick = (e: React.MouseEvent<any>) =>
    (this.props.state.viewState.snapshotView = e.currentTarget.getAttribute('data-name'));

  updateClick = async (_e: any) => {
    this.props.state.updatingSnapshots = true;
    if (this.props.state.viewState.testName) {
      this.props.state.packageConfig.bridge.updateSnapshots(
        this.props.state,
        this.props.state.viewState.selectedTest.simplePath
      );
    } else if (this.props.state.viewState.selectedStory) {
      this.props.state.packageConfig.bridge.updateSnapshots(
        this.props.state,
        this.props.state.viewState.selectedStory.simplePath
      );
    }
  };

  openSnapshot = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    let parts = e.currentTarget.getAttribute('data-path').split('/');
    this.props.state.viewState.openSingleStory(parts[0], parts[1], parts[2]);
  };

  render() {
    const view = this.props.state.viewState.snapshotView;
    const test: Test = this.props.state.viewState.selectedTest;
    const viewState = this.props.state.viewState;

    return (
      <div>
        <Menu pointing secondary inverted color="blue" className={noMargin}>
          <Menu.Item>
            {test && test.error ? (
              <Popup
                trigger={<Icon name="remove" color="red" />}
                position="bottom left"
                wide="very"
              >
                <Popup.Content>
                  <ErrorView test={test} single />
                </Popup.Content>
              </Popup>
            ) : (
              <Icon name="check" color="green" />
            )}
            {test && test.duration ? test.duration : 0}ms
          </Menu.Item>
          <Menu.Item
            data-name="react"
            active={view === 'react'}
            onClick={this.handleItemClick}
            title="View the React component"
          >
            <img
              src="data:image/png;base64,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"
              className={menuImage}
            />
          </Menu.Item>
          <Menu.Item
            data-name="html"
            active={view === 'html'}
            title="View the currently selected snapshot and visualise possible differences with stored snapshot"
            onClick={this.handleItemClick}
          >
            <Icon name="html5" />
          </Menu.Item>
          <Menu.Item
            data-name="json"
            title="View the source currently selected snapshot and visualise possible differences with stored snapshot"
            active={view === 'json'}
            onClick={this.handleItemClick}
          >
            <Icon name="code" />
          </Menu.Item>
          {test &&
            test.snapshots && (
              <Dropdown
                title="View all snapshots of a currently selected test or story"
                item
                trigger={
                  viewState.selectedSnapshot ? (
                    <SnapshotTitle s={viewState.selectedSnapshot} />
                  ) : (
                    'Select Snapshot'
                  )
                }
              >
                <Dropdown.Menu>
                  {test.snapshots.map((s, i) => (
                    <a
                      key={s.name + i}
                      className="item"
                      data-path={`${test.parent.id}/${test.urlName}/${s.url}`}
                      href={`story/${test.parent.id}/${test.urlName}/${s.url}`}
                      onClick={this.openSnapshot}
                    >
                      <SnapshotTitle s={s} />
                    </a>
                  ))}
                  <Dropdown.Divider />
                  <Dropdown.Item
                    data-name="snapshots"
                    content="All Snapshots"
                    active={view === 'snapshots'}
                    icon="object group"
                    onClick={this.handleItemClick}
                  />
                </Dropdown.Menu>
              </Dropdown>
            )}

          <Menu.Menu position="right">
            {this.props.state.updatingSnapshots ? (
              <Menu.Item>
                <Loader active inline size="mini" />
              </Menu.Item>
            ) : (
              <Menu.Item
                onClick={this.updateClick}
                title="Update test snapshots to reflect current changes and save snapshots on server."
              >
                <Icon name="refresh" />
              </Menu.Item>
            )}
            {/*<Menu.Item
              title="Auto-update test snapshots with each hot reload to reflect current changes and save snapshots on server."
              active={this.props.state.autoUpdateSnapshots}
              onClick={() =>
                (this.props.state.autoUpdateSnapshots = !this.props.state.autoUpdateSnapshots)
              }
            >
              <Icon name="lock" />
            </Menu.Item>*/}
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}
