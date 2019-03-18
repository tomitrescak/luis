import * as React from 'react';
import { Menu } from 'semantic-ui-react';

export const Foo = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <Menu inverted fixed="top" color="red">
        <Menu.Item content="Test" />
        <Menu.Item icon="plus" onClick={() => setCount(count + 1)} />
        <Menu.Item icon="minus" onClick={() => setCount(count - 1)} />
      </Menu>
      <div style={{ paddingTop: '40px' }}>This is the component version ERROR: {count}</div>
    </div>
  );
};
