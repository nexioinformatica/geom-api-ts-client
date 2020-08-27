import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Machine } from "../src";
import { getMockAdapter, taskOf, taskFail } from "./util";

const mockAxios = getMockAdapter();
const mockUrl = "www.foobar.baz";
const mockVersion = "/api/v1";

beforeEach(() => {
  mockAxios.reset();
});

const machines = [
  {
    IdMacchina: 1,
    Codice: "TOR-A",
    Descrizione: "Tornio A",
  },
  {
    IdMacchina: 2,
    Codice: "TOR-B",
    Descrizione: "Tornio B",
  },
  {
    IdMacchina: 3,
    Codice: "TOR-C",
    Descrizione: "Tornio C",
  },
];

describe("get collection", () => {
  test("it gets machine collection", async () => {
    mockAxios
      .onGet(`https://${mockUrl}${mockVersion}/macchine`)
      .reply(200, machines);

    const promise = pipe(
      Machine.getCollection({ token: "foo", settings: { url: mockUrl } }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(machines);
  });
});

describe("get single", () => {
  test("it gets single machine", async () => {
    const machine = machines[1];

    mockAxios
      .onGet(`https://${mockUrl}${mockVersion}/macchine/2`)
      .reply(200, machine);

    const promise = pipe(
      Machine.getSingle({
        IdMacchina: 2,
        token: "foo",
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(machine);
  });
});
