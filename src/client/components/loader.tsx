import * as React from 'react';

import { ProxyStore } from '../models/proxy_store';

type Props = {
  component: React.ComponentType;
  proxyConfig: any;
};

export class Loader extends React.Component<Props> {
  // componentWillReceiveProps({ proxies, component }: Props) {
  //   if (this.props.component !== component || proxies !== this.props.proxies) {
  //     this.firstProxy = createProxyLinkedList([...proxies, this.props.component]);
  //   }
  // }

  render() {
    // const { firstProxy } = this;
    const { component, proxyConfig } = this.props;
    const proxies = ProxyStore.findProxies(proxyConfig);

    const firstProxy: any = createProxyLinkedList([...proxies, this.props.component]);

    return (
      <firstProxy.value
        proxyConfig={proxyConfig}
        nextProxy={firstProxy.next()}
        fixture={component}
        onComponentRef={noOp}
        onFixtureUpdate={noOp}
      />
    );
  }
}

type LinkedItem<Item> = {
  value: Item;
  next: () => LinkedItem<Item>;
};

function createProxyLinkedList<T>(items: T[]) {
  function advanceList(toIndex: number): LinkedItem<T> {
    return {
      value: items[toIndex],
      next: function getNextItem(nextIndex: number): LinkedItem<T> {
        return advanceList(nextIndex);
      }.bind(null, toIndex + 1)
    };
  }

  return advanceList(0);
}

function noOp() {}
