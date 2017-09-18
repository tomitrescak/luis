import * as React from 'react';
import { Menu } from 'semantic-ui-react';

export class TopPanel extends React.PureComponent {
  state = { activeItem: 'home' }
  
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu pointing secondary inverted color="blue">
        <Menu.Item name="React" active={activeItem === 'home'} onClick={this.handleItemClick} />
        <Menu.Item name="Html" active={activeItem === 'messages'} onClick={this.handleItemClick} />
        <Menu.Item name="Json" active={activeItem === 'friends'} onClick={this.handleItemClick} />
        <Menu.Menu position="right">
          <Menu.Item name="Update Snapshot" active={activeItem === 'logout'} onClick={this.handleItemClick} />
        </Menu.Menu>
      </Menu>
    );
  }
}
