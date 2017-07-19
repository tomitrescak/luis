import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { StoryType } from '../state/story';
import { bottomTabPane, toolBelt } from './story_common';
import { style } from 'typestyle/lib';
import { StateType } from '../state/state';

const resultsHTML = style({ display: 'table', width: '100%' });
const resultHTML = style({ display: 'table-cell', width: '50%', padding: '6px' });

export interface PreviewProps {
  story: StoryType;
  state?: StateType;
}

const DefaultDecorator = ({ children }: any) => <div>{children}</div>;

export const Previews = inject('state')(observer(({ story, state }: PreviewProps) => {
  if (state.runningTests) {
    return <div>Gathering data</div>;
  }
  if (!story.snapshots || !story.snapshots[story.activeSnapshot]) {
    return <div>No snapshots</div>;
  }
  const snapshot = story.snapshots[story.activeSnapshot];
  const Decorator = story.decorator ? story.decorator : DefaultDecorator;
  return (
    <Decorator className={bottomTabPane}>
      { snapshot &&
        <div style={{background: story.background}} className={story.cssClassName}>
          { state.snapshotPanes === 'both' && snapshot.expected !== snapshot.current
            ? <div className={resultsHTML}>
                <div className={resultHTML} dangerouslySetInnerHTML={{ __html: story.snapshots[story.activeSnapshot].current }} />
                <div className={resultHTML} dangerouslySetInnerHTML={{ __html: story.snapshots[story.activeSnapshot].expected }} />
              </div>
            : <div dangerouslySetInnerHTML={{ __html: story.snapshots[story.activeSnapshot].html }} />
          }
          <div style={{clear: 'both'}} />
        </div>
      }
    </Decorator>
  );
}));
