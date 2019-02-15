import * as React from 'react';
import { observer } from 'mobx-react';
import { style } from 'typestyle/lib';

// const resultsHTML = style({ width: '100%' });
const frameHolder = style({
  position: 'absolute',
  left: '0px',
  right: '0px',
  top: '42px',
  bottom: '0px',
  padding: '6px'
});
const leftFrame = style({
  position: 'absolute',
  left: '6px',
  top: '6px',
  right: '50%',
  height: '100%',
  borderRight: '1px dashed #ddd'
});
const rightFrame = style({
  position: 'absolute',
  left: '50%',
  right: '0px',
  height: '100%',
  margin: '0px'
});
const fullFrame = style({ position: 'absolute', width: '100%', height: '100%', margin: '3px' });

export interface PreviewProps {
  state: Luis.State;
}

const DefaultDecorator = ({ children }: any) => <div>{children}</div>;

@observer
export class SnapshotHtml extends React.Component<PreviewProps> {
  render() {
    const state = this.props.state;
    const story = state.viewState.selectedStory;
    const test = state.viewState.selectedTest;
    const snapshot = state.viewState.selectedSnapshot;

    if (!story || !test) {
      return <div>Please select the snapshot</div>;
    }

    if (test.endTime == 0) {
      return <div>Running test ...</div>;
    }

    if (!snapshot) {
      return <div>Snapshot does not exist ;(</div>;
    }

    // deal with json
    let { current, expected } = snapshot;
    if (current.trim()[0] === '{') {
      current = `<pre>${current}</pre>`;
      expected = `<pre>${expected}</pre>`;
    }

    const Decorator = story.decorator ? story.decorator : DefaultDecorator;
    return (
      <Decorator>
        {snapshot && (
          <div className={story.cssClassName}>
            {snapshot.expected && snapshot.expected !== snapshot.current ? (
              <div className={frameHolder}>
                <div
                  className={leftFrame + '  leftPanel'}
                  dangerouslySetInnerHTML={{ __html: current }}
                />
                <div
                  className={rightFrame + '  rightPanel'}
                  dangerouslySetInnerHTML={{ __html: expected || 'No saved snapshot' }}
                />
              </div>
            ) : (
              <div className={frameHolder}>
                <div className={fullFrame} dangerouslySetInnerHTML={{ __html: current }} />
              </div>
            )}
            <div style={{ clear: 'both' }} />
          </div>
        )}
      </Decorator>
    );
  }
}
