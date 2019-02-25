import * as React from 'react';
import * as renderer from 'react-test-renderer';

import * as PropTypes from 'prop-types';
import { load } from '../../../proxies/loader';

describe('Component', () => {
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

    it('fails', function() {
      throw new Error('Failed miserably');
    });

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
      expect(renderer.create(load(config))).toMatchSnapshot();
    });

    return config;
  });
});
