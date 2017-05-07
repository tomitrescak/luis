import * as React from 'react';
import { style } from 'typestyle';

// let index = 0;
const css = style({
  $nest: {
    '& .vs .lineHighlight': {
      background: 'lightblue'
    },
    '& .vs-dark .lineHighlight': {
      background: 'darkblue'
    }
  }
});

export type Editor = monaco.editor.IStandaloneDiffEditor;


export interface Props {
  activeEditor?: string;
  className?: string;
  defaultValue?: string;
  editorDidMount?: (editor: any, monaco: any) => void;
  editorWillMount?: (monaco: any) => void;
  glyphMargin?: boolean;
  width?: string | number;
  height?: string | number;
  options?: any;
  requireConfig?: any;
  theme?: string;
  clientValue: string;
  serverValue: string;
}

export interface State {
  editorLoaded: boolean;
}

export class MonacoEditor extends React.Component<Props, State> {
  __current_value: string;
  __prevent_trigger_change_event: boolean;
  editor: monaco.editor.IStandaloneDiffEditor;

  constructor(props: Props) {
    super(props);
    this.state = {
      editorLoaded: false
    };
  }
  componentDidMount() {
    this.afterViewInit();
  }

  componentWillUnmount() {
    this.destroyMonaco();
    window.removeEventListener('resize', this.resize);
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (this.props.clientValue !== nextProps.clientValue || this.props.serverValue !== nextProps.serverValue) {
      let original = monaco.editor.createModel(nextProps.clientValue, 'text/plain');
      let modified = monaco.editor.createModel(nextProps.serverValue, 'text/plain');
      monaco.editor.setModelLanguage(original, 'json');
      monaco.editor.setModelLanguage(modified, 'json');

      this.editor.setModel({ original, modified });
      return true;
    }
    return this.state.editorLoaded !== nextState.editorLoaded;
  }

  editorWillMount(monaco: any) {
    const { editorWillMount } = this.props;
    editorWillMount(monaco);
  }

  editorDidMount(editor: Editor, _m?: any) {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: false,
      allowComments: false
    });

    this.editor = editor;
    const { editorDidMount } = this.props;
    editorDidMount(editor, monaco);

    window.addEventListener('resize', this.resize);

    // set that editor did load
    this.setState({ editorLoaded: true });
  }

  resize = () => {
    this.editor.layout();
  }

  afterViewInit() {
    const { requireConfig } = this.props;
    const loaderUrl = requireConfig.url || 'vs/loader.js';
    const context: any = window;
    const onGotAmdLoader = () => {
      if (context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
        // Do not use webpack
        if (requireConfig.paths && requireConfig.paths.vs) {
          context.require.config(requireConfig);
        }
      }

      // Load monaco
      context.require(['vs/editor/editor.main'], () => {
        this.initMonaco();
      });

      // Call the delayed callbacks when AMD loader has been loaded
      if (context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
        context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = false;
        let loaderCallbacks = context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__;
        if (loaderCallbacks && loaderCallbacks.length) {
          let currentCallback = loaderCallbacks.shift();
          while (currentCallback) {
            currentCallback.fn.call(currentCallback.context);
            currentCallback = loaderCallbacks.shift();
          }
        }
      }
    };

    // Load AMD loader if necessary
    if (context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
      // We need to avoid loading multiple loader.js when there are multiple editors loading concurrently
      //  delay to call callbacks except the first one
      context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__ = context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__ || [];
      context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__.push({
        context: this,
        fn: onGotAmdLoader
      });
    } else {
      if (typeof context.require === 'undefined') {
        let loaderScript = context.document.createElement('script');
        loaderScript.type = 'text/javascript';
        loaderScript.src = loaderUrl;
        loaderScript.addEventListener('load', onGotAmdLoader);
        context.document.body.appendChild(loaderScript);
        context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = true;
      } else {
        onGotAmdLoader();
      }
    }
  }/* */


  initMonaco() {
    const { theme, options } = this.props;
    const containerElement = this.refs['container'] as HTMLElement;

    options.lineNumbersMinChars = 3;

    if (typeof monaco !== 'undefined') {
      // Before initializing monaco editor
      this.editorWillMount(monaco);

      const customOptions = Object.assign({}, { language: 'typescript', theme }, options);
      this.editor = monaco.editor.createDiffEditor(containerElement, customOptions);

      // After initializing monaco editor
      this.editorDidMount(this.editor, monaco);

      // after timeout make sure that Monaco is within bounds
      setTimeout(() => this.editor.layout(), 1500);
    }
  }
  destroyMonaco() {
    if (typeof this.editor !== 'undefined') {
      try {
        this.editor.dispose();
      } catch (_ex) { /* I don't care */ }
    }
  }
  render() {
    const { width, height } = this.props;
    let style = {};
    if (width || height) {
      const fixedWidth = width.toString().indexOf('%') !== -1 ? width : `${width}px`;
      const fixedHeight = height.toString().indexOf('%') !== -1 ? height : `${height}px`;
      style = {
        width: fixedWidth,
        height: fixedHeight,
      };
    }

    return (
      <div style={style}>
        {!this.state.editorLoaded && <div>Loading ...</div>}
        <div ref="container" style={style} className={`${this.props.className} ${css} react-monaco-editor-container`}></div>
      </div>
    );
  }
}

function noop() {/**/ }

MonacoEditor.defaultProps = {
  width: null,
  height: null,
  value: null,
  glyphMargin: true,
  defaultValue: '',
  language: 'javascript',
  theme: 'vs',
  options: {
    glyphMargin: true
  },
  editorDidMount: noop,
  editorWillMount: noop,
  onChange: noop,
  requireConfig: null,
};

MonacoEditor.displayName = 'MonacoEditor';
export default MonacoEditor;

