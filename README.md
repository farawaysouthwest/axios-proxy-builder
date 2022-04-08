# axios-proxy-builder

A simple utility to build an axios proxy request object from env's

## Usage

### Set environmental variables

Set proxy address as well as no proxy whitelist to your environmental variables:

```sh
HTTP_PROXY-http://test.com:8000
http_proxy

HTTPS_PROXY=https://test.com:8000
https_proxy

NO_PROXY=example.test.com,example2.test.com
```

```typescript
import { configureProxy } from "axios-proxy-builder";

const requestURL = "https://request-url.com/resource";
const proxy = configureProxy(requestURL);

// make REST call
axios({ ...proxy, url: requestURL });
```
