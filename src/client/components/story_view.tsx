import * as React from 'react';
import { observer } from 'mobx-react';
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
import { css } from './component_styles';
import { ITheme } from '../config/themes';

type ComponentProps = {
  state?: Luis.State;
  bare?: boolean;
};

const frameStyle = css`
  border: 0px;
  width: 100%;
  height: 100%;
`;

const frameHolder = css`
  position: absolute;
  top: 40px;
  right: 0px;
  left: 0px;
  bottom: 0px;
`;

const frameBack = (theme: ITheme) => css`
  background-color: ${theme.backgroundColor};
  height: 100%;
  width: 100%;
`;

export const StoryView = observer(({ state }: ComponentProps) => {
  return (
    <div
      className={
        frameBack(state.theme) + ' ' + state.config.wrapperStyle
          ? css`
              ${state.config.wrapperStyle}
            `
          : ''
      }
    >
      {state.viewState.sView === 'react' && (
        <>
          {state.viewState.bare || window.location !== window.parent.location ? (
            <ErrorBoundary>
              <StoryComponent state={state} />
            </ErrorBoundary>
          ) : (
            <div className={frameHolder}>
              <iframe
                style={{ backgroundColor: 'red' }}
                id="contentFrame"
                className={frameStyle}
                src={window.location.href.replace('?stories', '?story')}
              />
            </div>
          )}
        </>
      )}
      {state.viewState.sView === 'html' && <SnapshotHtml state={state} />}
      {state.viewState.sView === 'json' && <SnapshotJson state={state} />}
      {state.viewState.sView === 'snapshots' && <SnapshotsView state={state} />}
      {state.viewState.sView === 'config' && <StoryConfig state={state} />}
    </div>
  );
});
