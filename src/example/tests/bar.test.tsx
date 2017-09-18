import * as React from 'react';

describe('Component', () => {
  storyOf(
    'Bar View',
    {
      get component() {
        return <div>Component</div>;
      },
      info: 'Foo Info 567'
    },
    data => {
      itMountsAnd('renders correctly', () => data.component, (wrapper) => {
        wrapper.should.matchSnapshot('rendered');
      })

      it('Passes', function() {
        // throw new Error('Failed');
      });
    }
  );
  console.log('Loaded BAR');
});
