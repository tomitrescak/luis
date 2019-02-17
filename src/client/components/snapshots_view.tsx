import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { List, Label } from 'semantic-ui-react';
import { style } from 'typestyle';
import { Snapshot } from '../models/snapshot_model';

export type Props = {
  state: Luis.State;
};

const margined = style({
  marginTop: '6px!important',
  background: '#e8e8e8',
  borderRadius: '6px',
  textAlign: 'center',
  marginBottom: '6px!important'
});

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
      list = list.reverse();
    }
    if (list.length == 0) {
      return <div>This test has no recorded snapshots.</div>;
    }
    return (
      <List>
        {list.map((s, i) => (
          <List.Item key={s.name + i}>
            <List.Content>
              <List.Header className={margined}>
                <Label
                  as="a"
                  data-path={`${story.id}/${s.parent.urlName}/${s.url}`}
                  href={`/${story.id}/${s.parent.urlName}/${s.url}`}
                  onClick={this.openSnapshot}
                  icon="image"
                  content={s.name}
                />
              </List.Header>
              <List.Description>
                <div dangerouslySetInnerHTML={{ __html: s.current }} />
              </List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>
    );
  }
}
