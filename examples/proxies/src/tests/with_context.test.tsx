import * as React from 'react';
import * as renderer from 'react-test-renderer';

import * as PropTypes from 'prop-types';

import { load } from 'luis/proxies/loader';

describe('With Context', function() {
  const Component: React.FC = ({}, { theme }) => {
    return (
      <div style={{ backgroundColor: theme.backgroundColor, color: theme.color }}>
        Bar Component 333
      </div>
    );
  };

  // test
  Component.contextTypes = {
    theme: PropTypes.object.isRequired
  };

  const config = {
    component: Component,
    context: {
      theme: {
        backgroundColor: '#f1f1f1',
        color: '#222'
      }
    }
  };

  it('renders', function() {
    // load config will create your component along with all specified proxies
    expect(renderer.create(load(config))).toMatchSnapshot();
  });

  addStory(config);
});
