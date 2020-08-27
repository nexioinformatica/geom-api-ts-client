import * as T from "fp-ts/lib/Task";
import * as t from "io-ts";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

export const Hello = t.type({ hello: t.string });
export type HelloType = t.TypeOf<typeof Hello>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const taskFail = <U>(x: U): T.Task<never> => {
  return () => Promise.reject(x);
};

export const taskNever = (): T.Task<never> => T.never;

export const taskOf = T.of;

export const tasker = <U, V>(f: (x: U) => V) => (x: U): T.Task<U> => {
  f(x);
  return taskOf(x);
};

export const taskExpectMatchObject = <U, V>(
  expected: U,
): ((x: V) => T.Task<V>) =>
  tasker((x: V) => {
    expect(x).toMatchObject(expected);
  });

/**
 * Check that given value is an Error with structural comparison.
 * Checked properties are `name` and `message`.
 *
 * No instanceof or typeof used, see https://github.com/facebook/jest/issues/2549
 */
export const taskExpectError = (<U extends Error>() =>
  tasker((x: U) => expect(!!x && !!x.name && !!x.message).toBe(true)))();

export const taskExpectEqual = <V, U>(expected: V) =>
  tasker((x: U) => expect(x).toEqual(expected));

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

export const log = <U>(x: U) => {
  console.log(typeof x);
  console.log(Object.keys(x));
  console.log(x);
  return x;
};
