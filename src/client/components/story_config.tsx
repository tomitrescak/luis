import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Form, Divider, Menu, Icon, Header } from 'semantic-ui-react';

export interface ModalProps {
  state?: Luis.State;
}

export const StoryConfig = inject<ModalProps>('state')(
  observer(({ state }: ModalProps) => (
    <div style={{ padding: '12px'}}>
      <Header icon="cogs" content="Options" dividing />
      <Form>
        {state.config.tests.map((s, i) => (
          <Form.Checkbox
            key={i}
            label={s.name}
            checked={!s.disabled}
            onChange={() => (s.disabled = !s.disabled)}
          />
        ))}
        <Divider icon="settings" horizontal />
        <Form.Select
          label="Console Log Level"
          value={state.config.logLevel}
          options={[
            { value: '0', text: 'None' },
            { value: '1', text: 'All' },
            { value: '2', text: 'ErrorsOnly' }
          ]}
          onChange={(_e, selected) => (state.config.logLevel = selected.value.toString())}
        />
        <Form.Select
          label="Theme"
          value={state.config.theme}
          options={[{ value: 'light', text: 'Light' }, { value: 'dark', text: 'Dark' }]}
          onChange={(_e, selected) => (state.config.theme = selected.value.toString())}
        />
        <Form.Checkbox
          label="Reverse snapshot list"
          checked={state.config.reverseList}
          onChange={() => (state.config.reverseList = !state.config.reverseList)}
        />
      </Form>

      <div style={{ padding: '3px', marginTop: '12px', textAlign: 'right' }}>
        <Button
          color="green"
          content="Select All"
          icon="check"
          onClick={() => state.config.toggleAllTests(false)}
        />
        <Button
          color="red"
          content="Deselect all"
          icon="remove"
          onClick={() => state.config.toggleAllTests(true)}
        />
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
    </div>
  ))
);
