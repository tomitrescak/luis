import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Accordion, Icon, List, Message, Menu, Divider, Segment } from 'semantic-ui-react';
import { style } from 'typestyle';

import { ITheme } from '../config/themes';
import { TestGroup, Test, Story, Snapshot } from '../config/test_data';
import { observable } from 'mobx';

const pane = (theme: ITheme) =>
  style({
    $nest: {
      '& .title': {
        padding: '3px!important'
      }
    }
  });

const content = style({
  paddingLeft: '12px!important',
  paddingTop: '0px!important'
});

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

const errorDisplay = style({
  background: '#efefef',
  color: 'red!important',
  fontSize: '8px',
  overflow: 'auto',
  maxHeight: '100px'
});

const timing = (color: string) =>
  style({
    float: 'right',
    fontSize: '10px',
    color
  });

const errorMessage = style({
  marginBottom: '6px!important',
  padding: '3px 6px!important'
});

const snapshotMenu = style({
  marginTop: '0px!important',
  fontSize: '12px!important'
});

const hidden = style({
  color: 'white!important'
});

const testPane = style({
  padding: '0px 6px 0px 0px!important',
  marginBottom: '3px!important',
  marginTop: '0px!important'
});

export type Props = {
  state?: App.State;
  group?: TestGroup;
};

@observer
export class TestGroupView extends React.PureComponent<Props> {
  render(): any {
    const { group, state } = this.props;
    return (
      <div>
        <Accordion.Title
          key={group.name}
          active={state.isExpanded(group).get()}
          onClick={e => state.toggleExpanded(e, group)}
        >
          <Icon name="dropdown" />
          {group.constructor.name == 'Story' ? (
            <span>
              <a href={`/${group.id}`} onClick={e => state.viewState.openStoryFromList(e, group.id)}>
                {group.name}
              </a>
            </span>
          ) : (
            <span>{group.name}</span>
          )}

          <div className={timing(group.color)}>{group.duration.toString()}ms</div>
        </Accordion.Title>
        <Accordion.Content active={state.isExpanded(group).get()} className={content}>
          {group.groups.map((g, i) => <TestGroupView state={state} group={g} key={g.fileName} />)}
          {group.tests.map((t, i) => <TestView state={state} test={t} key={t.name} />)}
        </Accordion.Content>
      </div>
    );
  }
}

export type TestProps = {
  state: App.State;
  test: Test;
};

@observer
export class TestView extends React.PureComponent<TestProps> {
  canExpand() {
    return this.props.test.snapshots.length > 0 || this.props.test.error != null;
  }

  openSnapshot = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    let parts = e.currentTarget.getAttribute('data-path').split('/');
    debugger;
    this.props.state.viewState.openStory(parts[0], parts[1], parts[2]);
  }

  render(): any {
    const { test, state } = this.props;
    const expanded = state.isExpanded(test).get();
    return (
      <Segment basic={!expanded} secondary={expanded} className={testPane}>
        <Accordion.Title
          key={test.urlName}
          active={expanded}
          onClick={e => this.canExpand() && state.toggleExpanded(e, test)}
        >
          <Icon name="dropdown" className={this.canExpand() ? 'normal' : hidden} />
          <Icon {...test.icon} />
          {test.name}
          <div className={timing('#AAA')}>{test.duration.toString()}ms</div>
        </Accordion.Title>
        <Accordion.Content active={state.isExpanded(test).get()} className={snapshotContent}>
          {test.snapshots.length > 0 && (
            <List className={snapshotMenu}>
              {test.snapshots.map((s, i) => (
                <List.Item
                  as="a"
                  data-path={`${test.parent.id}/${test.urlName}/${s.url}`}
                  href={`/${test.parent.id}/${test.urlName}/${s.url}`}
                  onClick={this.openSnapshot}
                  icon="image"
                  key={s.name}
                  content={s.name}
                />
              ))}
            </List>
          )}
          {test.error && (
            <div>
              <Message negative size="tiny" className={errorMessage}>
                {test.error.message}
              </Message>
            </div>
          )}
        </Accordion.Content>
      </Segment>
    );
  }
}

// {this.props.state.liveRoot.groups.map((g, i) => <TestGroupView key={i} group={g} />)}

@inject('state')
@observer
export class StoryList extends React.PureComponent<Props> {
  render() {
    const state = this.props.state;
    const version = state.liveRoot.version;
    return (
      <Accordion className={pane(this.props.state.theme)}>
        {state.liveRoot.groups.map((g, i) => <TestGroupView state={state} group={g} key={g.fileName} />)}
      </Accordion>
    );
  }
}
