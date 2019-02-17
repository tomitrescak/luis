import * as React from 'react';
import { observer } from 'mobx-react';
import { Segment, Message } from 'semantic-ui-react';

export type Props = {
  state: Luis.State;
};

const warningText = `describe('Name', () => {
  const component = () => <div>Component</div>;
  
  return { component };
}`;

@observer
export class StoryComponent extends React.Component<Props> {
  render() {
    var state = this.props.state;
    if (state.viewState.selectedStory == null) {
      return <div>No story selected ...</div>;
    } else if (state.viewState.selectedStory.component) {
      return (
        <div className={state.viewState.selectedStory.cssClassName}>
          {state.viewState.selectedStory.component()}
        </div>
      );
    } else {
      return (
        <div>
          <Message>
            <Message.Header>
              This test does not export a React component. Please export the component in the
              describe statement.
            </Message.Header>

            <Segment secondary>
              <pre>{warningText}</pre>
            </Segment>
          </Message>
        </div>
      );
    }
  }
}
