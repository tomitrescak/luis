import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { MonacoDiffEditor } from './editor_diff';
import { MonacoEditor } from './editor_single';

export interface SnapshotsProps {
  state?: Luis.State;
}

const requireConfig = {
  url: 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js',
  paths: {
    // vsNew: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.10.0/min/vs/',
    vs: 'https://unpkg.com/monaco-editor@0.10.1/min/vs/'
  }
};

@inject('state')
@observer
export class SnapshotJson extends React.Component<SnapshotsProps, {}> {
  editor: monaco.editor.IStandaloneDiffEditor;

  // initEditor = (mountEditor: monaco.editor.IStandaloneDiffEditor) => {
  //   this.editor = mountEditor;
  //   this.setModel();
  // };

  // setModel = () => {
  //   let original = monaco.editor.createModel(
  //     this.props.state.viewState.selectedSnapshot.current,
  //     'text/plain'
  //   );
  //   let modified = monaco.editor.createModel(
  //     this.props.state.viewState.selectedSnapshot.expected,
  //     'text/plain'
  //   );
  //   monaco.editor.setModelLanguage(original, 'json');
  //   monaco.editor.setModelLanguage(modified, 'json');

  //   this.editor.setModel({ original, modified });
  // };

  render() {
    const { selectedStory: story, selectedSnapshot: snapshot, selectedTest: test } = this.props.state.viewState;

    if (!story || !test) {
      return <div>Please select your story</div>
    }

    if (story.duration == 0) {
      return <div>Running tests ...</div>;
    }

    if (test.snapshots.length == 0) {
      return <div>Test has no snapshots ...</div>;
    }

    if (!snapshot) {
      return <div style={{padding: '6px'}}>Snapshot does not exist ;(</div>
    }

    if (snapshot.current != snapshot.expected) {
      console.log("Rendering diff")
      return <MonacoDiffEditor
        key="HistoryView"
        theme="vs-light"
        width="100%"
        height="100%"
        options={{minimap: {
          enabled: false
        }}}
        value={snapshot.expected}
        original={snapshot.current}
        requireConfig={requireConfig}
        language="html"
      />
    }

    console.log("Rendering normela")
    return (
      <MonacoEditor
        key="HistoryView"
        theme="vs-light"
        width="100%"
        height="100%"
        options={{minimap: {
          enabled: false
        }}}
        value={snapshot.current}
        requireConfig={requireConfig}
        language="html"
      />
    );
  }
}