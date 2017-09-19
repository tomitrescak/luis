import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Form, Divider, Menu, Icon } from 'semantic-ui-react';

export interface ModalProps {
  state?: App.State;
}

export const StoryConfig = inject<ModalProps>('state')(
  observer(({ state }: ModalProps) => (
    <Modal
      trigger={
        <Menu.Item name="camera">
          <Icon name="cogs" />
        </Menu.Item>
      }
    >
      <Modal.Header>Select Which Tests Will Run</Modal.Header>
      <Modal.Content>
        <Form>
          {state.config.tests.map((s, i) => (
            <Form.Checkbox key={i} label={s.name} checked={!s.disabled} onChange={() => (s.disabled = !s.disabled)} />
          ))}
          <Divider icon="settings" horizontal />
          <Form.Select
            label="Console Log Level"
            value={state.config.logLevel}
            options={[{ value: '0', text: 'None' }, { value: '1', text: 'All' }, { value: '2', text: 'ErrorsOnly' }]}
            onChange={(_e, selected) => (state.config.logLevel = selected.value.toString())}
          />
          <Form.Select
            label="Theme"
            value={state.config.theme}
            options={[{ value: 'light', text: 'Light' }, { value: 'dark', text: 'Dark' }]}
            onChange={(_e, selected) => (state.config.theme = selected.value.toString())}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <div style={{ padding: '3px', textAlign: 'right' }}>
          <Button color="green" content="Select All" icon="check" onClick={() => state.config.toggleAllTests(false)} />
          <Button color="red" content="Deselect all" icon="remove" onClick={() => state.config.toggleAllTests(true)} />
          <Button
            primary
            onClick={() => {
              state.config.saveConfig();
              window.location.reload();
            }}
            icon="file"
            content="Save and Reload"
          />
        </div>
      </Modal.Actions>
    </Modal>
  ))
);
