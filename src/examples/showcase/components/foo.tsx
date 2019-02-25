import * as React from 'react';
import { Menu } from 'semantic-ui-react';

export const Foo = () => (
  <div>
    <Menu inverted fixed="top" color="red">
      <Menu.Item content="Test" />
    </Menu>
    This is the component version
  </div>
);
