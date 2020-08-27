/* eslint-disable @typescript-eslint/no-unused-vars */

import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import * as t from "io-ts";
import { Request } from "../src";
import {
  makeRequest,
  getRequest,
  postRequest,
  // postRequest,
} from "../src/common/api/request";
import { taskFail, Hello, HelloType, taskOf, getMockAdapter } from "./util";

const mock = getMockAdapter();

beforeEach(() => {
  mock.reset();
});

describe("create single header", () => {
  test("it creates empty header if value undefined", () => {
    expect(Request.makeHeader("foo", undefined)).toMatchObject({});
  });

  test("it creates header with name and plain value", () => {
    expect(Request.makeHeader("foo", "bar")).toMatchObject({ foo: "bar" });
  });

  test("it creates header with name and complex value", () => {
    expect(Request.makeHeader("foo", { bar: "baz" })).toMatchObject({
      foo: { bar: "baz" },
    });
  });
});

describe("create headers object", () => {
  test("it appends header to empty collection", () => {
    expect(Request.addHeader<string>("foo", "bar")({})).toMatchObject({
      foo: "bar",
    });
  });

  test("it appends header to empty existing collection", () => {
    expect(
      Request.addHeader<string>("foo", "bar")({ baz: "pax" }),
    ).toMatchObject({ foo: "bar", baz: "pax" });
  });
});

describe("make url", () => {
  test("it returns default url if no settings", () => {
    expect(Request.makeUrl()).toBe(
      "https://srv-geom-mc2.metalcamuna.it:8443/api/v1",
    );
  });

  test("it returns url default without version", () => {
    expect(Request.makeUrl({ noVersion: true })).toBe(
      "https://srv-geom-mc2.metalcamuna.it:8443",
    );
  });

  test("it forces http", () => {
    expect(Request.makeUrl({ useHttp: true })).toBe(
      "http://srv-geom-mc2.metalcamuna.it:8443/api/v1",
    );
  });

  test("it returns given url", () => {
    expect(Request.makeUrl({ url: "ftp://www.foobar.baz" })).toBe(
      "ftp://www.foobar.baz",
    );
  });

  test("it returns assembled url with given base", () => {
    expect(Request.makeUrl({ url: "www.foobar.baz", useHttp: true })).toBe(
      "http://www.foobar.baz/api/v1",
    );
  });

  test("it returns a websocket url", () => {
    expect(
      Request.makeUrl({ url: "www.foobar.baz", useHttp: true }, true),
    ).toBe("ws://www.foobar.baz/api/v1");
  });

  test("it returns a secure websocket url", () => {
    expect(Request.makeUrl({ url: "www.foobar.baz" }, true)).toBe(
      "wss://www.foobar.baz/api/v1",
    );
  });
});

describe("make signal", () => {
  test("it creates a signal with timeout", async () => {
    expect(await Request.makeSignal().token.promise).toMatchObject({
      message: "Request canceled after 1000ms.",
    });
  });

  test("it creates a signal with custom timeout", async () => {
    expect(await Request.makeSignal(200).token.promise).toMatchObject({
      message: "Request canceled after 200ms.",
    });
  });
});

