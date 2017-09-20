import * as React from 'react';

describe('Boo', () => {
  storyOf(
    'Bar View',
    {
      get component() {
        return <div>
          <div>Moo</div>
          <div>Moo</div>
          <div>Moo</div>
          <div>Moo</div>
          <div>Moo29</div>
          <div>Moo</div>
          <div>Moo</div>
          <div>Moo</div>
          <div>Moo</div>
          <div>Moo</div>
        </div>;
      },
      get component2() {
        return <div>
          <div>Moo</div>
        </div>;
      },
      info: 'Foo Info 567'
    },
    data => {
      itMountsAnd('renders correctly', () => data.component, (wrapper) => {
        wrapper.should.matchSnapshot('rendered');
      });

      itMountsAnd('renders two correctly', () => data.component2, (wrapper) => {
        wrapper.should.matchSnapshot('rendered two');
      })
    }
  );
  console.log('Loaded BAR');
});
