import { getProxyEnv } from "./utils";
import { httpsOverHttp } from "tunnel";
import { Agent } from "http";

export interface RequestProxy {
  proxy:
    | {
        protocol: string;
        hostname: string;
        port: number;
        auth: {
          username: string;
          password: string;
        };
      }
    | boolean;
  httpsAgent?: Agent;
}

export const configureProxy = (requestURL: string): RequestProxy => {
  const requestURLObject: URL = new URL(requestURL);
  const proxyUrl: string = getProxyEnv(requestURLObject);

  // short circuit if null
  if (!proxyUrl) return null;

  // parse proxy url
  const { hostname, port, protocol, username, password } = new URL(proxyUrl);

  // axios proxy implementation for https over http doesn't work. hence, this implementation
  if (requestURLObject.protocol === "https:" && protocol === "http:") {
    const agent = httpsOverHttp({
      proxy: {
        host: hostname,
        port: parseInt(port),
      },
    });

    return {
      proxy: false,
      httpsAgent: agent,
    };
  }

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
