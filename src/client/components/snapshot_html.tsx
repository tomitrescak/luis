import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { style } from 'typestyle/lib';

const resultsHTML = style({ display: 'table', width: '100%' });
const resultHTML = style({ display: 'table-cell', width: '50%' });

export interface PreviewProps {
  state?: Luis.State;
}

const DefaultDecorator = ({ children }: any) => <div>{children}</div>;

export const SnapshotHtml = inject('state')(observer(({ state }: PreviewProps) => {
  const story = state.viewState.selectedStory;
  const test = state.viewState.selectedTest;
  const snapshot = state.viewState.selectedSnapshot;

  if (!story || !test) {
    return <div>Please select the snapshot</div>
  }

  if (test.endTime == 0) {
    return <div>Running test ...</div>
  }

  if (!snapshot) {
    return <div>Snapshot does not exist ;(</div>
  }

  const Decorator = story.decorator ? story.decorator : DefaultDecorator;
  return (
    <Decorator>
      { snapshot &&
        <div className={story.cssClassName}>
          { snapshot.expected !== snapshot.current
            ? <div className={resultsHTML + ' bothView'}>
                <div className={resultHTML + ' leftView'} dangerouslySetInnerHTML={{ __html: snapshot.current }} />
                <div className={resultHTML + ' rightView'} dangerouslySetInnerHTML={{ __html: snapshot.expected }} />
              </div>
            : <div dangerouslySetInnerHTML={{ __html: snapshot.current }} />
          }
          <div style={{clear: 'both'}} />
        </div>
      }
    </Decorator>
  );
}));
