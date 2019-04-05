import * as React from 'react';
import { ITheme } from '../config/themes';
import { css } from './component_styles';

const infoMessage = (theme: ITheme) => css`
  padding: 6px;
  color: ${theme.textColor};
`;

type Props = {
  state: Luis.State;
};

export const InfoMessage: React.FC<Props> = ({ children, state }) => {
  return <div className={infoMessage(state.theme)}>{children}</div>;
};
