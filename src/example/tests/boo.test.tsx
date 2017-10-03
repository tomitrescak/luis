import * as React from 'react';

import { style } from 'typestyle';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { mount } from 'enzyme';

const s = style({
  color: 'blue'
});

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
    console.log('Rendering ...: ' + this.props.state.number);
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
    'Bar View',
    {
      get state() {
        return new State();
      },
      get component() {
        return <Component state={this.state} />;
      },
      get component2() {
        return (
          <div>
            <div>Moo rrr we weweee wewe</div>
          </div>
        );
      },
      cssClassName: 'm12',
      info: 'Foo Info 567'
    },
    data => {
      itMountsAnd(
        'renders correctly',
        () => data.component,
        wrapper => {
          const state = data.state;
          const m = mount(<Component state={state} />);
          state.number = 9;
          m.find('button').simulate('click');
          m.render();
          console.log(m.html());

          wrapper.should.matchSnapshot('rendered');
          wrapper.prop<State>('state').number = 7;
          console.log(wrapper.html());
          // wrapper.update();
          wrapper.should.matchSnapshot('mobx fired back');
        }
      );

      itMountsAnd(
        'renders two correctly',
        () => data.component2,
        wrapper => {
          wrapper.should.matchSnapshot('rendered two');
        }
      );
    }
  );
  console.log('Loaded BAR');
});
