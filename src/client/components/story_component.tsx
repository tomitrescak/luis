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

// const mobile = (r: Resolution) => css`
//   float: left;
//   background-color: #dedede;
//   margin: 12px;
//   padding: 8px;

//   .mobileContent {
//     width: ${r.horizontal + 'px'};
//     height: ${r.vertical + 'px'};
//     background: white;
//     border: solid 1px #cdcdcd;
//     position: relative;
//   }
// `;

@observer
export class StoryComponent extends React.Component<Props> {
  static displayName = 'StoryComponent';

  render() {
    const state = this.props.state;
    const story = state.viewState.selectedStory;

    if (story == null) {
      return <div>No story selected ...</div>;
    } else if (story.component) {
      // // check if we have several resolutions
      // let resolutions = state.viewState.resolutions.filter(r => r.active);
      // if (resolutions.length) {
      //   return resolutions.map((r, i) => (
      //     <div key={i} className={mobile(r)}>
      //       <b>
      //         {r.name}
      //         <span
      //           className={css`
      //             float: right;
      //           `}
      //         >
      //           {r.horizontal}x{r.vertical}
      //         </span>
      //       </b>
      //       <div className="mobileContent">
      //         <Loader component={story.component} proxyConfig={story.proxyConfig} />
      //       </div>
      //     </div>
      //   ));
      // }

      return <Loader component={story.component} proxyConfig={story.proxyConfig} />;
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
