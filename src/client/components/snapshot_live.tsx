import * as React from 'react';

import Highlight from 'react-highlight';
import { observer } from 'mobx-react';
import { DiffView } from 'diff-view';
import { observable, IObservableArray } from 'mobx';

import { style } from 'typestyle';

export const diff = style({
  $nest: {
    '& table': {
      width: '100%',
      background: 'white',
      color: 'black'
    },
    '& .diff': {
      borderCollapse: 'collapse',
      whiteSpace: 'pre-wrap'
    },
    '& .diff tbody': {
      fontFamily: 'Courier, monospace',
      fontSize: '11px'
    },
    '& .diff tbody th': {
      background: '#EED',
      fontSize: '11px',
      fontWeight: 'normal',
      border: '1px solid #BBC',
      color: '#886',
      padding: '.1em .4em .1em',
      textAlign: 'right',
      verticalAlign: 'top',
      width: '30px'
    },
    '& .diff thead': {
      borderBottom: '1px solid #BBC',
      background: '#EFEFEF'
    },
    '& .diff thead th.texttitle': {
      textAlign: 'left',
      fontSize: '11px'
    },
    '& .diff tbody td': {
      paddingLeft: '.4em',
      verticalAlign: 'top',
      width: '50%'
    },
    '& .diff .empty': {
      backgroundColor: '#DDD'
    },
    '& .diff .replace': {
      backgroundColor: '#FD8'
    },
    '& .diff .delete': {
      backgroundColor: '#E99'
    },
    '& .diff .skip': {
      backgroundColor: '#EFEFEF',
      border: '1px solid #AAA',
      borderRight: '1px solid #BBC'
    },
    '& .diff .insert': {
      backgroundColor: '#9E9'
    },
    '& .diff th.author': {
      textAlign: 'right',
      borderTop: '˝1px solid #BBC',
      background: '#EFEFEF'
    }
  }
});

type Props = {
  snapshot: any;
  state: AppState;
};

class AppState {
  @observable
  view = 'html';
  @observable
  filter = '';
  @observable
  failing = false;
}

@observer
class Item extends React.Component<Props> {
  render() {
    const v = this.props.snapshot;
    const state = this.props.state;

    if (v.expected) {
      return (
        <div>
          <style>{v.css}</style>
          <div className="ui label fluid" style={{ margin: '12px 0px!important' }}>
            {v.snapshotName}
          </div>

          {state.view === 'html' && (
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <th style={{ width: '50%', background: '#dedede' }}>Current</th>
                  <th style={{ width: '50%', background: '#dedede' }}>Expected</th>
                </tr>
                <tr>
                  {v.content.trim()[0] === '{' ? (
                    <>
                      <td style={{ width: '50%' }}>
                        <Highlight language="json">{v.content}</Highlight>
                      </td>
                      <td style={{ width: '50%' }}>
                        <Highlight language="json">{v.expected}</Highlight>
                      </td>
                    </>
                  ) : (
                    <>
                      <td
                        style={{ width: '50%' }}
                        dangerouslySetInnerHTML={{ __html: v.content }}
                      />
                      <td
                        style={{ width: '50%' }}
                        dangerouslySetInnerHTML={{ __html: v.expected }}
                      />
                    </>
                  )}
                </tr>
              </tbody>
            </table>
          )}
          {state.view === 'source' && (
            <div
              className={diff}
              dangerouslySetInnerHTML={{
                __html: (DiffView.compare(v.content, v.expected, 'Current', 'Expected', 1) as any)
                  .outerHTML
              }}
            />
          )}
          {state.view === 'current' &&
            (v.content.trim()[0] === '{' ? (
              <div style={{ width: '100%' }}>
                <Highlight language="json">{v.content}</Highlight>
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: v.content }} />
            ))}
          {state.view === 'snapshot' &&
            (v.content.trim()[0] === '{' ? (
              <div style={{ width: '100%' }}>
                <Highlight language="json">{v.expected}</Highlight>
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: v.expected }} />
            ))}
        </div>
      );
    }

    return (
      <div>
        <div className="ui label fluid" style={{ margin: '12px 0px!important' }}>
          {v.snapshotName}
        </div>
        {v.content.trim()[0] === '{' ? (
          <Highlight language="json">{v.content}</Highlight>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: v.content }} />
        )}
      </div>
    );
  }
}

const state = new AppState();

type HeaderProps = {
  appState: Luis.State;
};

@observer
export class Header extends React.Component<HeaderProps> {
  render() {
    return (
      <div className="ui fixed green inverted menu" style={{ marginBottom: '0px' }}>
        <div className="ui category search item">
          <div className="ui icon input">
            <input
              className="prompt"
              type="text"
              placeholder="Filter snapshots..."
              value={state.filter}
              onChange={e => {
                state.filter = (e.target as any).value;
              }}
            />
            <i className="search link icon" />
          </div>
          <div className="results" />
        </div>
        <a className="item" onClick={() => (state.view = 'html')}>
          <i className="html5 icon" /> Html
        </a>
        <a className="item" onClick={() => (state.view = 'source')}>
          <i className="code icon" /> Source
        </a>
        <a className="item" onClick={() => (state.view = 'current')}>
          <i className="check icon" /> Current
        </a>
        <a className="item" onClick={() => (state.view = 'snapshot')}>
          <i className="image icon" /> Snapshot
        </a>
        <a
          className={`item ${state.failing && 'active'}`}
          onClick={() => (state.failing = !state.failing)}
        >
          <i className="times circle icon" /> Failing Only
        </a>
        <div className="right menu">
          <a
            className="item"
            onClick={() => this.props.appState.viewState.setSnapshotView('react')}
          >
            <i className="left arrow icon" /> Back
          </a>
        </div>
      </div>
    );
  }
}

type LiveSnapshot = {
  content: string;
  snapshotName: string;
  expected: string;
  css: string;
};

@observer
export class LiveSnapshots extends React.Component<HeaderProps> {
  timeout: any;
  snapshots: IObservableArray<LiveSnapshot> = observable([]);

  fetchData = () => {
    fetch(process.env.REACT_APP_SNAPSHOT_URL || '/live-snapshots', {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(result =>
      result
        .json()
        .then(data => {
          this.snapshots.replace(data);
          this.timeout = setTimeout(this.fetchData, 1000);
        })
        .catch(
          error => console.log(error)
          // alert(
          //   'Live snapshots are not enabled. Please follow the documentation to enable live snapshots: ' +
          //     error
          // )
        )
    );
  };

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    return (
      <div style={{ padding: '56px 6px 6px 6px' }}>
        <Header appState={this.props.appState} />
        {this.snapshots
          .filter(
            s =>
              (!state.filter || s.snapshotName.indexOf(state.filter) >= 0) &&
              (!state.failing || s.expected)
          )
          .map((v, i) => (
            <Item key={v.snapshotName + i.toString()} snapshot={v} state={state} />
          ))}
      </div>
    );
  }
}
