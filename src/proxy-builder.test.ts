import { configureProxy, RequestProxy } from "./proxy-builder";
import { https_env, http_env } from "./test-fixtures";

describe("Test configureProxy", () => {
  afterEach(() => {
    process.env.HTTP_PROXY = "";
    process.env.HTTPS_PROXY = "";
    process.env.NO_PROXY = "";
  });

  test("with https env in proxy", () => {
    process.env.HTTPS_PROXY = https_env;
    const result = configureProxy("https://test.com:8000");

    expect(result).toEqual({
      proxy: {
        hostname: "testproxy.com",
        port: 8000,
        protocol: "https:",
        auth: {
          username: "",
          password: "",
        },
      },
    } as RequestProxy);
  });

  test("with http env in proxy", () => {
    process.env.HTTP_PROXY = http_env;
    const result = configureProxy("https://test.com:8000");

    expect(result.proxy).toEqual(false);
    expect(!!result.httpsAgent).toEqual(true);
  });

  test("with no env", () => {
    const result = configureProxy("https://test.com:8000");

    expect(result).toEqual(null);
  });
});