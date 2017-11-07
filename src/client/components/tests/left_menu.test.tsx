import * as React from 'react';

import { create } from './test_data';
import { LeftMenu, ComponentProps } from '../left_menu';

describe('Left Pane', function() {
  storyOf(
    'Menu',
    {
      get component() {
        return this.componentWithData().component;
      },
      componentWithData({ state = create.state() }: Partial<ComponentProps> = {}) {
        return {
          state,
          component: <LeftMenu state={state} />
        };
      }
    },
    data => {
      itMountsAnd('renders default', () => data.componentWithData(), function({ wrapper }) {
        wrapper.should.matchSnapshot();
      });

      itMountsAnd(
        'renders with tests',
        () => data.componentWithData({ state: create.state({ liveRoot: create.someTests() }) }),
        function({ wrapper, state }) {
          // state.liveRoot.should.matchSnapshot();
          wrapper.should.matchSnapshot();

          // check interactivity
          wrapper.find('a#listView').click();
          state.config.storyView.should.equal('list');
          wrapper.find('a#listView').click();
          state.config.storyView.should.equal('tree');
          wrapper.find('a#configView').click();
          state.viewState.snapshotView.should.equal('config');
        }
      );
    }
  );
});
