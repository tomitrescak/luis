import * as React from 'react';

function noop() { }

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
  value: string;
  original: string;
  language: string;
  context?: any;
  onChange?: (val: string, e: any) => any;
}

export class MonacoDiffEditor extends React.Component<Props> {
  __current_value: string;
  __current_original: string;
  __prevent_trigger_change_event: boolean;
  containerElement: HTMLElement;
  editor: any;

  constructor(props: Props) {
    super(props);
    this.containerElement = undefined;
    this.__current_value = props.value;
    this.__current_original = props.original;
  }

  componentDidMount() {
    this.afterViewInit();
  }

  componentDidUpdate(prevProps: Props) {
    const context = this.props.context || window;
    if (this.props.value !== this.__current_value ||
      this.props.original !== this.__current_original) {
      // Always refer to the latest value
      this.__current_value = this.props.value;
      this.__current_original = this.props.original;
      // Consider the situation of rendering 1+ times before the editor mounted
      if (this.editor) {
        this.__prevent_trigger_change_event = true;
        this.updateModel(this.__current_value, this.__current_original);
        this.__prevent_trigger_change_event = false;
      }
    }
    if (prevProps.language !== this.props.language) {
      context.monaco.editor.setModelLanguage(this.editor.getModel(), this.props.language);
    }
  }

  componentWillUnmount() {
    this.destroyMonaco();
  }

  editorWillMount(monaco: any) {
    const { editorWillMount } = this.props;
    editorWillMount(monaco);
  }

  editorDidMount(editor: any, monaco: any) {
    this.props.editorDidMount(editor, monaco);
    editor.onDidUpdateDiff((event: any) => {
      const value = editor.getValue();

      // Always refer to the latest value
      this.__current_value = value;

      // Only invoking when user input changed
      if (!this.__prevent_trigger_change_event) {
        this.props.onChange(value, event);
      }
    });
  }

  afterViewInit() {
    const context = this.props.context || window;
    if (context.monaco !== undefined) {
      this.initMonaco();
      return;
    }
    const { requireConfig } = this.props;
    const loaderUrl = requireConfig.url || 'vs/loader.js';
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
        const loaderCallbacks = context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__;
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
      // We need to avoid loading multiple loader.js when there are multiple editors loading
      // concurrently, delay to call callbacks except the first one
      // eslint-disable-next-line max-len
      context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__ = context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__ || [];
      context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__.push({
        context: this,
        fn: onGotAmdLoader
      });
    } else if (typeof context.require === 'undefined') {
      const loaderScript = context.document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = loaderUrl;
      loaderScript.addEventListener('load', onGotAmdLoader);
      context.document.body.appendChild(loaderScript);
      context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = true;
    } else {
      onGotAmdLoader();
    }
  }

  updateModel(value: string, original: string) {
    const context = this.props.context || window;
    const { language } = this.props;
    const originalModel = context.monaco.editor.createModel(original, language)
    const modifiedModel = context.monaco.editor.createModel(value, language)
    this.editor.setModel({
      original: originalModel,
      modified: modifiedModel
    })
  }

  initMonaco() {
    const value = this.props.value !== null ? this.props.value : this.props.defaultValue;
    const { original, theme, options } = this.props;
    const context = this.props.context || window;
    if (this.containerElement && typeof context.monaco !== 'undefined') {
      // Before initializing monaco editor
      this.editorWillMount(context.monaco);
      this.editor = context.monaco.editor.createDiffEditor(this.containerElement, options);
      if (theme) {
        context.monaco.editor.setTheme(theme)
      }
      // After initializing monaco editor
      this.updateModel(value, original)
      this.editorDidMount(this.editor, context.monaco);
    }
  }

  destroyMonaco() {
    if (typeof this.editor !== 'undefined') {
      this.editor.dispose();
    }
  }

  assignRef = (component: HTMLElement) => {
    this.containerElement = component;
  }

  render() {
    const { width, height } = this.props;
    const fixedWidth = width.toString().indexOf('%') !== -1 ? width : `${width}px`;
    const fixedHeight = height.toString().indexOf('%') !== -1 ? height : `${height}px`;
    const style = {
      width: fixedWidth,
      height: fixedHeight,
    };

    return (
      <div ref={this.assignRef} style={style} className="react-monaco-editor-container" />
    )
  }
}

MonacoDiffEditor.defaultProps = {
  width: '100%',
  height: '100%',
  original: null,
  value: null,
  defaultValue: '',
  language: 'javascript',
  theme: null,
  options: {},
  editorDidMount: noop,
  editorWillMount: noop,
  onChange: noop,
  requireConfig: {},
};

MonacoDiffEditor.displayName = 'MonacoDiffEditor';