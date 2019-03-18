import * as React from 'react';
import { css } from '@tomino/toolbelt';

type Props = { state: Luis.State; content?: string };

const frameBack = css`
  height: 100%;
  width: 100%;
`;

export const ThemedWrapper: React.FC<Props> = ({ state, content, children }) => {
  if (state.viewState.fullScreen) {
    return (
      <div
        className={css`
          ${state.config.fullscreenStyle}
        `}
      >
        {children}
      </div>
    );
  }
  const className =
    frameBack + ' ' + state.config.wrapperStyle
      ? css`
          /* name:wrapper */
          ${state.config.wrapperStyle}

          ::after {
            content: '';
            display: table;
            clear: both;
          }
        `
      : '';

  if (content) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return <div className={className}>{children}</div>;
};

ThemedWrapper.displayName = 'ThemedWrapper';
