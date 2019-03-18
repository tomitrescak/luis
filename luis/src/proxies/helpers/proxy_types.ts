import { ComponentType } from 'react';

type LinkedItem<Item> = {
  value: Item;
  next: () => LinkedItem<Item>;
};

export type ProxyProps = {
  proxyConfig: any;
  nextProxy: LinkedItem<ComponentType<ProxyProps>>;
  fixture: React.ComponentType;
  onComponentRef: Function;
  onFixtureUpdate: Function;
};

// $Subtype allows us to type proxy components that have additional props with
// the Proxy type.
export type Proxy = ComponentType<Partial<ProxyProps>>;
