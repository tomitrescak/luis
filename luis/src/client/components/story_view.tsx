import * as React from 'react';
import { observer } from 'mobx-react';
import { SnapshotHtml } from './snapshot_html';
import { SnapshotJson } from './snapshot_json';
import { SnapshotsView } from './snapshots_view';
import { StoryConfig } from './story_config';

//@ts-ignore
import { Story } from '../models/story_model';
//@ts-ignore
import { StateModel } from '../models/state_model';
import { css } from './component_styles';

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

class FrameView extends React.Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    let href = window.location.href;
    return (
      <iframe
        id="contentFrame"
        className={frameStyle}
        src={
          href.indexOf('stories') !== -1
            ? window.location.href.replace('?stories', '?story')
            : href + '/?story=__empty'
        }
      />
    );
  }
}
FrameView.displayName = 'FrameView';

export const StoryView = observer(({ state }: ComponentProps) => {
  return (
    <>
      <div
        className={frameHolder}
        style={{
          visibility: state.viewState.sView === 'react' ? 'visible' : 'hidden'
        }}
      >
        <FrameView />
      </div>
      {state.viewState.sView === 'html' && <SnapshotHtml state={state} />}
      {state.viewState.sView === 'snapshots' && <SnapshotsView state={state} />}
      {state.viewState.sView === 'json' && <SnapshotJson state={state} />}
      {state.viewState.sView === 'config' && <StoryConfig state={state} />}
    </>
  );
});

StoryView.displayName = 'StoryView';
