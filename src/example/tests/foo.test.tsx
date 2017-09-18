import * as React from 'react';

describe('Component', () => {
  storyOf(
    'Foo',
    {
      get component() {
        return <div>Component</div>;
      },
      info: 'Foo Info 66'
    },
    data => {
      itMountsAnd('renders correctly', () => data.component, (wrapper) => {
        wrapper.should.matchSnapshot('rendered');
      })
    }
  );
  console.log('Loaded FOO');
})
