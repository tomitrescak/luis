import * as React from 'react';
import { observer } from 'mobx-react';

export type Props = {
  state: Luis.State;
};

@observer
export class StoryComponent extends React.Component<Props> {
  render() {
    var state = this.props.state;
    if (state.viewState.selectedStory == null) {
      return <div>No story selected ...</div>;
    } else
      return <div className={state.viewState.selectedStory.cssClassName}>{state.viewState.selectedStory.component}</div>;
  }
}
