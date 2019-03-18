import * as React from 'react';
import * as SplitPane from 'react-split-pane';

import { inject, observer } from 'mobx-react';

import { LeftPanel } from './left_panel';
import { RightPanel } from './right_panel';
import { splitPane, content } from './component_styles';

//@ts-ignore
import { StateModel } from '../config/state';
import { BareView } from './bare_view';

export type ComponentProps = {
  state?: Luis.State;
  localStorage: Storage;
};

export const Layout = inject('state')(
  observer(({ state, localStorage }: ComponentProps) => {
    // if (state.viewState.sView === 'live') {
    //   return <LiveSnapshots appState={state} />;
    // }
    if (state.viewState.bare) {
      return <BareView state={state} />;
    }
    return (
      <>
        {/* <FrameView state={state} /> */}
        <SplitPane
          className={splitPane(state.theme) + ' ' + content}
          split="vertical"
          minSize={100}
          defaultSize={parseInt(localStorage.getItem('luis-v-splitPos') || '280px', 10)}
          onDragStarted={() => (state.viewState.frame.style.pointerEvents = 'none')}
          onDragFinished={() => (state.viewState.frame.style.pointerEvents = 'auto')}
          onChange={(size: string) => localStorage.setItem('luis-v-splitPos', size)}
        >
          <LeftPanel state={state} />
          <RightPanel state={state} />
        </SplitPane>
        );
      </>
    );
  })
);
Layout.displayName = 'Layout';
