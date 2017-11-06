import * as React from 'react';
import { observer } from 'mobx-react';
import { style } from 'typestyle/lib';

// const resultsHTML = style({ width: '100%' });
const resultHTML = style({ width: '100%', height: '100%', border: 0 });
const frameHolder = style({ width: '50%', padding: '6px' });

export interface PreviewProps {
  state: Luis.State;
}

const DefaultDecorator = ({ children }: any) => <div>{children}</div>;

@observer
export class SnapshotHtml extends React.Component<PreviewProps> {
  leftFrame: HTMLIFrameElement;
  rightFrame: HTMLIFrameElement;

  _template = '';

  // recreates template from the current document
  get template() {
    if (!this._template) {
      this._template = '<html>';

      const current = document.documentElement;
      for (let i = 0; i < current.childNodes.length; i++) {
        let top = current.childNodes[i] as HTMLElement;
        if (top.nodeName.toLowerCase() === 'script') {
          continue;
        } else if (top.nodeName.toLowerCase() !== 'body') {
          if (top.nodeValue) {
            this._template += top.nodeValue;
          } else if (top.outerHTML) {
            this._template += top.outerHTML;
          }
        } else {
          this._template += '<body>';
          for (let j = 0; j < top.childNodes.length; j++) {
            let bodyElement = top.childNodes[j] as HTMLElement;
            if (bodyElement.nodeName.toLowerCase() === 'script') {
              continue;
            } else if (bodyElement.id) {
              this._template += '<div id="snapshotContent"></div>';
            } else if (bodyElement.nodeValue) {
              this._template += bodyElement.nodeValue;
            } else if (bodyElement.outerHTML) {
              this._template += bodyElement.outerHTML;
            }
          }
          this._template += '</body>';
        }
      }
      this._template += '</html>';
    }
    return this._template;
  }

  setContent(doc: Document, content: string) {
    let root = doc.querySelector('#snapshotContent');
    if (!root) {
      doc.documentElement.innerHTML = this.template;
      root = doc.querySelector('#snapshotContent');
    }
    root.innerHTML = content;
  }

  updateFrames() {
    const snapshot = this.props.state.viewState.selectedSnapshot;
    if (this.leftFrame) {
      this.setContent(this.leftFrame.contentDocument, snapshot.current);
    }
    if (this.rightFrame) {
      this.setContent(
        this.rightFrame.contentDocument,
        snapshot.expected || 'Snapshot does not exist'
      );
    }
  }

  componentDidMount() {
    this.updateFrames();
  }

  componentDidUpdate() {
    this.updateFrames();
  }

  render() {
    const state = this.props.state;
    const story = state.viewState.selectedStory;
    const test = state.viewState.selectedTest;
    const snapshot = state.viewState.selectedSnapshot;

    if (!story || !test) {
      return <div>Please select the snapshot</div>;
    }

    if (test.endTime == 0) {
      return <div>Running test ...</div>;
    }

    if (!snapshot) {
      return <div>Snapshot does not exist ;(</div>;
    }

    const Decorator = story.decorator ? story.decorator : DefaultDecorator;
    return (
      <Decorator>
        {snapshot && (
          <div className={story.cssClassName}>
            {snapshot.expected !== snapshot.current ? (
              <table style={{ width: '100%' }}>
                {/* I apologise for this layout ... will fix later*/}
                <tbody>
                  <tr>
                    <td className={frameHolder} style={{ borderRight: '1px dashed #ddd' }}>
                      <iframe
                        ref={node => (this.leftFrame = node)}
                        className={resultHTML + ' leftView'}
                      />
                    </td>
                    <td className={frameHolder}>
                      <iframe
                        ref={node => (this.rightFrame = node)}
                        className={resultHTML + ' rightView'}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div style={{padding: '6px'}}><iframe ref={node => (this.leftFrame = node)} className={resultHTML + ' leftView'} /></div>
            )}
            <div style={{ clear: 'both' }} />
          </div>
        )}
      </Decorator>
    );
  }
}
