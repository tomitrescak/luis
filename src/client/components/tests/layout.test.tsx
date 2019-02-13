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
  },
  './bare_view': {
    BareView: () => <div>[Bare&nbsp;View]</div>
  }
}).Layout;

// describe story

describe('Layout', () => {
  function componentWithData({ state = create.state() }: Partial<ComponentProps> = {}) {
    const localStorageStub = {
      getItem() {
        return '150px';
      }
    } as any;
    return {
      localStorageStub,
      component: <LayoutStubbed state={state} localStorage={localStorageStub} />
    };
  }

  // itMountsAnd('renders standard view', () => componentWithData(), function({ wrapper }) {
  //   wrapper.should.matchSnapshot();
  // });

  // itMountsAnd(
  //   'renders bare view',
  //   () => data.componentWithData({ state: create.state(null, { bare: true }) }),
  //   function({ wrapper }) {
  //     wrapper.should.matchSnapshot();
  //   }
  // );

  return {
    componentWithData
  };
});
