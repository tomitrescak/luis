import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { Loader } from '../client/components/loader';

export function load(config: { component: React.ComponentType; [index: string]: any }) {
  const { component, ...proxyConfig } = config;
  return <Loader component={component} proxyConfig={proxyConfig} />;
}

export function render(config: { component: React.ComponentType; [index: string]: any }) {
  return renderer.create(load(config));
}

export async function renderApollo(
  config: { component: React.ComponentType; [index: string]: any },
  waitLoad = true
) {
  const result = renderer.create(load(config));
  if (waitLoad) {
    await wait();
  }
  return result;
}

export function wait() {
  return new Promise(r => setTimeout(r, 0));
}
