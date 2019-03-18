import * as React from 'react';

import { create } from 'react-test-renderer';

import { Greeting } from '../greeting';

// WARNING: Typescript crap
// this can be removed (it was creating problems for us when using types from Jest and Chai side by side)
import { expect } from 'chai';
// you have to import this at least once in your tests to pass the compilation
// this will register the global 'addStory' method
// in javascript you do not have to care about this
import 'luis/types';
// END WARNING

describe('Greeting', () => {
  const Component = () => <Greeting name="Tomas" />;

  it('renders correctly', () => {
    expect(create(<Component />)).to.matchSnapshot();
  });

  it('fails', () => {
    expect('123').to.equal('456');
  });

  it('fails multiline', () => {
    expect({
      a: 1,
      b: 2,
      c: 3
    }).to.equal({
      a: 1,
      b: 3,
      d: 4,
      c: 3,
      e: 6
    });
  });

  it('fails message', () => {
    expect(123).to.be.greaterThan(456);
  });

  addStory({
    component: Component
  });
});
