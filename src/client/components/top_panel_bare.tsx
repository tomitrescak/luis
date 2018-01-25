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
const image = process.env.NODE_ENV == 'test' ? 'react.png' : require('./react.png');

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
  @observable updating = false;

  handleItemClick = (e: React.MouseEvent<any>) =>
    (this.props.state.viewState.snapshotView = e.currentTarget.getAttribute('data-name'));

  updateClick = async (_e: any) => {
    if (this.props.state.viewState.selectedStory) {
      this.props.state.updatingSnapshots = true;
      this.props.state.testQueue.canAddTest = true;
      this.props.state.testQueue.add(this.props.state.viewState.selectedStory);
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
            <img src={image} className={menuImage} />
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
            {this.updating ? (
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
            <Menu.Item
              title="Auto-update test snapshots with each hot reload to reflect current changes and save snapshots on server."
              active={this.props.state.autoUpdateSnapshots}
              onClick={() =>
                (this.props.state.autoUpdateSnapshots = !this.props.state.autoUpdateSnapshots)}
            >
              <Icon name="lock" />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}
