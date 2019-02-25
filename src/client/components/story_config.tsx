import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Form, Divider, Header } from 'semantic-ui-react';
import { css } from './component_styles';
import { ITheme } from '../config/themes';

export interface ModalProps {
  state?: Luis.State;
}

const configStyle = (theme: ITheme) => css`
  padding: 12px;
  label {
    color: ${theme.textColor};
  }
  .header {
    color: ${theme.textColor};
  }
`;

export const StoryConfig = inject('state')(
  observer(({ state }: ModalProps) => (
    <div className={configStyle(state.theme)}>
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
        <Form.TextArea
          label="Wrapper Style"
          value={state.config.wrapperStyle}
          onChange={(_e, value) => (state.config.wrapperStyle = value.value as string)}
        />
        <Form.TextArea
          label="Full Screen Style"
          value={state.config.fullscreenStyle}
          onChange={(_e, value) => (state.config.fullscreenStyle = value.value as string)}
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
