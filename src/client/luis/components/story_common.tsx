import * as React from 'react';
import { style } from 'typestyle';
import { StateType, Folder } from '../state/state';
import { StoryType } from '../state/story';
import { Loader } from 'semantic-ui-react';

const header = style({
  marginLeft: `20px`
});

export const bottomTabPane = style({
  position: 'absolute',
  top: '36px',
  bottom: '0px',
  overflow: 'auto',
  left: '6px',
  right: '6px'
});

export const hidePassing = style({
  float: 'right',
  marginTop: '8px',
  marginRight: '6px'
});

export const toolBelt = style({
  width: '100%',
  padding: '6px'
});

export const testHeader = style({
  width: '100%',
  padding: '6px'
});

export const testHeaderLine = style({
  background: '#ddd',
  padding: '3px',
  marginTop: '6px',
  fontWeight: 'bold',
  marginBottom: '3px',
  $nest: {
    '&:first-child': {
      marginTop: '0px'
    }
  }
});

export const testLine = style({
  marginLeft: '6px'
});

export type Indexable = {
  [name: string]: Indexable
};

let index = 0;
export function renderFolder(state: StateType, current: Folder, path = ''): JSX.Element | JSX.Element[] {
  if (!current) {
    return <div>No tests ...</div>;
  }
  let result: JSX.Element[] = [];
  for (let folder of current.folders) {
    if (folder.stories && folder.stories.length) {
      for (let story of folder.stories) {
        let storyHeader = path + ' > ' + folder.name + ' > ' + story.name;
        if (!state.hidePassing || story.tests.some(t => t.result != null && t.result !== '')) {
          result.push(<div className={testHeaderLine} key={storyHeader + index++}>{storyHeader}</div>);
        }
        result.push(...renderStory(state, story));
      }
    }
    result.push(renderFolder(state, folder, (path ? ' > ' : '') + folder.name) as JSX.Element);
  }

  return result;
}

let i = 0;
export function renderStory(state: StateType, story: StoryType): JSX.Element[] {
  let result = [];
  for (let test of story.tests) {
    if (test.result) {
      result.push(<div key={i++} className={testLine}><div className="fail">[FAIL] {test.name}: {test.result }</div></div>);
    } else if (!state.hidePassing) {
      result.push(<div key={i++} className={testLine}><div className="pass" >[PASS] {`${test.name}`}</div></div>);
    }
  }
  return result;
}
