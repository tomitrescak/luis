import * as React from 'react';

import { create } from './test_data';
import { Layout, ComponentProps } from '../layout';

import { proxy } from 'proxyrequire';


// create stub

const LayoutStubbed: typeof Layout = proxy(() => require('../layout'), {
  './left_panel': {
    LeftPanel: () => <div>[Left&nbsp;Panel]</div>
  },
  './right_panel': {
    RightPanel: () => <div>[Right&nbsp;Panel]</div>
  }
}).Layout;

// describe story

    storyOf(
      'Layout',
      {
        get component() {
          return this.componentWithData().component;
        },
        componentWithData({}: Partial<ComponentProps> = {}) {
          return {
            component: <LayoutStubbed state={create.state} />
          }
        }
      },
      data => {
        itMountsAnd('renders correctly', () => data.componentWithData(), function({ wrapper }) {
          wrapper.should.matchSnapshot();
        })
      }
    );