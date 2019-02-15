import * as React from 'react';
import * as renderer from 'react-test-renderer';

describe('Component', () => {
  describe('Doo', function() {
    it('tests', function() {});

    describe('Bar', () => {
      function component() {
        return <div>Bar Component 567</div>;
      }

      it('fails', function() {
        throw new Error('Failed miserably');
      });

      it('renders', function() {
        expect(renderer.create(component())).toMatchSnapshot();
      });

      it('renders1 with really long name there it is', function() {
        expect(renderer.create(component())).toMatchSnapshot();
      });

      return {
        component: component()
      };
    });
  });
});
