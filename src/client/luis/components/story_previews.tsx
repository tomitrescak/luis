import * as React from 'react';
import { observer } from 'mobx-react';
import { StoryType } from '../state/story';
import { bottomTabPane, toolBelt } from './story_common';
import { style } from 'typestyle/lib';

const resultsHTML = style({ display: 'table', width: '100%' });
const resultHTML = style({ display: 'table-cell', width: '50%', padding: '6px' });

export interface PreviewProps {
  story: StoryType;
}

export const Previews = observer(({ story }: PreviewProps) => {
  const snapshot = story.snapshots[story.activeSnapshot];
  return (
    <div className={bottomTabPane}>
      <div className={toolBelt}>
        <select onChange={e => { story.activeSnapshot = parseInt(e.currentTarget.value, 10); }}>
          {story.snapshots.map((s, i) => (
            <option value={i} key={i}>{s.name}</option>
          ))}
        </select>
      </div>

      { snapshot &&
        <div>
          { snapshot.expected !== snapshot.current
            ? <div className={resultsHTML}>
                <div className={resultHTML} dangerouslySetInnerHTML={{ __html: story.snapshots[story.activeSnapshot].current }} />
                <div className={resultHTML} dangerouslySetInnerHTML={{ __html: story.snapshots[story.activeSnapshot].expected }} />
              </div>
            : <div dangerouslySetInnerHTML={{ __html: story.snapshots[story.activeSnapshot].html }} />
          }
        </div>
      }
    </div>
  );
});
