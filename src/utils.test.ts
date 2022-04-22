import {
  bad_proto_request,
  https_env,
  https_request,
  http_env,
  http_request,
} from "./test-fixtures";
import { getProxyEnv } from "./utils";

describe("Test the utility functions", () => {
  afterEach(() => {
    process.env.HTTP_PROXY = "";
    process.env.HTTPS_PROXY = "";
    process.env.NO_PROXY = "";
  });

  test("Test proxy env - https", () => {
    process.env.HTTPS_PROXY = https_env;
    const result = getProxyEnv(https_request);

    expect(result).toEqual(https_env);
  });

  test("Test proxy env - http", () => {
    process.env.HTTP_PROXY = http_env;
    const result = getProxyEnv(http_request);

    expect(result).toEqual(http_env);
  });

  test("Test proxy env - https - no env", () => {
    const result = getProxyEnv(https_request);

    expect(result).toBeNull();
  });

  test("Test proxy env - http - no env", () => {
    const result = getProxyEnv(http_request);

    expect(result).toBeNull();
  });

  test("Test noProxy - no matches", () => {
    process.env.NO_PROXY = "internal.example.com, internal2.example.com";
    process.env.HTTP_PROXY = http_env;

    const result = getProxyEnv(http_request);

    expect(result).toEqual(http_env);
  });

  test("Test noProxy - noProxy match", () => {
    process.env.NO_PROXY = "test.com, internal2.example.com";
    process.env.HTTP_PROXY = http_env;

    const result = getProxyEnv(http_request);

    expect(result).toBeNull();
  });

  test("Test noProxy - noProxy wildcard", () => {
    process.env.NO_PROXY = "*";
    process.env.HTTP_PROXY = http_env;

    const result = getProxyEnv(http_request);

    expect(result).toBeNull();
  });

  test("Test proxy env - bad request protocol", () => {
    const result = getProxyEnv(bad_proto_request);

    expect(result).toBeNull();
  });
});
