// Shamefully taken from Cosmos and adapted to our needs:
// https://github.com/react-cosmos/react-cosmos/blob/master/packages/react-cosmos-context-proxy/src/index.js

// @flow

import * as React from 'react';
import { ProxyProps } from './helpers/proxy_types';

type Options = {
  childContextTypes: {
    [index: string]: any; // React doesn't really expose types for prop-types
  };
};

export function createContextProxy({ childContextTypes }: Options) {
  class ContextProxy extends React.Component<ProxyProps> {
    static childContextTypes = childContextTypes;

    getChildContext() {
      return this.props.proxyConfig && this.props.proxyConfig.context
        ? this.props.proxyConfig.context
        : {};
    }

    render() {
      const { nextProxy, ...rest } = this.props;
      const { value: NextProxy, next } = nextProxy;

      return <NextProxy {...rest} nextProxy={next()} />;
    }
  }

  return {
    proxy: ContextProxy as any,
    key: 'context'
  };
}
