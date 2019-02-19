import * as PropTypes from 'prop-types';

import { createContextProxy } from '../proxies/context';
import { createApolloProxy } from '../proxies/apollo';
import { ProxyStore } from '../client/models/proxy_store';

export const ContextProxy = createContextProxy({
  childContextTypes: {
    theme: PropTypes.object
  }
});

export const ApolloProxy = createApolloProxy({
  endpoint: 'https://my.api.xyz/graphql'
});

ProxyStore.init([ApolloProxy, ContextProxy]);
