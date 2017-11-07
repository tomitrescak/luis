import * as React from 'react';

import { create } from './test_data';
import { LeftPanel, ComponentProps } from '../left_panel';
import { proxy } from 'proxyrequire';

const LeftPanelStub = proxy(() => require('../left_panel'), {
  './left_menu': {
    LeftMenu: () => <div>[Menu Stub]</div>
  },
  './story_list': {
    StoryList: () => <div>[Story List Stub]</div>
  }
}).LeftPanel;

describe('LeftPanel', function() {
  storyOf(
    'LeftPanel',
    {
      get component() {
        return <LeftPanel state={create.state()} />;
      },
      componentWithData({ state = create.state() }: Partial<ComponentProps> = {}) {
        return {
          component: <LeftPanelStub state={state} />
        }
      }
    },
    data => {
      itMountsAnd('renders empty', () => data.componentWithData(), function({ wrapper }) {
        wrapper.should.matchSnapshot();
      })
    }
  );
});