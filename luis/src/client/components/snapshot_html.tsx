import * as React from 'react';
import { observer } from 'mobx-react';
import { css } from './component_styles';
import { ThemedWrapper } from './themed_wrapper';
import { InfoMessage } from './info_message';

// const resultsHTML = css` width: '100%' });
const frameHolder = css`
  /* name:frame-holder */
  position: absolute;
  left: 0px;
  right: 0px;
  top: 40px;
  bottom: 0px;
`;

const leftFrame = css`
  /* name:left-html */
  position: absolute;
  left: 0%;
  right: 50%;
  height: 100%;
  border-right: 1px dashed #ddd;
`;

const rightFrame = css`
  /* name:right-html */
  position: absolute;
  left: 50%;
  right: 0px;
  height: 100%;
  margin: 0px;
`;

const fullFrame = css`
  /* name:full-html */
  position: absolute;
  width: 100%;
  height: 100%;
`;

export interface PreviewProps {
  state: Luis.State;
}

@observer
export class SnapshotHtml extends React.Component<PreviewProps> {
  static displayName = 'SnapshotHtml';

  render() {
    const state = this.props.state;
    const story = state.viewState.selectedStory;
    const test = state.viewState.selectedTest;
    const snapshot = state.viewState.selectedSnapshot;

    if (!story || !test) {
      return <InfoMessage>Please select the snapshot</InfoMessage>;
    }

    if (!snapshot) {
      return <InfoMessage>This test has no recorded snapshots.</InfoMessage>;
    }

    // deal with json
    let { current, expected } = snapshot;
    if (current.trim()[0] === '{') {
      current = `<pre>${current}</pre>`;
      expected = `<pre>${expected}</pre>`;
    }

    return (
      <>
        {snapshot.expected && snapshot.expected !== snapshot.current ? (
          <div className={frameHolder}>
            <div className={leftFrame + '  leftPanel'}>
              <ThemedWrapper state={state} content={current} />
            </div>

            <div className={rightFrame + '  rightPanel'}>
              <ThemedWrapper state={state} content={expected || 'No saved snapshot'} />
            </div>
          </div>
        ) : (
          <div className={frameHolder}>
            <div className={fullFrame}>
              <ThemedWrapper state={state} content={current} />
            </div>
          </div>
        )}
        <div style={{ clear: 'both' }} />
      </>
    );
  }
}
