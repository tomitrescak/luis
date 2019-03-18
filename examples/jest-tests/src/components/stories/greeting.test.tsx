import * as React from 'react';

import { create } from 'react-test-renderer';

import { Greeting } from '../greeting';

describe('Greeting', () => {
  const Component = () => <Greeting name="Tomas" />;

  it('renders correctly', () => {
    expect(create(<Component />)).toMatchSnapshot();
  });

  it('fails', () => {
    expect('123').toEqual('456');
  });

  addStory({
    component: Component
  });
});
