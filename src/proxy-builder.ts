import { getProxyEnv } from "./utils";

export interface RequestProxy {
  proxy: {
    protocol: string;
    hostname: string;
    port: number;
    auth: {
      username: string;
      password: string;
    };
  };
}

export const configureProxy = (requestURL: string): RequestProxy => {
  const url: URL = new URL(requestURL);
  const env: string = getProxyEnv(url);

  // short circuit if null
  if (!env) return null;

  // parse proxy url
  const { hostname, port, protocol, username, password } = new URL(env);

  // return proxy object for axios request
  return {
    proxy: {
      protocol,
      hostname,
      port: parseInt(port),
      auth: {
        username,
        password,
      },
    },
  };
};
