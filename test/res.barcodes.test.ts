import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Barcode } from "../src";
import { getMockAdapter, taskOf, taskFail } from "./util";
import {
  FreshmanSingleDecodeResponseFactory,
  LotSingleDecodeResponseFactory,
} from "./util/DecodeResponseFactory/SingleDecodeResponseFactory";

const mockAxios = getMockAdapter();
const mockUrl = "www.foobar.baz";
const mockVersion = "/api/v1";

beforeEach(() => {
  mockAxios.reset();
});

describe("barcode-decode successful responses", () => {
  test("it decodes lot", async () => {
    const lot = [new LotSingleDecodeResponseFactory().output()];

    mockAxios
      .onPost(
        `https://${mockUrl}${mockVersion}/barcode-decode`,
        expect.objectContaining({ Codice: "L123" }),
      )
      .reply(200, lot);

    const promise = pipe(
      Barcode.decode({
        value: { Codice: "L123" },
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(lot);
  });

  test("it decodes freshman", async () => {
    const freshman = [new FreshmanSingleDecodeResponseFactory().output()];

    mockAxios
      .onPost(
        `https://${mockUrl}${mockVersion}/barcode-decode`,
        expect.objectContaining({ Codice: "R123" }),
      )
      .reply(200, freshman);

    const promise = pipe(
      Barcode.decode({
        value: { Codice: "R123" },
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(freshman);
  });
});
