import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Segment, List, Message, Label } from 'semantic-ui-react';
import { style } from 'typestyle';
import { Snapshot } from '../config/test_data';

export type Props = {
  state: Luis.State;
};

const margined = style({
  marginTop: '6px!important',
  background: '#e8e8e8',
  borderRadius: '6px',
  textAlign: 'center',
  marginBottom: '6px!important'
})

@inject('state')
@observer
export class SnapshotsView extends React.Component<Props> {
  render() {
    const test = this.props.state.viewState.selectedTest;
    if (!test) {
      return <div>No test selected</div>;
    }
    let list: Snapshot[] = test.snapshots;
    if (this.props.state.config.reverseList) {
      list = list.reverse();
    }
    return (
      <List>
        {list.map((s, i) => (
          <List.Item key={s.name + i}>
            <List.Content>
              <List.Description>
                <div dangerouslySetInnerHTML={{ __html: s.current }} />
              </List.Description>
              <List.Header className={margined}><Label icon="image" content={s.name} /></List.Header>
            </List.Content>
          </List.Item>
        ))}
      </List>
    );
  }
}
