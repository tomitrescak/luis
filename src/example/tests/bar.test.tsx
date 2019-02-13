import * as React from 'react';

debugger;
describe('Component8', () => {
  describe('Doo', function() {
    it('tests', function() {});

    describe('Bar', () => {
      function component() {
        return <div>Bar Component 123</div>;
      }

      it('Fails', function() {
        throw new Error('Failed miserably');
      });

      it('Passes', function() {});

      return {
        component: component()
      };
    });
  });
});
