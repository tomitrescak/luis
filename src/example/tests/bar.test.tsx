import * as React from 'react';

describe('Component', () => {
  describe('Doo', function() {
    storyOf(
      'Bar View',
      {
        get component() {
          return <div>Bar Component 6</div>;
        },
        info: 'Foo Info 567'
      },
      data => {
        itMountsAnd(
          'renders correctly',
          () => data.component,
          wrapper => {
            'tomas'.should.equal('Momo');
            wrapper.should.matchSnapshot('rendered');
          }
        );

        itMountsAnd(
          'renders 2 correctly',
          () => data.component,
          wrapper => {
            wrapper.should.matchSnapshot('rendered 6');
          }
        );

        it('Passes', function() {
          // throw new Error('Failed');
        });

        it('Passes 9', function() {
          // throw new Error('Failed');
        });
      }
    );
    console.log('Loaded BAR');
  });
});