describe("make request", () => {
  const mockUrl = "https://www.foobar.baz/api/v1/example";

  test("it builds request with API key and plain string token", async () => {
    const headers = {
      "X-ApiKey": "my-secret-api-key",
      Authorization: "Bearer 1234",
    };

    mock
      .onGet(mockUrl, undefined, expect.objectContaining(headers))
      .reply(204, { hello: "world" });

    const promise = pipe(
      makeRequest<HelloType>({ url: mockUrl }, Hello, "1234", {
        apiKey: "my-secret-api-key",
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual({ hello: "world" });
  });

  test("it builds request from token object", async () => {
    const headers = {
      "X-ApiKey": "my-secret-api-key",
      Authorization: "Bearer 1234",
    };

    mock
      .onGet(mockUrl, undefined, expect.objectContaining(headers))
      .reply(204, { hello: "world" });

    const promise = pipe(
      makeRequest<HelloType>(
        { url: mockUrl },
        Hello,
        {
          access_token: "1234",
          token_type: "Bearer",
          expires_in: 3600,
          refresh_token: "5678",
        },
        {
          apiKey: "my-secret-api-key",
        },
      ),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual({ hello: "world" });
  });

  test("it fails if response structure mismatches codec", async () => {
    mock.onGet(mockUrl).reply(204, { apple: 3 });

    const promise = pipe(
      makeRequest<HelloType>({ url: mockUrl }, Hello, "1234", {
        apiKey: "my-secret-api-key",
      }),
      TE.fold(taskOf, taskFail),
    )();

    await expect(promise).resolves.toBeInstanceOf(Error);
  });

  test("it gets successful response", async () => {
    const data: HelloType = { hello: "world" };

    mock.onGet(mockUrl).reply(200, data);

    const promise = pipe(
      makeRequest<HelloType>({ url: mockUrl }, Hello),
      TE.fold(taskFail, taskOf),
    )();

    expect.assertions(1);
    await expect(promise).resolves.toMatchObject(data);
  });

  test("it handles 400 client error", async () => {
    mock.onGet(mockUrl).reply(400);

    const promise = pipe(
      makeRequest<unknown>({ url: mockUrl }, t.never),
      TE.fold(taskOf, taskFail),
    )();

    expect.assertions(1);
    await expect(promise).resolves.toEqual(
      new Error("Request failed with status code 400"),
    );
  });

  test("it handles 404 not found", async () => {
    mock.onAny(mockUrl).reply(404, { message: "resource not found" });

    const promise = pipe(
      makeRequest<unknown>({ url: mockUrl }, t.never),
      TE.fold(taskOf, taskFail),
    )();

    expect.assertions(1);
    await expect(promise).resolves.toEqual(
      new Error("Request failed with status code 404"),
    );
  });

  test("it handles 500 responses", async () => {
    mock.onGet(mockUrl).reply(500);

    const promise = pipe(
      makeRequest<unknown>({ url: mockUrl }, t.never),
      TE.fold(taskOf, taskFail),
    )();

    expect.assertions(1);
    await expect(promise).resolves.toEqual(
      new Error("Request failed with status code 500"),
    );
  });

  test("it handles network error", async () => {
    mock.onGet(mockUrl).networkError();

    const promise = pipe(
      makeRequest<unknown>({ url: mockUrl }, t.never),
      TE.fold(taskOf, taskFail),
    )();

    expect.assertions(1);
    await expect(promise).resolves.toEqual(new Error("Network Error"));
  });

  test("it handles abort request", async () => {
    mock.onGet(mockUrl).abortRequest();

    const promise = pipe(
      makeRequest<unknown>({ url: mockUrl }, t.never),
      TE.fold(taskOf, taskFail),
    )();

    expect.assertions(1);
    await expect(promise).resolves.toEqual(new Error("Request aborted"));
  });
});

describe("get request", () => {
  const mockUrl = "https://www.foobar.baz/api/v1/example";

  test("it returns same result as make request", async () => {
    mock.onGet(mockUrl).reply(200, { hello: "world" });

    const p1 = pipe(
      getRequest<HelloType>({
        target: "/example",
        codec: Hello,
        settings: { url: "www.foobar.baz" },
      }),
      TE.fold(taskFail, taskOf),
    )();

    const p2 = pipe(
      makeRequest<HelloType>({ url: mockUrl }, Hello),
      TE.fold(taskFail, taskOf),
    )();

    expect.assertions(2);
    await expect(p1).resolves.toEqual({ hello: "world" });
    await expect(p2).resolves.toEqual({ hello: "world" });
  });
});

describe("post request", () => {
  const mockUrl = "https://www.foobar.baz/api/v1/example";

  test("it returns same result as make request", async () => {
    mock.onPost(mockUrl).reply(200, { hello: "world" });

    const p1 = pipe(
      postRequest<HelloType, HelloType>({
        target: "/example",
        value: { hello: "world" },
        codec: Hello,
        settings: { url: "www.foobar.baz" },
      }),
      TE.fold(taskFail, taskOf),
    )();

    const p2 = pipe(
      makeRequest<HelloType>(
        { url: mockUrl, method: "POST", data: { hello: "world" } },
        Hello,
      ),
      TE.fold(taskFail, taskOf),
    )();

    expect.assertions(2);
    await expect(p1).resolves.toEqual({ hello: "world" });
    await expect(p2).resolves.toEqual({ hello: "world" });
  });
});
