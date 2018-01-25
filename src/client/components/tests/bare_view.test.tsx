import * as React from 'react';

import { create } from './test_data';
import { BareView, ComponentProps } from '../bare_view';


describe('BareView', function() {
  storyOf(
    'BareView',
    {
      get component() {
        return this.componentWithData().component;
      },
      componentWithData({ state = create.stateWithTests()}: Partial<ComponentProps> = {}) {
        return {
          component: <BareView state={state} />
        }
      }
    },
    data => {
      itMountsAnd('renders correctly', () => data.componentWithData(), function({ wrapper }) {
        wrapper.should.matchSnapshot();
      })
    }
  );
});