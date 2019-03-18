import * as React from 'react';
import { observer } from 'mobx-react';
import { Accordion, Icon } from 'semantic-ui-react';

import { TestView } from './test_view';
import { timing, css } from './component_styles';
import { TestGroup } from '../models/test_group_model';
import { ITheme } from '../config/themes';

const accordion = (theme: ITheme) => css`
  .title {
    padding: 3px !important;
  }

  overflow-y: auto;
  padding-left: 20px;
  position: absolute;
  width: 100%;
  top: 42px;
  bottom: 0px;
  padding-bottom: 6px;
  background-color: ${theme.sideBarColor};
  color: ${theme.textColor};
`;

const content = css`
  /* name:accordion-content*/
  padding-left: 12px !important;
  padding-top: 0px !important;
`;

const long = `
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 1 100%;
  min-width: 60px;
`;

const bump = (bump: boolean) => css`
  margin-left: ${bump ? '-22px' : undefined};
  display: flex;

  i {
    flex: 1 auto !important;
    min-width: 15px;
  }
  span {
    ${long}
  }
  a {
    ${long}
  }
  div {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

const bumpTitleSmall = css`
  margin-left: 5px;
`;

export type Props = {
  state: Luis.State;
  group?: TestGroup;
};

@observer
export class TestGroupView extends React.Component<Props> {
  static displayName = 'TestGroup';

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
          className={group.groups.length || group.tests.length ? bump(true) : bump(false)}
          onClick={e => state.toggleExpanded(e, group)}
        >
          {group.groups.length || group.tests.length ? (
            <Icon name="dropdown" className={bumpTitleSmall} />
          ) : (
            false
          )}
          {group.component ? (
            <span>
              <a
                href={`?stories=${group.id}`}
                onClick={e => state.viewState.openStoryFromList(e, group.id)}
              >
                {name}
              </a>
            </span>
          ) : (
            <span>{name}</span>
          )}

          <div className={timing(group.color)}>
            {group.duration.toString()}
            ms
          </div>
        </Accordion.Title>
        <Accordion.Content active={state.isExpanded(group).get()} className={content}>
          {!isList &&
            group.groups.map(g => <TestGroupView state={state} group={g} key={g.fileName} />)}
          {group.tests.map(t => (
            <TestView state={state} test={t} key={t.name} />
          ))}
        </Accordion.Content>
      </div>
    );
  }
}

// {this.props.state.liveRoot.groups.map((g, i) => <TestGroupView key={i} group={g} />)}

export const StoryList = observer(({ state }: Props) => {
  const isList = state.config.storyView === 'list';
  let version = state.liveRoot.version;
  if (state.liveRoot.groups.length === 0) {
    return <div>There are no tests</div>;
  }
  return (
    <Accordion className={accordion(state.theme)} inverted={state.theme.isDark}>
      {isList
        ? state.liveRoot.nestedGroupsWithTests.map(g => (
            <TestGroupView state={state} group={g} key={g.fileName + version} />
          ))
        : state.liveRoot.groups.map(g => (
            <TestGroupView state={state} group={g} key={g.fileName + version} />
          ))}
    </Accordion>
  );
});
