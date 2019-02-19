import * as React from 'react';
import { observer } from 'mobx-react';
import { Segment, Message } from 'semantic-ui-react';
import { Loader } from './loader';

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
    const state = this.props.state;
    const story = state.viewState.selectedStory;
    if (story == null) {
      return <div>No story selected ...</div>;
    } else if (story.component) {
      return (
        <div className={story.cssClassName}>
          <Loader component={story.component} proxyConfig={story.proxyConfig} />
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
