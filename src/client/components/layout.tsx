import * as React from 'react';
import * as SplitPane from 'react-split-pane';


import { style } from 'typestyle';
import { StateModel } from '../config/state';
import { ITheme } from '../config/themes';
import { inject, observer } from 'mobx-react';
import { StoryList } from './story_list';
import { SideBar } from './side_bar';

import DevTools from 'mobx-react-devtools';
import { TopPanel } from './top_panel';
import { StoryComponent } from './story_component';
import { SnapshotHtml } from './snapshot_html';
import { SnapshotJson } from './snapshot_json';

const split = (theme: ITheme) =>
  style({
    background: theme.backgroundColor,
    color: theme.textColor + '!important',
    $nest: {
      '& .Resizer': {
        background: '#000',
        opacity: 0.2,
        zIndex: 1,
        boxSizing: 'border-box',
        backgroundClip: 'padding-box'
      },
      '& .Resizer:hover': {
        transition: 'all 2s ease'
      },
      '& .Resizer.horizontal': {
        height: '11px',
        margin: '-5px 0',
        borderTop: '6px solid rgba(255, 255, 255, 0)',
        borderBottom: '5px solid rgba(255, 255, 255, 0)',
        cursor: 'row-resize',
        width: '100%'
      },
      '& .Resizer.horizontal:hover': {
        borderTop: '5px solid rgba(0, 0, 0, 0.5)',
        borderBottom: '5px solid rgba(0, 0, 0, 0.5)'
      },
      '& .Resizer.vertical': {
        width: '11px',
        margin: '0 -5px',
        borderLeft: '5px solid rgba(255, 255, 255, 0)',
        borderRight: '5px solid rgba(255, 255, 255, 0)',
        cursor: 'col-resize'
      },
      '& .Resizer.vertical:hover': {
        borderLeft: '5px solid rgba(0, 0, 0, 0.5)',
        borderRight: '5px solid rgba(0, 0, 0, 0.5)'
      },
      '& .SplitPane.horizontal': {
        position: 'inherit!important' as any
      }
    }
  });

const full = style({
  width: '100%',
  height: '100%'
});

const pane = style({
  padding: '6px',
  position: 'absolute',
  overflow: 'auto',
  top: 42,
  bottom: 0,
  left: 0,
  right: 0
});

const content = style({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  fontFamily: 'Lato'
});

const styles = style({
  $nest: {
    '& .m12': {
      margin: '12px!important',
    },
    '& .m6': {
      margin: '6px!important'
    },
  }
})

type Props = {
  state?: App.State;
};

export const Layout = inject<Props>('state')(
  observer(({ state }: Props) => (
    <div className={styles}>
      <div className={content}>
        <SplitPane
          className={split(state.theme)}
          split="vertical"
          minSize={100}
          defaultSize={parseInt(localStorage.getItem('luis-v-splitPos'), 10)}
          onChange={(size: string) => localStorage.setItem('luis-v-splitPos', size)}
        >
          <div>
            <SideBar />
            <div className={pane}>
              <StoryList />
            </div>
          </div>
          <div className={full}>
            <TopPanel />
            {state.viewState.snapshotView === 'react' && (
              <div className={pane}>
                <StoryComponent state={state} />
              </div>
            )}
            {state.viewState.snapshotView === 'html' && (
              <div className={pane}>
                <SnapshotHtml state={state} />
              </div>
            )}
            {state.viewState.snapshotView === 'json' && (
              <div className={full}>
                <SnapshotJson state={state} />
              </div>
            )}
          </div>
        </SplitPane>
      </div>
      { state.config.showDevTools && <DevTools position={{ right: 5, top: 42 }} /> }
    </div>
  ))
);
