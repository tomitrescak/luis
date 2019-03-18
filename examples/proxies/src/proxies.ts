import * as PropTypes from 'prop-types';

import { createContextProxy } from 'luis/proxies/context';
import { createApolloProxy } from 'luis/proxies/apollo';
import { ProxyStore } from 'luis/client/models/proxy_store';

export const ContextProxy = createContextProxy({
  childContextTypes: {
    theme: PropTypes.object
  }
});

export const ApolloProxy = createApolloProxy({
  endpoint: 'https://my.api.xyz/graphql'
});

ProxyStore.init([ApolloProxy, ContextProxy]);
