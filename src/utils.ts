interface NoProxyZone {
  hostname: string;
  port: string;
  hasPort: boolean;
}

const formatHostName = (hostname: string): string =>
  hostname.replace(/^\.*/, ".").toLowerCase();

const parseNoProxyZone = (zone: string): NoProxyZone => {
  zone = zone.trim();

  const zoneParts: string[] = zone.split(":", 2);
  const zoneHost: string = formatHostName(zoneParts[0]);
  const zonePort: string = zoneParts[1];
  const hasPort: boolean = zone.indexOf(":") > -1;

  return { hostname: zoneHost, port: zonePort, hasPort: hasPort };
};

const urlInNoProxy = (requestURL: URL, noProxy: string): boolean => {
  const port: string =
    requestURL.port || (requestURL.protocol === "https:" ? "443" : "80");
  const hostname: string = formatHostName(requestURL.hostname);
  //testing: internal.example.com,internal2.example.com
  const noProxyList: string[] = noProxy.split(",");

  return noProxyList.map(parseNoProxyZone).some((noProxyZone) => {
    const isMatchedAt = hostname.indexOf(noProxyZone.hostname);
    const hostnameMatched =
      isMatchedAt > -1 &&
      isMatchedAt === hostname.length - noProxyZone.hostname.length;

    if (noProxyZone.hasPort) {
      return port === noProxyZone.port && hostnameMatched;
    }

    return hostnameMatched;
  });
};

export const getProxyEnv = (requestURL: URL): string => {
  const noProxy: string = process.env.NO_PROXY || process.env.no_proxy || "";

  // if the noProxy is a wildcard then return null
  if (noProxy === "*") {
    return null;
  }

  // if the noProxy is not empty and the uri is found, return null
  if (noProxy !== "" && urlInNoProxy(requestURL, noProxy)) {
    return null;
  }

  // get proxy based on request url's protocol
  if (requestURL.protocol == "http:") {
    return process.env.HTTP_PROXY || process.env.http_proxy || null;
  }

  if (requestURL.protocol == "https:") {
    return process.env.HTTPS_PROXY || process.env.https_proxy || null;
  }

  // not a supported protocol...
  return null;
};
