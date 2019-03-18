import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Label } from 'semantic-ui-react';
import { Snapshot } from '../models/snapshot_model';
import { ThemedWrapper } from './themed_wrapper';
import { css } from './component_styles';
import { InfoMessage } from './info_message';

export type Props = {
  state: Luis.State;
};

const margined = css`
  padding: 6px;

  .label {
    margin: 0px !important;
    width: 100%;
    text-align: center;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
  }

  div {
    margin: 0px !important;
    border-top-right-radius: 0px;
    border-top-left-radius: 0px;
    margin-bottom: 6px !important;
  }
`;

@inject('state')
@observer
export class SnapshotsView extends React.Component<Props> {
  openSnapshot = (e: any) => {
    e.preventDefault();
    let parts = e.currentTarget.getAttribute('data-path').split('/');
    this.props.state.viewState.bare
      ? this.props.state.viewState.openSingleStory(parts[0], parts[1], parts[2])
      : this.props.state.viewState.openStory(parts[0], parts[1], parts[2]);
    this.props.state.viewState.sView = 'html';
  };

  render() {
    let list: Snapshot[];
    let view = this.props.state.viewState;
    let story = view.selectedStory;
    const test = view.selectedTest;
    if (!test) {
      if (!story) {
        return <div>No story selected</div>;
      }
      list = story.allSnapshots;
    } else {
      list = test.snapshots;
    }
    if (this.props.state.config.reverseList) {
      list = list.slice().reverse();
    }
    if (list.length == 0) {
      return <InfoMessage>This test has no recorded snapshots.</InfoMessage>;
    }
    return (
      <div className={margined}>
        {list.map((s, i) => (
          <React.Fragment key={i}>
            <Label
              as="a"
              data-path={`${story.id}/${s.parent.urlName}/${s.url}`}
              href={`/${story.id}/${s.parent.urlName}/${s.url}`}
              onClick={this.openSnapshot}
              icon="image"
              content={s.name}
            />

            <ThemedWrapper state={this.props.state} content={s.current} />
          </React.Fragment>
        ))}
      </div>
    );
  }
}
