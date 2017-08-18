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
import { Icon, Modal, Button, Form, Divider } from 'semantic-ui-react';

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
const container = (theme: string = 'light') =>
  style({
    width: '100%',
    height: '100%',
    overflow: 'auto',
    background: theme === 'light' ? 'white' : '#333',
    color: theme === 'light' ? '#333' : '#eee',
    $nest: {
      '.rc-collapse': {
        border: '0px!important'
      }
    },
    borderRight: 'solid 1px #dedede'
  });

const content = (theme: string = 'light') =>
  style({
    width: '100%',
    height: '100%',
    overflow: 'auto',
    background: theme === 'light' ? 'white' : '#333',
    color: theme === 'light' ? '#333' : '#eee'
  });

const tabs = (theme: string = 'light') =>
  style({
    background: theme === 'light' ? 'white' : '#333',
    color: theme === 'light' ? '#333' : '#eee',
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
      '& .tabs-navigation': {},
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

const split = (theme = 'light') =>
  style({
    background: theme === 'light' ? 'white' : '#333',
    color: theme === 'light' ? '#333' : '#eee',
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

export interface ModalProps {
  state?: StateType;
}

export const StoryConfig = inject<ModalProps>('state')(
  observer(({ state }: ModalProps) =>
    <Modal
      trigger={
        <Button fluid style={{ borderRadius: '0px' }} content="Settings" />
      }
    >
      <Modal.Header>Select Which Tests Will Run</Modal.Header>
      <Modal.Content>
        <Form>
          {state.stories.map((s, i) =>
            <Form.Checkbox
              key={i}
              label={s.folder + ' > ' + s.name}
              checked={!s.isDisabled}
              onChange={() => state.toggleStoryTests(s, !s.isDisabled)}
            />
          )}
          <Divider icon="settings" horizontal />
          <Form.Select
            label="Console Log Level"
            defaultValue={localStorage.getItem('luisLog')}
            options={[
              { value: '0', text: 'None' },
              { value: '1', text: 'All' },
              { value: '2', text: 'ErrorsOnly' }
            ]}
            onChange={(_e, selected) => localStorage.setItem('luisLog', selected.value.toString() )}
          />
          <Form.Select
            label="Theme"
            defaultValue={localStorage.getItem('luisTheme') || 'light'}
            options={[
              { value: 'light', text: 'Light' },
              { value: 'dark', text: 'Dark' }
            ]}
            onChange={(_e, selected) => localStorage.setItem('luisTheme', selected.value.toString() )}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <div style={{ padding: '3px', textAlign: 'right' }}>
          <Button
            color="green"
            content="Select All"
            icon="check"
            onClick={() => state.toggleAllTests(false)}
          />
          <Button
            color="red"
            content="Deselect all"
            icon="remove"
            onClick={() => state.toggleAllTests(true)}
          />
          <Button
            primary
            onClick={() => window.location.reload()}
            icon="file"
            content="Save and Reload"
          />
        </div>
      </Modal.Actions>
    </Modal>
  )
);

export interface Props {
  state?: StateType;
  forceReload: number;
}

export const StoriesView = inject('state')(
  observer(({ state }: Props) => {
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
      return (
        <div>
          Invalid path.Please <a href="/">Go Back</a>
        </div>
      );
    }

    const theme = localStorage.getItem('luisTheme');
    if (!theme) {
      localStorage.setItem('luisTheme', 'light');
    }

    // clear current actions
    state.actions.clear();

    // sort by name
    // rootGroup.storyGroups.sort((a, b) => a.name < b.name ? -1 : 1);

    return (
      <div>
        <SplitPane
          className={split(theme)}
          split="vertical"
          minSize={100}
          defaultSize={parseInt(localStorage.getItem('luis-v-splitPos'), 10)}
          onChange={(size: string) => localStorage.setItem('luis-v-splitPos', size)}
        >
          <div className={container(theme)}>
            <StoryConfig />
            <Collapse accordion={true} defaultActiveKey={activeKey}>
              {root.folders.sort((a, b) => (a.name > b.name ? 1 : -1)).map((g, i) =>
                <Panel key={i.toString()} header={g.name} className={menu}>
                  <StoryGroupView
                    folder={g}
                    path={
                      storyPath && storyPath.length && i === storyPath[0]
                        ? toJS(storyPath)
                        : undefined
                    }
                  />
                </Panel>
              )}
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
            <div className={content(theme)}>
              <Snapshots story={story} />
            </div>
            <div className={tabs(theme)}>
              <Tabs
                defaultIndex={state.selectedTab}
                onSelect={(index: number) => (state.selectedTab = index)}
              >
                <TabList>
                  <Tab>Info</Tab>
                  <Tab>
                    Actions{' '}
                    <a href="javascript:;" onClick={() => state.actions.clear()}>
                      <Icon name="trash" />
                    </a>
                  </Tab>
                  {state.view.selectedStoryId &&
                    <Tab>
                      <StoryTestsTitle story={story} />
                    </Tab>}
                  <Tab>
                    <AllTestsTitle />
                  </Tab>
                </TabList>
                <TabPanel>
                  <div title="Info" className={bottomTabPane}>
                    {story &&
                      <div dangerouslySetInnerHTML={{ __html: marked(story.info || 'No Info') }} />}
                  </div>
                </TabPanel>
                <TabPanel>
                  <Actions title="Actions" story={story} />
                </TabPanel>
                {state.view.selectedStoryId &&
                  <TabPanel>
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
  })
);
