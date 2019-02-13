import * as React from 'react';
import { observer } from 'mobx-react';
import { full, pane } from './component_styles';
import { ErrorBoundary } from './error_boundary';
import { StoryComponent } from './story_component';
import { SnapshotHtml } from './snapshot_html';
import { SnapshotJson } from './snapshot_json';
import { SnapshotsView } from './snapshots_view';
import { StoryConfig } from './story_config';

//@ts-ignore
import { Story } from '../models/story_model';
//@ts-ignore
import { StateModel } from '../models/state_model';

type ComponentProps = {
  state?: Luis.State;
};

export const StoryView = observer(({ state }: ComponentProps) => (
  <div className={full}>
    {state.viewState.sView === 'react' && (
      <div className={pane(state.hideTestMenus)}>
        <ErrorBoundary>
          <StoryComponent state={state} />
        </ErrorBoundary>
      </div>
    )}
    {state.viewState.sView === 'html' && (
      <div>
        <SnapshotHtml state={state} />
      </div>
    )}
    {state.viewState.sView === 'json' && (
      <div className={full}>
        <SnapshotJson state={state} />
      </div>
    )}
    {state.viewState.sView === 'snapshots' && (
      <div className={pane(state.hideTestMenus)}>
        <SnapshotsView state={state} />
      </div>
    )}
    {state.viewState.sView === 'config' && (
      <div className={pane(state.hideTestMenus)}>
        <StoryConfig state={state} />
      </div>
    )}
  </div>
));
