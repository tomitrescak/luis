import * as React from 'react';
import * as SplitPane from 'react-split-pane';

import { style } from 'typestyle';
import { ITheme } from '../config/themes';
import { inject, observer } from 'mobx-react';

import { LeftPanel } from './left_panel';
import { RightPanel } from './right_panel';
import { content } from './component_styles';

//@ts-ignore
import { StateModel } from '../config/state';
import { BareView } from './bare_view';
import { LiveSnapshots } from './snapshot_live';

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

const styles = style({
  $nest: {
    '& .m12': {
      margin: '12px!important'
    },
    '& .m6': {
      margin: '6px!important'
    }
  }
});

export type ComponentProps = {
  state?: Luis.State;
  localStorage: Storage;
};

export const Layout = inject('state')(
  observer(({ state, localStorage }: ComponentProps) => {
    if (state.viewState.sView === 'live') {
      return <LiveSnapshots appState={state} />;
    }
    if (state.viewState.bare) {
      return (
        <div className={styles}>
          <BareView state={state} />
        </div>
      );
    }
    return (
      <div className={styles}>
        <div className={content}>
          <SplitPane
            className={split(state.theme)}
            split="vertical"
            minSize={100}
            defaultSize={parseInt(localStorage.getItem('luis-v-splitPos') || '280px', 10)}
            onChange={(size: string) => localStorage.setItem('luis-v-splitPos', size)}
          >
            <LeftPanel state={state} />
            <RightPanel state={state} />
          </SplitPane>
        </div>
      </div>
    );
  })
);
