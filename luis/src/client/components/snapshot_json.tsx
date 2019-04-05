import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { MonacoDiffEditor } from './editor_diff';
import { MonacoEditor } from './editor_single';
import { InfoMessage } from './info_message';

export interface SnapshotsProps {
  state?: Luis.State;
}

const requireConfig = {
  url: 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js',
  paths: {
    // vsNew: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.10.0/min/vs/',
    vs: 'https://unpkg.com/monaco-editor@0.15.6/min/vs/'
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
    const state = this.props.state;
    const {
      selectedStory: story,
      selectedSnapshot: snapshot,
      selectedTest: test
    } = this.props.state.viewState;

    if (!story) {
      return <InfoMessage state={state}>Please select your story</InfoMessage>;
    }

    if (!test || !snapshot) {
      return <InfoMessage state={state}>Please select the snapshot</InfoMessage>;
    }

    if (test.snapshots.length == 0) {
      return <InfoMessage state={state}>This test has no recorded snapshots.</InfoMessage>;
    }

    if (!snapshot) {
      return (
        <InfoMessage state={state}>
          Sorry, we could not locate your snapshot: {this.props.state.viewState.selectedSnapshot}.
        </InfoMessage>
      );
    }

    if (snapshot.current != snapshot.expected) {
      console.log('Rendering diff');
      return (
        <MonacoDiffEditor
          key="HistoryView"
          theme={`vs-${this.props.state.config.theme}`}
          width="100%"
          height="100%"
          options={{
            minimap: {
              enabled: false
            }
          }}
          value={snapshot.expected}
          original={snapshot.current}
          requireConfig={requireConfig}
          language="html"
        />
      );
    }

    console.log('Rendering normela');
    return (
      <MonacoEditor
        key="HistoryView"
        theme={`vs-${this.props.state.config.theme}`}
        width="100%"
        height="100%"
        options={{
          minimap: {
            enabled: false
          }
        }}
        value={snapshot.current}
        requireConfig={requireConfig}
        language="html"
      />
    );
  }
}
