import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { Foo } from '../components/foo';

describe('Component', () => {
  describe('Foo', () => {
    function component() {
      return <Foo />;
    }

    it('renders correctly', () => {
      const wrapper = renderer.create(component());
      expect(wrapper).toMatchSnapshot('rendered');
    });

    it('shows difference', function() {
      expect('Actual Value').toEqual('Expected Value');
    });

    it('shows multiline difference', function() {
      expect({
        tomi: '1',
        bobo: '3',
        dodo: '5'
      }).toEqual({
        tomi: '1',
        bobo: '2',
        dodo: '5',
        lolo: 'rer'
      });
    });

    return { component };
  });
});
