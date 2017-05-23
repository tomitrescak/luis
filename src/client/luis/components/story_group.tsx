import * as React from 'react';
import * as Collapse from 'rc-collapse';
import { style } from 'typestyle';
import { StoryType } from '../state/story';
import { StateType, Folder } from '../state/state';
import { inject } from 'mobx-react';

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
  folder: Folder;
  path: number[];
  state?: StateType;
}

export const StoryGroupView = inject('state')(({ folder, path, state }: Props): JSX.Element => {
  if (path) {
    // remove first element
    path.shift();
  }
  return (
    <div>
      {
        folder.folders.length > 0 ? (
          <Collapse accordion={true} defaultActiveKey={path && path.length ? path[0].toString() : undefined}>
            {
              folder.folders.map((g, i) => (
                <Panel key={i} header={g.name} className={menu}>
                  <StoryGroupView folder={g} path={path && path.length && i === path[0] ? path : undefined} />
                </Panel>
              ))
            }
          </Collapse>
        ) : false
      }
      <ul>
        {
          folder.stories.map((s: StoryType, i: number) => {
            let currentPath = [folder.parent.folders.indexOf(folder), i];
            let parent = folder.parent;
            let name = toName(folder.name) + '-' + toName(s.name);
            while (parent.parent != null) {
              currentPath.unshift(parent.parent.folders.indexOf(parent));
              name = toName(parent.name) + '-' + name;
              parent = parent.parent;
            }
            const urlPath = currentPath.join('-');
            return (
              <li key={s.name + i}>
                <a 
                  href={`/${name}/${urlPath}`} 
                  onClick={(e) => {
                    e.preventDefault();
                    state.view.openStory(name, urlPath);
                    return false;
                  }}
                >{s.name}
                </a>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
});