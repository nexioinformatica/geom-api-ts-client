import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Operator } from "../src";
import { getMockAdapter, taskOf, taskFail } from "./util";

const mockAxios = getMockAdapter();
const mockUrl = "www.foobar.baz";
const mockVersion = "/api/v1";

beforeEach(() => {
  mockAxios.reset();
});

describe("operators successful responses", () => {
  const mockData = [
    {
      IdOperatore: 10,
      Nome: "Operatore 1",
      Sigla: null,
      UserName: "operatore1",
      Attivo: true,
      AbilitatoAPI: true,
      AbilitatoAttivitaReparto: true,
    },
    {
      IdOperatore: 4,
      Nome: "Operatore 2",
      Sigla: null,
      UserName: "operatore2",
      Attivo: true,
      AbilitatoAPI: true,
      AbilitatoAttivitaReparto: true,
    },
  ];

  test("it gets collection", async () => {
    mockAxios
      .onGet(
        `https://${mockUrl}${mockVersion}/operatori?AbilitatoAPI=true&AbilitatoAttivitaReparto=true`,
      )
      .reply(200, mockData);

    const promise = pipe(
      Operator.getCollection({
        query: {
          params: { AbilitatoAPI: true, AbilitatoAttivitaReparto: true },
        },
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(mockData);
  });

  test("it gets signle", async () => {
    mockAxios
      .onGet(`https://${mockUrl}${mockVersion}/operatori/10`)
      .reply(200, mockData[0]);

    const promise = pipe(
      Operator.getSingle({
        IdOperatore: 10,
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(mockData[0]);
  });

  test("it gets me", async () => {
    mockAxios
      .onGet(`https://${mockUrl}${mockVersion}/operatori/me`)
      .reply(200, mockData[0]);

    const promise = pipe(
      Operator.getMe({
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(mockData[0]);
  });
});

describe("operators empty responses", () => {
  test("it gets empty array", async () => {
    mockAxios
      .onGet(
        `https://${mockUrl}${mockVersion}/operatori?AbilitatoAPI=true&AbilitatoAttivitaReparto=true`,
      )
      .reply(200, []);

    const promise = pipe(
      Operator.getCollection({
        query: {
          params: { AbilitatoAPI: true, AbilitatoAttivitaReparto: true },
        },
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual([]);
  });

  test("it gets not found", async () => {
    mockAxios
      .onGet(`https://${mockUrl}${mockVersion}/operatori/5`)
      .reply(200, []);

    const promise = pipe(
      Operator.getSingle({
        IdOperatore: 10,
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskOf, taskFail),
    )();

    await expect(promise).resolves.toEqual(
      new Error("Request failed with status code 404"),
    );
  });

  test("it returns error if coded fails", async () => {
    mockAxios
      .onGet(`https://${mockUrl}${mockVersion}/operatori/10`)
      .reply(200, { hello: "world" });

    const promise = pipe(
      Operator.getSingle({
        IdOperatore: 10,
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskOf, taskFail),
    )();

    await expect(promise).resolves.toBeInstanceOf(Error);
  });
});
