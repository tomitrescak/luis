import * as React from 'react';
import * as RcCollapse from 'rc-collapse';
import { style } from 'typestyle';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';

import { StoryGroupView, menu } from './story_group';
import * as SplitPane from 'react-split-pane';
import * as marked from 'marked';
import { StoryType } from '../state/story';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { StoryTestsTitle, StoryTests } from './story_tests';
import { AllTestsTitle, AllTests } from './story_all_tests';
import { Actions } from './story_actions';
import { Previews } from './story_previews';
import { bottomTabPane } from './story_common';
import { SnapshotsTitle, Snapshots } from './story_snapshots';
import { StateType, initState } from '../state/state';
import { Icon } from 'semantic-ui-react';

// require('./highlighter');

// // Synchronous highlighting with highlight.js
// marked.setOptions({
//   highlight: function (code) {
//     return Prism.highlight(code, Prism.languages['jsx']);
//   }
// });

const resizeEvent = typeof Event === 'undefined' ? null : new Event('resize');
const Collapse = RcCollapse.default;
const Panel = RcCollapse.Panel;
const container = style({
  width: '100%',
  height: '100%',
  overflow: 'auto',
  background: 'white',
  $nest: {
    '.rc-collapse': {
      border: '0px!important'
    },
  },
  borderRight: 'solid 1px #dedede'
});

const content = style({
  width: '100%',
  height: '100%',
  overflow: 'auto',
  background: 'white'
});

const tabs = style({
  background: 'white',
  width: '100%',
  height: '100%',
  marginLeft: '-1px',
  $nest: {
    '& .tabs-menu': {
      display: 'table',
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    '& .tabs-navigation': {
    },
    '& .tabs-menu-item': {
      float: 'left',
      marginRight: '20px',
      marginLeft: '12px',
      padding: '6px 0px'
    },
    '& .tabs-menu-item a': {
      cursor: 'pointer',
      display: 'block',
      color: '#A9A9A9'
    },
    '& .tabs-menu-item:not(.is-active) a:hover': {
      color: '#3498DB'
    },
    '& .tabs-menu-item.is-active a': {
      color: '#3498DB'
    },
    '& .tab-panel': {
      padding: '10px'
    },
    '& .fail': {
      color: 'red'
    },
    '& .pass': {
      color: 'green'
    }

  }

});

const split = style({
  background: 'white',
  $nest: {
    '& .Resizer': {
      background: '#000',
      opacity: .2,
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


export interface Props {
  state?: StateType;
  forceReload: number;
}

export const StoriesView = inject('state')(observer(({ state }: Props) => {
  // const rootGroup = state.root;
  // let storyPath = state.path;
  // let activeKey = undefined;

  // const rootGroup = state.root;
  // let storyPath = state.path;
  // let activeKey = undefined;

  const storyPath = state.view.selectedStoryId;
  const story = state.activeStory;
  const root = state.root;
  const activeKey = storyPath && storyPath.length ? storyPath[0].toString() : '';

  if (storyPath && storyPath.length && !story) {
    return <div>Invalid path.Please <a href="/">Go Back</a></div >;
  }
  
  // clear current actions
  state.actions.clear();

  // sort by name
  // rootGroup.storyGroups.sort((a, b) => a.name < b.name ? -1 : 1);

  return (
    <div>
      <SplitPane
        className={split}
        split="vertical"
        minSize={100}
        defaultSize={parseInt(localStorage.getItem('luis-v-splitPos'), 10)}
        onChange={(size: string) => localStorage.setItem('luis-v-splitPos', size)}
      >
        <div className={container}>
          <Collapse accordion={true} defaultActiveKey={activeKey}>
            {
              root.folders.map((g, i) => (
                <Panel key={i.toString()} header={g.name} className={menu}>
                  <StoryGroupView folder={g} path={storyPath && storyPath.length && i === storyPath[0] ? toJS(storyPath) : undefined} />
                </Panel>)
              )
            }
          </Collapse>
        </div>
        <SplitPane
          split="horizontal"
          defaultSize={parseInt(localStorage.getItem('luis-h-splitPos'), 10)}
          onChange={(size: string) => {
            localStorage.setItem('luis-h-splitPos', size);
            window.dispatchEvent(resizeEvent);
          }}
          minSize={100}
        >
          <div className={content}>
            <Snapshots story={story} />
          </div>
          <div className={tabs}>
            <Tabs defaultIndex={state.selectedTab} onSelect={(index: number) => state.selectedTab = index}>
              <TabList>
                <Tab>Info</Tab>
                <Tab>Actions <a href="javascript:;" onClick={() => state.actions.clear()}><Icon name="trash" /></a></Tab>
                {state.view.selectedStoryId && <Tab><StoryTestsTitle story={story} /></Tab>}
                <Tab><AllTestsTitle /></Tab>
              </TabList>
              <TabPanel>
                <div title="Info" className={bottomTabPane}>
                  {story && <div dangerouslySetInnerHTML={{ __html: marked(story.info || 'No Info') }}></div>}
                </div>
              </TabPanel>
              <TabPanel>
                <Actions title="Actions" story={story} />
              </TabPanel>
              {state.view.selectedStoryId && <TabPanel>
                <StoryTests story={story} />
              </TabPanel>}
              <TabPanel>
                <AllTests />
              </TabPanel>
            </Tabs>
          </div>
        </SplitPane>
      </SplitPane>
    </div>
  );
}));

