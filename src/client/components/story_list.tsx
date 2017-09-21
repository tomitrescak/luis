import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Accordion, Icon } from 'semantic-ui-react';
import { style } from 'typestyle';

import { ITheme } from '../config/themes';
import { TestGroup } from '../config/test_data';
import { TestView } from './test_view';
import { timing } from './component_styles';

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

export type Props = {
  state?: App.State;
  group?: TestGroup;
};

@observer
export class TestGroupView extends React.PureComponent<Props> {
  render(): any {
    const { group, state } = this.props;

    if (
      (!state.showFailing && !state.showPassing) ||
      (state.showFailing == false && group.failingTests > 0 && group.passingTests == 0) ||
      (state.showPassing == false && group.passingTests > 0 && group.failingTests == 0)
    ) {
      return false;
    }

    const isList = state.config.storyView === 'list';
    const name = isList ? group.path : group.name;

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
                {name}
              </a>
            </span>
          ) : (
            <span>{name}</span>
          )}

          <div className={timing(group.color)}>{group.duration.toString()}ms</div>
        </Accordion.Title>
        <Accordion.Content active={state.isExpanded(group).get()} className={content}>
          {!isList && group.groups.map((g, i) => <TestGroupView state={state} group={g} key={g.fileName} />)}
          {group.tests.map((t, i) => <TestView state={state} test={t} key={t.name} />)}
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
    const isList = state.config.storyView === 'list';

    return (
      <Accordion className={pane(this.props.state.theme)}>
        {isList ? (
          state.liveRoot.nestedGroupsWithTests.map((g, i) => <TestGroupView state={state} group={g} key={g.fileName} />)
        ) : (
          state.liveRoot.groups.map((g, i) => <TestGroupView state={state} group={g} key={g.fileName} />)
        )}
      </Accordion>
    );
  }
}
