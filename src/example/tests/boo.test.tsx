import * as React from 'react';

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
  constructor() {
    super();
    this.state = { number: 1 };
  }
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
  storyOf(
    'Boo View',
    {
      componentWithData() {
        console.log('Creating state and component ...');
        const state = new State();
        return {
          state,
          component: <Component state={state} />
        };
      }
    },
    data => {
      itMountsAnd(
        'renders correctly',
        () => data.componentWithData(),
        ({ wrapper, state }) => {
          state.number = 9;
          wrapper.should.matchSnapshot('changed to 9');
          //state.number = 10;
          wrapper.find('button').simulate('click');
          // wrapper.find('button').simulate('click');
          state.number = 10;
          wrapper.should.matchSnapshot('changed to 10');

          // //state.number = 7;
          // wrapper.should.matchSnapshot('changed to 7');
        }
      );

      //   itMountsAnd(
      //     'renders chain correctly',
      //     () => data.componentWithData(),
      //     ({wrapper}) => {
      //       wrapper.should.matchSnapshot('initial render');
      //       wrapper.find('button').simulate('click');
      //       wrapper.should.matchSnapshot('change value');
      //       wrapper.find('button').simulate('click');
      //       wrapper.should.matchSnapshot('change again');
      //       wrapper.find('button').simulate('click');
      //     }
      //   );
      // }
    }
  );
});
