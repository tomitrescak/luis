import * as React from 'react';

describe('Component', () => {
  describe('Doo', function() {
    it ('tests', function() {

    });

    storyOf(
      'Bar',
      {
        get component() {
          return <div>Bar Component</div>;
        },
        info: 'Bar'
      },
      data => {
        itMountsAnd(
          'renders correctly',
          () => data.component,
          wrapper => {
            wrapper.should.matchSnapshot('rendered');
          }
        );

        it('Fails', function() {
          throw new Error('Failed miserably');
        });

        it('Passes', function() {
        });
      }
    );
    console.log('Loaded BAR');
  });
});

