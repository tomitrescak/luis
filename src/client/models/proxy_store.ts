export type ProxyConfig = {
  proxy: React.ComponentType;
  key: string;
};

export const ProxyStore = {
  _proxies: null as ProxyConfig[],

  init(proxies: ProxyConfig[]) {
    this._proxies = proxies;
  },

  findProxies(proxyConfig: any) {
    if (!this._proxies) {
      throw new Error('Please initialise proxy store by calling "init(proxies)" method!');
    }
    let keys = Object.getOwnPropertyNames(proxyConfig);
    return this._proxies.filter(p => keys.includes(p.key)).map(p => p.proxy);
  }
};
