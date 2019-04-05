import * as React from 'react';

import { observer } from 'mobx-react';
import { DiffView } from 'diff-view';
import { Accordion, Icon, List, Segment } from 'semantic-ui-react';

import { diff, timing, floatShots, css } from './component_styles';
import { Test } from '../models/test_model';

export type TestProps = {
  state: Luis.State;
  test: Test;
};

export const errorMessage = css`
  padding: 12px !important;
  font-size: 11px !important;
  margin: 0px !important;
  overflow: auto;

  pre {
    margin: 0px !important;
  }
`;

export const noPadding = css`
  padding: 0px !important;
`;

const snapshotMenu = css`
  margin-top: 0px !important;
  font-size: 12px !important;
`;

const hidden = css`
  color: white !important;
  visibility: hidden;
`;

const content = css`
  padding: 0px 12px 0px 0px !important;
  padding-right: 12px !important;
  margin-top: -1px;
  margin-bottom: 3px;
`;

const bump = css`
  margin-left: -22px;
  margin-bottom: 3px;
  display: flex;
  i {
    flex: 1 auto !important;
    min-width: 15px;
  }
  a {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    flex: 1 100%;
    min-width: 60px;
  }
  span {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    flex: 1 100%;
    min-width: 60px;
  }
  div {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

type ErrorViewProps = {
  test: Test;
  single?: boolean;
};

export const ErrorView = ({ test, single }: ErrorViewProps) => {
  const compareView =
    test.error && test.error.message && (test.error.actual != null || test.error.expected != null);

  if (!compareView) {
    return (
      <Segment
        attached={single ? undefined : 'bottom'}
        inverted
        color="red"
        className={errorMessage}
      >
        <pre>{test.error.message}</pre>
      </Segment>
    );
  }

  return (
    <Segment attached="bottom" className={noPadding}>
      <div
        className={diff}
        ref={input => {
          if (input) {
            if (input.childNodes.length) {
              input.removeChild(input.childNodes[0]);
            }
            input.appendChild(DiffView.compare(
              test.error.actual,
              test.error.expected,
              'Current',
              'Expected',
              1
            ) as any);
          }
        }}
      />
    </Segment>
  );
};

@observer
export class TestView extends React.Component<TestProps> {
  static displayName = 'TestItem';

  errorView: HTMLDivElement;

  canExpand() {
    return this.props.test.snapshots.length > 0 || this.props.test.error != null;
  }

  openSnapshot = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    let parts = e.currentTarget.getAttribute('data-path').split('/');
    this.props.state.viewState.openStory(parts[0], parts[1], parts[2]);
  };

  render(): any {
    const { test, state } = this.props;
    const expanded =
      state.isExpanded(test).get() && (test.error != null || test.snapshots.length > 0);

    if ((!state.showFailing && test.error) || (!state.showPassing && !test.error)) {
      return false;
    }

    // console.log('Rendering: ' + test.name + '[' + test.uid + ']');
    const prefix = state.viewState.bare ? '?story' : '?stories';

    return (
      <div>
        <Accordion.Title
          key={test.urlName}
          active={expanded}
          className={bump}
          onClick={e => this.canExpand() && state.toggleExpanded(e, test)}
        >
          <Icon name="dropdown" className={this.canExpand() ? 'normal' : hidden} />
          <Icon {...test.icon as any} />

          {React.createElement(
            test.snapshots.length ? 'a' : 'span',
            {
              className: 'text',
              href: `${prefix}=${test.parent.id}&test=${test.urlName}/`,
              'data-path': `${test.parent.id}/${test.urlName}/`,
              onClick: test.snapshots.length ? this.openSnapshot : undefined
            },
            test.name
          )}

          <div className={floatShots}>
            {test.snapshots.slice(0, 3).map((s, i) => (
              <a
                key={i}
                onClick={this.openSnapshot}
                data-path={`${test.parent.id}/${test.urlName}/${s.url}`}
              >
                &nbsp;
                <Icon name="image" />
              </a>
            ))}
          </div>

          <div className={timing(test.error ? 'red' : 'green')}>{test.duration.toString()}ms</div>
        </Accordion.Title>
        <Accordion.Content active={expanded} className={content}>
          {test.snapshots.length > 0 && (
            <Segment secondary attached={test.error ? 'top' : undefined}>
              <List className={snapshotMenu}>
                {test.snapshots.map((s, i) => (
                  <List.Item
                    as="a"
                    data-path={`${test.parent.id}/${test.urlName}/${s.url}`}
                    href={`${prefix}=${test.parent.id}&test=${test.urlName}&snapshot=${s.url}`}
                    onClick={this.openSnapshot}
                    icon="image"
                    key={s.name + i}
                    content={s.name}
                  />
                ))}
              </List>
            </Segment>
          )}

          {test.error && <ErrorView test={test} />}
        </Accordion.Content>
      </div>
    );
  }
}

/*
ref={input => {
                  if (input) {
                    if (input.childNodes.length) {
                      input.removeChild(input.childNodes[0]);
                    }
                    input.appendChild(
                      DiffView.compare(test.error.actual, test.error.expected, 'Current', 'Expected', 1) as any
                    );
                  } 
                }}
                */
