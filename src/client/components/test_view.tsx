import * as React from 'react';
import { observer } from 'mobx-react';
import { Accordion, Icon, List, Message, Segment } from 'semantic-ui-react';
import { style } from 'typestyle';

import { Test } from '../config/test_data';

import { DiffView } from 'diff-view';
import { diff, timing } from './component_styles';

export type TestProps = {
  state: Luis.State;
  test: Test;
};

const snapshotContent = style({
  paddingLeft: '24px!important',
  paddingTop: '6px!important',
  paddingBottom: '0px!important',
  $nest: {
    '& .icon': {
      paddingRight: '0px!important'
    }
  }
});

const errorMessage = style({
  padding: '3px 6px!important',
  fontSize: '11px'
});

const noPadding = style({
  padding: '0px!important'
});

const snapshotMenu = style({
  marginTop: '0px!important',
  fontSize: '12px!important'
});

const hidden = style({
  color: 'white!important'
});

const content = style({
  padding: '0px!important',
  marginTop: '-1px',
  marginBottom: '6px'
});

type ErrorViewProps = {
  test: Test;
};

export const ErrorView = ({ test }: ErrorViewProps) => {
  const compareView =
    test.error &&
    test.error.message &&
    test.error.message.indexOf('expected') >= 0 &&
    (test.error.actual || test.error.expected);

  if (!compareView) {
    return (
      <Segment attached="bottom" className={noPadding} inverted color="red">
        <div className={errorMessage}>{test.error.message}</div>
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
    let parts = e.currentTarget.getAttribute('data-path').split('/');
    this.props.state.viewState.openStory(parts[0], parts[1], parts[2]);
  };

  render(): any {
    const { test, state } = this.props;
    const expanded = state.isExpanded(test).get();

    if ((!state.showFailing && test.error) || (!state.showPassing && !test.error)) {
      return false;
    }

    // console.log('Rendering: ' + test.name + '[' + test.uid + ']');
    const prefix = state.viewState.bare ? '/story' : '/stories';

    return (
      <div>
        <Accordion.Title
          key={test.urlName}
          active={expanded}
          onClick={e => this.canExpand() && state.toggleExpanded(e, test)}
          {...(expanded ? { as: Segment, attached: 'top' } : {})}
        >
          <Icon name="dropdown" className={this.canExpand() ? 'normal' : hidden} />
          <Icon {...test.icon} />
          {test.name}
          <div className={timing('#AAA')}>{test.duration.toString()}ms</div>
        </Accordion.Title>
        <Accordion.Content active={expanded} className={content}>
          {test.snapshots.length > 0 && (
            <Segment attached={test.error ? true : 'bottom'} secondary>
              <List className={snapshotMenu}>
                {test.snapshots.map((s, i) => (
                  <List.Item
                    as="a"
                    data-path={`${test.parent.id}/${test.urlName}/${s.url}`}
                    href={`${prefix}/${test.parent.id}/${test.urlName}/${s.url}`}
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
