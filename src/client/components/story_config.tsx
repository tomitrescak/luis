import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Form, Divider, Menu, Icon } from 'semantic-ui-react';

export interface ModalProps {
  state?: App.State;
}

export const StoryConfig = inject<ModalProps>('state')(
  observer(({ state }: ModalProps) =>
    <Modal
      trigger={
        <Menu.Item name="camera">
          <Icon name="options" />
        </Menu.Item>
      }
    >
      <Modal.Header>Select Which Tests Will Run</Modal.Header>
      <Modal.Content>
        <Form>
          {state.testConfig.map((s, i) =>
            <Form.Checkbox
              key={i}
              label={s[0]}
              checked={s[1] == '1'}
              onChange={() => state.toggleStoryTests(s[0], !(s[1] == '1'))}
            />
          )}
          <Divider icon="settings" horizontal />
          <Form.Select
            label="Console Log Level"
            defaultValue={localStorage.getItem('luisLog')}
            options={[
              { value: '0', text: 'None' },
              { value: '1', text: 'All' },
              { value: '2', text: 'ErrorsOnly' }
            ]}
            onChange={(_e, selected) => localStorage.setItem('luisLog', selected.value.toString() )}
          />
          <Form.Select
            label="Theme"
            defaultValue={localStorage.getItem('luisTheme') || 'light'}
            options={[
              { value: 'light', text: 'Light' },
              { value: 'dark', text: 'Dark' }
            ]}
            onChange={(_e, selected) => localStorage.setItem('luisTheme', selected.value.toString() )}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <div style={{ padding: '3px', textAlign: 'right' }}>
          <Button
            color="green"
            content="Select All"
            icon="check"
            onClick={() => state.toggleAllTests(false)}
          />
          <Button
            color="red"
            content="Deselect all"
            icon="remove"
            onClick={() => state.toggleAllTests(true)}
          />
          <Button
            primary
            onClick={() => window.location.reload()}
            icon="file"
            content="Save and Reload"
          />
        </div>
      </Modal.Actions>
    </Modal>
  )
);