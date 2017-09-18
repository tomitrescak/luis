import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Accordion, Icon, List, Message, Menu } from 'semantic-ui-react';
import { style } from 'typestyle';

import { ITheme } from '../config/themes';
import { TestGroup, Test } from '../config/test_data';
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
  paddingBottom: '6px!important',
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
  marginBottom: '6px!important'
});

const snapshotMenu = style({
  marginTop: '0px!important',
  fontSize: '11px!important'
});

const hidden = style({
  color: 'white!important'
})

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
          active={state.isExpanded(group.fileName).get()}
          onClick={() => state.toggleExpanded(group.fileName)}
        >
          <Icon name="dropdown" />
          {group.name}
          <div className={timing(group.color)}>{group.duration.toString()}ms</div>
        </Accordion.Title>
        <Accordion.Content active={state.isExpanded(group.fileName).get()} className={content}>
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
  render(): any {
    const { test, state } = this.props;
    const path = test.name + test.group.fileName;
    return (
      <div>
        <Accordion.Title key={path} active={state.isExpanded(path).get()} onClick={() => this.canExpand() && state.toggleExpanded(path)}>
          <Icon name="dropdown" className={this.canExpand() ? 'normal' : hidden} />
          <Icon {...test.icon} />
          {test.name}
          <div className={timing('#AAA')}>{test.duration.toString()}ms</div>
        </Accordion.Title>
        <Accordion.Content active={state.isExpanded(path).get()} className={snapshotContent}>
          {test.error && (
            <Message negative size="tiny" className={errorMessage}>
              {test.error.message}
            </Message>
          )}
          {test.snapshots.length > 0 && (
            <Menu vertical fluid className={snapshotMenu} compact inverted color="blue">
              {test.snapshots.map((s, i) => <Menu.Item as="a" icon="image" key={s.name} content={s.name} />)}
            </Menu>
          )}
        </Accordion.Content>
      </div>
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
