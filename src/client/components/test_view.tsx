import * as React from 'react';

import { observer } from 'mobx-react';
import { DiffView } from 'diff-view';
import { Accordion, Icon, List, Segment } from 'semantic-ui-react';
import { style } from 'typestyle';

import { diff, timing } from './component_styles';
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

const snapshotHolder = style({
  padding: '6px!important'
  // marginRight: '-3px!important',
  // $nest: {
  //   '.segment': {
  //     padding: '6px!important',
  //     marginBottom: '0px!important'
  //   }
  // }
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
    return this.props.test.error != null;
  }

  openSnapshot = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    let parts = e.currentTarget.getAttribute('data-path').split('/');
    this.props.state.viewState.openStory(parts[0], parts[1], parts[2]);
    return false;
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
        '.iconHolder': {
          flex: '1 auto!important',
          paddingTop: '10px!important'
        },
        '.testTitle': {
          flex: '1 100%!important'
        },
        '.list': {
          marginTop: '10px!important'
        },
        '.noSegment': {
          marginLeft: '6px'
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
          <div className={test.snapshots.length ? 'iconHolder' : ''}>
            <Icon name="dropdown" className={this.canExpand() ? 'normal' : hidden} />
          </div>

          <div className={'testTitle'}>
            <div
              className={
                test.snapshots.length
                  ? snapshotHolder + ' ui secondary attached segment'
                  : 'noSegment'
              }
            >
              <Icon {...test.icon as any} />

              <a
                href={`${prefix}=${test.parent.id}&test=${test.urlName}/`}
                data-path={`${test.parent.id}/${test.urlName}/`}
                onClick={this.openSnapshot}
              >
                {test.name}
              </a>
              <div className={timing(test.error ? 'red' : 'green')}>
                {test.duration.toString()}ms
              </div>

              {test.snapshots.length > 0 && (
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
              )}
            </div>
          </div>
        </Accordion.Title>
        <Accordion.Content active={expanded} className={content}>
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
