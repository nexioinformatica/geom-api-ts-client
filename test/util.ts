import * as T from "fp-ts/lib/Task";
import * as t from "io-ts";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

export const Hello = t.type({ hello: t.string });
export type HelloType = t.TypeOf<typeof Hello>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const taskFail = <U>(_x: U): T.Task<never> => {
  return T.never;
};

export const taskNever = (): T.Task<never> => T.never;

export const taskOf = <U>(x: U): T.Task<U> => T.of(x);

export const taskExpectMatchObject = <U>(expected: U) => <V>(
  x: V,
): T.Task<V> => {
  expect(x).toMatchObject(expected);
  return T.of(x);
};

export const taskExpectInstanceOf = (expected: string) => <U>(
  x: U,
): T.Task<U> => {
  expect(x).toBeInstanceOf(expected);
  return T.of(x);
};

export function getMockAdapter(): MockAdapter {
  return new MockAdapter(axios);
}

export function logAxiosRequests() {
  axios.interceptors.request.use((v) => {
    console.log(v);
    return v;
  });
}

export function logAxiosResponses() {
  axios.interceptors.response.use((v) => {
    console.log(v);
    return v;
  });
}
