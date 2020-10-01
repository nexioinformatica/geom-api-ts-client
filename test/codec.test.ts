/* eslint-disable @typescript-eslint/no-unused-vars */

import * as A from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/pipeable";
import * as T from "fp-ts/lib/Task";
import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import pAll from "p-all";

import { Barcode } from "../src";
import { decodeWith } from "../src/common/api/codec";
import { NullyC } from "../src/common/structs";
import {
  tasker,
  taskExpectError,
  taskExpectMatchObject,
  taskFail,
  taskOf,
} from "./util";
import {
  AllBarcodeDecodeResponseFactory,
  BarcodeDecodeResponseFactory,
  ButMachineBarcodeDecodeResponseFactory,
  DecodeResponseFactory,
  EmptyBarcodeDecodeResponseFactory,
  getSingleBarcodeResponseFactoryList,
  MismatchBarcodeDecodeResponseFactory,
  MismatchSingleDecodeResponseFactory,
  RepeatedBarcodeDecodeResponseFactory,
  SingleDecodeResponseFactory,
} from "./util/DecodeResponseFactory";

describe("decode with", () => {
  test("it decodes basic type", async () => {
    await pipe(
      "foo bar",
      decodeWith(t.string),
      TE.fold(
        taskFail,
        tasker((x: string) => expect(x).toEqual("foo bar")),
      ),
    )();
  });

  test("it decodes complex type", async () => {
    const obj = { foo: "bar", baz: 1 };
    await pipe(
      obj,
      decodeWith(t.object),
      TE.fold(taskFail, taskExpectMatchObject(obj)),
    )();
  });

  test("it do not decodes null as undefined", async () => {
    const obj1 = { foo: "test" };
    const obj2 = { foo: null };
    const ObjC = t.type({ foo: t.union([t.string, t.undefined]) });

    const promise = (obj: { foo: string | null }) =>
      pipe(obj, decodeWith(ObjC), TE.fold(taskFail, taskOf));

    await expect(promise(obj1)()).resolves.toMatchObject(obj1);
    await expect(promise(obj2)()).rejects.toThrowError(
      "Invalid value null supplied to : { foo: (string | undefined) }/foo: (string | undefined)/0: string",
    );
    expect.assertions(2);
  });

  test("it do not decodes undefined as null", async () => {
    const obj1 = { foo: "test" };
    const obj2 = { foo: undefined };
    const ObjC = t.type({ foo: t.union([t.string, t.null]) });

    const promise = (obj: { foo: string | undefined }) =>
      pipe(obj, decodeWith(ObjC), TE.fold(taskFail, taskOf));

    await expect(promise(obj1)()).resolves.toMatchObject(obj1);
    await expect(promise(obj2)()).rejects.toThrowError(
      "Invalid value undefined supplied to : { foo: (string | null) }/foo: (string | null)/0: string",
    );
    expect.assertions(2);
  });

  test("it decodes nully as null or undefined", async () => {
    const obj1 = { foo: "test" };
    const obj2 = { foo: undefined };
    const obj3 = { foo: null };
    const ObjC = t.type({ foo: NullyC(t.string) });

    const promise = (obj: { foo: string | null | undefined }) =>
      pipe(obj, decodeWith(ObjC), TE.fold(taskFail, taskOf));

    await expect(promise(obj1)()).resolves.toMatchObject(obj1);
    await expect(promise(obj2)()).resolves.toMatchObject(obj2);
    await expect(promise(obj3)()).resolves.toMatchObject(obj3);
    expect.assertions(3);
  });

  test("it returns error if basic type decoding fails", async () => {
    await pipe(1, decodeWith(t.string), TE.fold(taskExpectError, taskFail))();
  });

  test("it returns error if complex type decoding fails", async () => {
    await pipe(1, decodeWith(t.string), TE.fold(taskExpectError, taskFail))();
  });
});

describe("barcode decode (single)", () => {
  test("it decodes all barcode types", async () => {
    const tasks = pipe(
      getSingleBarcodeResponseFactoryList(),
      A.map((factory) =>
        pipe(
          taskExpectMatchObject(factory.output()),
          getSingleDecodePipe(factory),
        ),
      ),
    );
    await pAll(tasks);
  });

  test("it fails if type and properties mismatches", async () => {
    const factory = new MismatchSingleDecodeResponseFactory();
    await pipe(
      factory.input(),
      decodeWith(factory.codec()),
      TE.fold(taskExpectError, taskFail),
    )();
  });
});

describe("barcode decode (collection)", () => {
  test("it decodes collection of barcode types", async () => {
    const factory = new AllBarcodeDecodeResponseFactory();
    const expected = taskExpectMatchObject<
      Barcode.BarcodeDecode,
      Barcode.BarcodeDecode
    >(factory.output());

    await pipe(expected, getBarcodeDecodePipe(factory))();
  });

  test("it decodes collection of repeated barcode types", async () => {
    const factory = new RepeatedBarcodeDecodeResponseFactory();
    const expected = taskExpectMatchObject<
      Barcode.BarcodeDecode,
      Barcode.BarcodeDecode
    >(factory.output());

    await pipe(expected, getBarcodeDecodePipe(factory))();
  });

  test("it fails if some in collection mismatches", async () => {
    const factory = new MismatchBarcodeDecodeResponseFactory();
    await pipe(
      factory.input(),
      decodeWith(Barcode.Codec.BarcodeDecodeC),
      TE.fold(taskExpectError, taskFail),
    )();
  });
});

describe("barcode decode utils", () => {
  test("it extracts first match from collection", async () => {
    const factory = new RepeatedBarcodeDecodeResponseFactory();
    const expected = (x: Barcode.BarcodeDecode) =>
      expect(
        pipe(x, Barcode.Util.getDecode<Barcode.MachineDecode>("M")),
      ).toMatchObject({
        Tipo: "M",
        Oggetto: { IdMacchina: 1 },
      });

    await pipe(expected, tasker, getBarcodeDecodePipe(factory))();
  });

  test("it returns undefined from empty collection", async () => {
    const factory = new EmptyBarcodeDecodeResponseFactory();
    const expected = (x: Barcode.BarcodeDecode) =>
      expect(
        pipe(x, Barcode.Util.getDecode<Barcode.MachineDecode>("O")),
      ).toEqual(undefined);

    await pipe(expected, tasker, getBarcodeDecodePipe(factory))();
  });

  test("it returns undefined from collection if searched decode not found", async () => {
    const factory = new ButMachineBarcodeDecodeResponseFactory();
    const expected = (x: Barcode.BarcodeDecode) =>
      expect(
        pipe(x, Barcode.Util.getDecode<Barcode.MachineDecode>("M")),
      ).toEqual(undefined);

    await pipe(expected, tasker, getBarcodeDecodePipe(factory))();
  });
});

const getSingleDecodePipe = (factory: SingleDecodeResponseFactory) =>
  getDecodePipe(factory);

const getBarcodeDecodePipe = (factory: BarcodeDecodeResponseFactory) =>
  getDecodePipe(factory);

const getDecodePipe = <U>(factory: DecodeResponseFactory<U>) => (
  expected: (x: U) => T.Task<U>,
): T.Task<U> => {
  return pipe(
    factory.input(),
    decodeWith(factory.codec()),
    TE.fold(taskFail, expected),
  );
};
