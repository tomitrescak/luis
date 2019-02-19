// Shamefully taken from Cosmos and adapted to our needs:
// https://github.com/react-cosmos/react-cosmos

import * as React from 'react';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import { createFixtureLink } from './helpers/fixture_link';
import { ProxyProps } from './helpers/proxy_types';

const defaults = {
  fixtureKey: 'apollo'
};

type ApolloOptions = {
  endpoint?: string;
  clientOptions?: any;
};

export function createApolloProxy(options: ApolloOptions) {
  const { endpoint, clientOptions } = {
    ...defaults,
    ...options
  };

  class ApolloProxy extends React.Component<ProxyProps> {
    client: ApolloClient<any>;

    constructor(props: ProxyProps) {
      super(props);

      if (!endpoint && !clientOptions) {
        throw new Error(
          `
It looks like the Apollo Proxy is not configured!
Give it:
- a GraphQL endpoint to send GraphQL operations to;
- a Apollo Client configuration object (maybe the one you use in your app?);
Read more at: https://github.com/react-cosmos/react-cosmos#react-apollo-graphql.`
        );
      }

      const apolloFixture = this.props.proxyConfig.apollo || {};
      const mockKeys = ['resolveWith', 'failWith'];

      const fixtureApolloKeys = flatObjectKeys(mockKeys, apolloFixture);

      const isMockedFixture = Boolean(mockKeys.find(key => fixtureApolloKeys.includes(key)));

      let options = clientOptions || {
        cache: new InMemoryCache()
      };

      if (isMockedFixture) {
        const fixtureCache = new InMemoryCache(options.cache.config);

        options = {
          ...options,
          // ensure that the cache is not persisted between mocked fixtures
          cache: fixtureCache,
          link: createFixtureLink({
            apolloFixture,
            cache: fixtureCache,
            fixture: this.props.fixture
          })
        };
      } else {
        options = {
          ...options,

          link: new HttpLink({ uri: endpoint })
        };
      }

      this.client = new ApolloClient(options);

      // enable the Apollo Client DevTools to recognize the Apollo Client instance
      if (typeof window !== 'undefined') {
        (window as any).__APOLLO_CLIENT__ = this.client;
      }
    }

    render() {
      const { value: NextProxy, next } = this.props.nextProxy;

      return (
        <ApolloProvider client={this.client}>
          <NextProxy {...this.props} nextProxy={next()} />
        </ApolloProvider>
      );
    }
  }

  return {
    proxy: ApolloProxy as any,
    key: 'apollo'
  };
}

// Utility to find mock keys inside a fixture
function flatObjectKeys(keys: string[], object: any, digNestedObjects = true): string[] {
  return Object.keys(object).reduce((list, key) => {
    const value = object[key];
    if (!keys.includes(key) && typeof value === 'object' && digNestedObjects) {
      // only "dig" one level deep
      return [...list, ...flatObjectKeys(keys, value, false)];
    }

    return [...list, key];
  }, []);
}
