import * as React from 'react';
import { style } from 'typestyle';
import { observer } from 'mobx-react';
import { StoryType } from '../state/story';

import { MonacoEditor } from './editor';
import { bottomTabPane, toolBelt } from './story_common';
import { TestConfig } from 'fuse-test-runner';
import { initState } from "../state/state";

const requireConfig = {
  url: 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js',
  paths: {
    'vs': 'https://unpkg.com/monaco-editor@0.8.3/min/vs/'
  }
};

const snapshotSelect = style({
  marginLeft: '10px'
});

export interface SnapshotsProps {
  title?: any;
  story: StoryType;
}

export const SnapshotsTitle = observer(({ story }: SnapshotsProps) => {
  if (!story || !story.snapshots || !story.snapshots.length) {
    return <span>No Snapshots</span>;
  }
  return (
    <span>Snapshots JSON [
    <span className="pass">{story.snapshots.filter(s => s.matching).length}</span> /
    <span className="fail">{story.snapshots.filter(s => !s.matching).length}</span>]
  </span>
  );
});

function updateSnapshot(button: HTMLButtonElement, story: StoryType, snapshotName: string) {
  while (snapshotName[snapshotName.length - 1].match(/[0-9 ]/)) {
    snapshotName = snapshotName.substring(0, snapshotName.length - 1);
  }
  button.textContent = 'Updating ...';

  const name = 
  fetch(`/tests/snapshots/${story.className}_snapshots.json?update=true&name=${snapshotName}`)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      button.textContent = 'Update Snapshots';
      // remove from memory
      console.log('Remove: ' + `/tests/snapshots/${story.className}_snapshots.json`)
      FuseBox.remove(`/tests/snapshots/${story.className}_snapshots.json`);
      TestConfig.snapshotCalls = null;
      
      // rerun tests
      let state = initState();
      // let story = state.findStoryByClassName(story.className);
      story.startTests();

      // story.snapshots = [];
      // window.location.reload();
    });
}

@observer
export class Snapshots extends React.PureComponent<SnapshotsProps, {}> {

  editor: monaco.editor.IStandaloneDiffEditor;

  initEditor = (mountEditor: any) => {
    this.editor = mountEditor as any;
    this.setModel();
  }

  setModel = () => {
    let original = monaco.editor.createModel(this.props.story.snapshots[this.props.story.activeSnapshot].current, 'text/plain');
    let modified = monaco.editor.createModel(this.props.story.snapshots[this.props.story.activeSnapshot].expected, 'text/plain');
    monaco.editor.setModelLanguage(original, 'json');
    monaco.editor.setModelLanguage(modified, 'json');

    this.editor.setModel({ original, modified });
  }

  render() {
    const story = this.props.story;

    if (!story || !story.snapshots || !story.snapshots.length) {
      return <span>No Snapshots</span>;
    }

    return (
      <div className={bottomTabPane} style={{ overflow: 'hidden' }}>
        <div className={toolBelt}>
          <select onChange={e => { story.activeSnapshot = parseInt(e.currentTarget.value, 10); }}>
            {story.snapshots.map((s, i) => (
              <option value={i} key={i}>{s.name}</option>
            ))}
          </select>
          <button className={snapshotSelect} onClick={(e) => updateSnapshot(e.currentTarget, story, story.snapshots[story.activeSnapshot].name)}>Update Snapshot</button>
        </div>


        <MonacoEditor key="HistoryView"
          editorDidMount={this.initEditor}
          theme="vs-light"
          width="100%"
          height="100%"
          clientValue={this.props.story.snapshots[this.props.story.activeSnapshot].current}
          serverValue={this.props.story.snapshots[this.props.story.activeSnapshot].expected}
          requireConfig={requireConfig}
        />
      </div>
    );
  }
};
