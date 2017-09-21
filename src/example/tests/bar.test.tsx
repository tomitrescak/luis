import * as React from 'react';

describe('Component', () => {
  describe('Doo', function() {
    it ('tests', function() {

    });

    storyOf(
      'Bar View',
      {
        get component() {
          return <div>Bar Component 9</div>;
        },
        info: 'Foo Info 567'
      },
      data => {
        itMountsAnd(
          'renders correctly',
          () => data.component,
          wrapper => {
            const t = {
              tomi: '1',
              bobo: '3',
              dodo: '5'
            };
            t.should.deep.equal({
              tomi: '1',
              bobo: '2',
              dodo: '5',
              lolo: 'rer'
            })
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
          throw new Error('Failed');
        });

        it('Passes 9', function() {
          // throw new Error('Failed');
        });
      }
    );
    console.log('Loaded BAR');
  });
});

