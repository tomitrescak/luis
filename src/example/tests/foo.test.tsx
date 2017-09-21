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
        wrapper.should.matchSnapshot('rendered');
      })

      itMountsAnd('genders correctly', () => data.component, (wrapper) => {
        wrapper.should.matchSnapshot('rendered');
      })
    }
  );
  console.log('Loaded FOO');
})
