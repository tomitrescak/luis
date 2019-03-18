import * as React from 'react';
import { observer } from 'mobx-react';

import { css } from './component_styles';

type ComponentProps = {
  state?: Luis.State;
};

const frameStyle = css`
  border: 0px;
  width: 100%;
  height: 100%;
`;

const frameHolder = css`
  position: fixed;
  top: 140px;
  right: 0px;
  left: 400px;
  bottom: 0px;
  z-index: 100;
`;

export const FrameView = observer(({ state }: ComponentProps) => {
  return (
    <div
      className={frameHolder}
      style={{
        visibility: state.viewState.sView === 'react' ? 'visible' : 'hidden'
      }}
    >
      <iframe
        id="contentFrame"
        className={frameStyle}
        src={window.location.href.replace('?stories', '?story')}
      />
    </div>
  );
});

FrameView.displayName = 'StoryView';
