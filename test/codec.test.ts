/* eslint-disable @typescript-eslint/no-unused-vars */

import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import * as t from "io-ts";
import { decodeWith } from "../src/common/api/codec";
import { taskFail, taskExpectMatchObject, taskExpectInstanceOf } from "./util";

describe("decode with", () => {
  test("it decodes string", () => {
    pipe(
      "foo bar",
      decodeWith(t.string),
      TE.fold(taskFail, taskExpectMatchObject("foo bar")),
    );
  });

  test("it returns error decodinig string fails", () => {
    pipe(
      1,
      decodeWith(t.string),
      TE.fold(taskExpectInstanceOf("Error"), taskFail),
    );
  });

  test("it decodes number", () => {
    pipe(1, decodeWith(t.number), TE.fold(taskFail, taskExpectMatchObject(1)));
  });

  test("it returns error decodinig number fails", () => {
    pipe(
      1,
      decodeWith(t.string),
      TE.fold(taskExpectInstanceOf("Error"), taskFail),
    );
  });

  test("it decodes object", () => {
    const obj = { foo: "bar", baz: 1 };
    pipe(
      obj,
      decodeWith(t.object),
      TE.fold(taskFail, taskExpectMatchObject(obj)),
    );
  });
});
