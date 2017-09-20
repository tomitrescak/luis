import * as React from 'react';

let index = 1;

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
          <div>Moo1</div>
          <div>Moo</div>
          <div>Moo</div>
          <div>Moo</div>
          <div>Moo</div>
          <div>Moo</div>
        </div>;
      },
      info: 'Foo Info 567'
    },
    data => {
      itMountsAnd('renders correctly', () => data.component, (wrapper) => {
        wrapper.should.matchSnapshot('rendered');
      })
    }
  );
  console.log('Loaded BAR');
});
