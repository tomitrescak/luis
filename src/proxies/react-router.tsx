// Shamefully taken from Cosmos and adapted to our needs:
// https://github.com/react-cosmos/react-cosmos

import React from 'react';
import { MemoryRouter, Route } from 'react-router';
import LocationInterceptor from './helpers/location_interceptor';
import urlParser from 'url';
import { ProxyProps } from './helpers/proxy_types';

export function createRouterProxy() {
  const RouterProxy = (props: ProxyProps) => {
    const { nextProxy, onFixtureUpdate } = props;
    const { value: NextProxy, next } = nextProxy as any;
    const { route, url, locationState, provideRouterProps } = props.proxyConfig;
    const nextProxyEl = <NextProxy {...props} nextProxy={next()} />;

    if (locationState && !url) {
      throw new Error('Must provide a url in fixture to use locationState');
    }

    if (!url) {
      return nextProxyEl;
    }

    const handleUrlChange = (url: string) => {
      onFixtureUpdate({ url });
    };

    const handleLocationStateChange = (locationState: any) => {
      onFixtureUpdate({ locationState });
    };

    const location = buildLocation(url, locationState);

    return (
      // keyLength=0 generates empty "" history keys, leading to deterministic
      // test snapshots https://github.com/react-cosmos/react-cosmos/pull/803
      <MemoryRouter keyLength={0} initialEntries={[location]}>
        <LocationInterceptor
          onUrlChange={handleUrlChange}
          onLocationStateChange={handleLocationStateChange}
        >
          {route ? (
            <Route
              path={route}
              render={(routerProps: any) => {
                if (provideRouterProps) {
                  const newProxyProps = {
                    ...props,
                    fixture: {
                      ...props.fixture,
                      props: { ...(props.fixture as any).props, ...routerProps }
                    }
                  };

                  return <NextProxy {...newProxyProps} nextProxy={next()} />;
                }

                return nextProxyEl;
              }}
            />
          ) : (
            nextProxyEl
          )}
        </LocationInterceptor>
      </MemoryRouter>
    );
  };

  return RouterProxy;
}

function buildLocation(url: string, locationState: any) {
  const { pathname, search, hash } = urlParser.parse(url);

  return {
    pathname,
    search,
    hash,
    key: 'mocked',
    state: locationState
  };
}
