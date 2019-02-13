import * as React from 'react';

console.log('Loading ...');
describe('Component', () => {
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
