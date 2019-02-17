import * as React from 'react';

import { observer } from 'mobx-react';
import { DiffView } from 'diff-view';
import { Accordion, Icon, List, Segment } from 'semantic-ui-react';
import { style } from 'typestyle';

import { diff, timing, floatShots } from './component_styles';
import { Test } from '../models/test_model';

export type TestProps = {
  state: Luis.State;
  test: Test;
};

export const errorMessage = style({
  padding: '3px 6px!important',
  fontSize: '11px',
  margin: '0px!important',
  overflow: 'auto'
});

export const noPadding = style({
  padding: '0px!important'
});

const snapshotMenu = style({
  marginTop: '0px!important',
  fontSize: '12px!important'
});

const hidden = style({
  color: 'white!important',
  visibility: 'hidden'
});

const content = style({
  padding: '0px!important',
  marginTop: '-1px',
  marginBottom: '6px'
});

type ErrorViewProps = {
  test: Test;
  single?: boolean;
};

export const ErrorView = ({ test, single }: ErrorViewProps) => {
  const compareView =
    test.error && test.error.message && (test.error.actual != null || test.error.expected != null);

  if (!compareView) {
    return (
      <Segment attached={single ? undefined : 'bottom'} className={noPadding} inverted color="red">
        <pre className={errorMessage}>{test.error.message}</pre>
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

    const bump = style({
      marginLeft: '-22px',
      display: 'flex',
      $nest: {
        i: {
          flex: '1 auto!important',
          minWidth: '15px'
        },
        a: {
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          flex: '1 100%',
          minWidth: '60px'
        },
        div: {
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden'
        }
      }
    });

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

          <a
            className="text"
            href={`${prefix}=${test.parent.id}&test=${test.urlName}/`}
            data-path={`${test.parent.id}/${test.urlName}/`}
            onClick={this.openSnapshot}
          >
            {test.name}
          </a>

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
                {test.snapshots.map(s => (
                  <List.Item
                    as="a"
                    data-path={`${test.parent.id}/${test.urlName}/${s.url}`}
                    href={`${prefix}=${test.parent.id}&test=${test.urlName}&snapshot=${s.url}`}
                    onClick={this.openSnapshot}
                    icon="image"
                    key={s.name}
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
