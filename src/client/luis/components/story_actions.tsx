import * as React from 'react';
import { observer } from 'mobx-react';
import { bottomTabPane } from './story_common';
import { Story } from '../state/story';

export interface ActionProps {
  title: any;
  story: Story;
}
export const Actions = observer(({ story }: ActionProps) => {
  return (
    <div className={bottomTabPane}>
      {story && story.actions.map(a => (
        <div>{a}</div>
      ))}
    </div>
  );
});
