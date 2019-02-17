import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { observable } from 'mobx';
import { observer } from 'mobx-react';

class State {
  @observable number = 1;
}

type Props = {
  state: State;
};

@observer
class Component extends React.Component<Props, State> {
  state = { number: 1 };

  render() {
    return (
      <div>
        <div>Current mobx number: {this.props.state.number}</div>
        <div>Current state number: {this.state.number}</div>
        <button onClick={() => this.setState({ number: this.state.number + 1 })}>Increase</button>
      </div>
    );
  }
}

describe('Boo', () => {
  describe('Boo View', () => {
    function componentWithData(state: State = new State()) {
      return <Component state={state} />;
    }

    it('renders correctly', () => {
      const state = new State();
      state.number = 9;

      const wrapper = renderer.create(componentWithData(state));
      expect(wrapper).toMatchSnapshot('changed to 9');
      //state.number = 10;
      wrapper.root.findByType('button').props.onClick({});
      // wrapper.find('button').simulate('click');
      state.number = 10;
      expect(wrapper).toMatchSnapshot('changed to 10');
    });
  });
});
