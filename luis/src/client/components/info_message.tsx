import * as React from 'react';
import { getState } from '../models/state_model';
import { ITheme } from '../config/themes';
import { css } from './component_styles';

const infoMessage = (theme: ITheme) => css`
  padding: 6px;
  color: ${theme.textColor};
`;

export const InfoMessage: React.FC = ({ children }) => {
  let state = getState();

  return <div className={infoMessage(state.theme)}>{children}</div>;
};
