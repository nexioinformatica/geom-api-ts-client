import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Barcode } from "../src";
import { getMockAdapter, taskOf, taskFail } from "./util";

const mockAxios = getMockAdapter();
const mockUrl = "www.foobar.baz";
const mockVersion = "/api/v1";

beforeEach(() => {
  mockAxios.reset();
});

describe("barcode-decode successful responses", () => {
  test("it decodes lot", async () => {
    const lot = [{ Tipo: "L", Oggetto: { IdLotto: 3 } }];

    mockAxios
      .onPost(
        `https://${mockUrl}${mockVersion}/barcode-decode`,
        expect.objectContaining({ Code: "L123" }),
      )
      .reply(200, lot);

    const promise = pipe(
      Barcode.decode({
        value: { Code: "L123" },
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(lot);
  });

  test("it decodes freshman", async () => {
    const freshman = [
      { Tipo: "R", Oggetto: { IdMatricola: 3, Matricola: "12345" } },
    ];

    mockAxios
      .onPost(
        `https://${mockUrl}${mockVersion}/barcode-decode`,
        expect.objectContaining({ Code: "M123" }),
      )
      .reply(200, freshman);

    const promise = pipe(
      Barcode.decode({
        value: { Code: "M123" },
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(freshman);
  });
});
