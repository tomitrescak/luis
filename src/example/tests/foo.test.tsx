import * as React from 'react';
import { Foo } from '../components/foo';

describe('Component', () => {
  storyOf(
    'Foo',
    {
      get component() {
        return <Foo />;
      },
      info: 'Foo Info 66'
    },
    data => {
      itMountsAnd('renders correctly', () => data.component, (wrapper) => {
        wrapper.should.matchSnapshot('rendered once');
        wrapper.should.matchSnapshot('rendered again');
        wrapper.should.matchSnapshot('rendered and again');
      })

      itMountsAnd('regenders correctly', () => data.component, (wrapper) => {
        wrapper.should.matchSnapshot('rendered twice');
      })
    }
  );
  console.log('Loaded FOO');
})
