import * as React from 'react';
import * as Collapse from 'rc-collapse';
import { style } from 'typestyle';
import { link } from 'yester';
import { StoryGroup } from '../louis';

const Panel = Collapse.Panel;

let toName = function (str: string) {
  let result = str.replace(/\:/g, '');
  result = result.replace(/ - /g, '-');
  result = result.replace(/\W/g, '-');
  do {
    result = result.replace(/--/g, '-');
  } while (result.indexOf('--') >= 0);
  return result.toLowerCase();
};

export const menu = style({
  background: '#eee',
  $nest: {
    'ul': {
      listStyleType: 'none',
      padding: '0px',
      margin: '0px!important'
    },
    '.rc-collapse-content': {
      margin: '0px 0px!important',
      padding: '0px 0px 0px 12px!important',
      background: 'inherit!important'
    },
    '.rc-collapse-content-box': {
      margin: '0px 0px!important'
    },
    'a': {
      cursor: 'pointer'
    },
    'li': {
      margin: '3px 0px 6px 20px'
    }
  }
});

export interface Props {
  storyGroup: StoryGroup;
  path: number[];
}

export const StoryGroupView = ({ storyGroup, path }: Props) => {
  if (path) {
    // remove first element
    path.shift();
  }
  return (
    <div>
      {
        storyGroup.storyGroups.length > 0 ? (
          <Collapse accordion={true} defaultActiveKey={path && path.length ? path[0].toString() : undefined}>
            {
              storyGroup.storyGroups.map((g, i) => (
                <Panel key={i} header={g.name} className={menu}>
                  <StoryGroupView storyGroup={g} path={path && path.length && i === path[0] ? path : undefined} />
                </Panel>
              ))
            }
          </Collapse>
        ) : false
      }
      <ul>
        {
          storyGroup.stories.map((s, i) => {
            let currentPath = [storyGroup.parent.storyGroups.indexOf(storyGroup), i];
            let parent = storyGroup.parent;
            let name = toName(storyGroup.name) + '-' + toName(s.name);
            while (parent.parent != null) {
              currentPath.unshift(parent.parent.storyGroups.indexOf(parent));
              name = toName(parent.name) + '-' + name;
              parent = parent.parent;
            }
            const urlPath = currentPath.join('-');
            return (
              <li key={s.name + i}><a href={link(`/${name}/${urlPath}`)}>{s.name}</a></li>
            );
          })
        }
      </ul>
    </div>
  );
};