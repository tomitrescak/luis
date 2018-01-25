import * as React from 'react';

import { create } from './test_data';
import { StoryList, ComponentProps } from '../story_list';

const stateWithTests = { state: create.state({ liveRoot: create.someTests() }) };

describe('Left Pane', function() {
  storyOf(
    'Story List',
    {
      get component() {
        return this.componentWithData(stateWithTests).component;
      },
      componentWithData({ state = create.state()}: Partial<ComponentProps> = {}) {
        return {
          component: <StoryList state={state} />
        }
      }
    },
    data => {
      itMountsAnd('renders empty', () => data.componentWithData(), function({ wrapper }) {
        wrapper.should.matchSnapshot();
      });

      itMountsAnd('renders with tests', () => data.componentWithData(stateWithTests), function({ wrapper }) {
        wrapper.should.matchSnapshot();

        wrapper.find('div.title').at(0).click();
        wrapper.should.matchSnapshot('expanded first row');

        wrapper.find('div.title').at(4).click();
        wrapper.should.matchSnapshot('expanded test error');

        wrapper.find('div.title').at(4).click();
        wrapper.find('div.title').at(1).click(); 
        wrapper.find('div.title').at(2).click();
        wrapper.should.matchSnapshot('expanded compare error');

        wrapper.find('div.title').at(0).click();
        wrapper.find('div.title').at(5).click();
        wrapper.should.matchSnapshot('shows snapshots');
      });
    }
  );
});