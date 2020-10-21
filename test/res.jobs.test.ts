import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Job } from "../src";
import { getMockAdapter, taskOf, taskFail } from "./util";

const mockAxios = getMockAdapter();
const mockUrl = "www.foobar.baz";
const mockVersion = "/api/v1";

beforeEach(() => {
  mockAxios.reset();
});

describe("phase progress", () => {
  test("it ends phase and gets phase progress", async () => {
    mockAxios
      .onPost(`https://${mockUrl}${mockVersion}/fasi-lavorazione/52/fine`)
      .reply(200, phaseProgress);

    const promise = pipe(
      Job.end({
        IdFase: 52,
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(phaseProgress);
  });

  test("it gets check actions", async () => {
    mockAxios
      .onGet(
        `https://${mockUrl}${mockVersion}/fasi-lavorazione/52/check-action`,
      )
      .reply(200, checkAction);

    const promise = pipe(
      Job.checkAction({
        IdFase: 52,
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(checkAction);
  });
});

describe("job phase search", () => {
  test("it searchs by name", async () => {
    mockAxios
      .onGet(`https://${mockUrl}${mockVersion}/fasi-lavorazione/fasecomune/foo`)
      .reply(200, phaseProgress);

    const promise = pipe(
      Job.byName({
        search: { Nome: "foo" },
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(phaseProgress);
  });
});

const phaseProgress = {
  IdFase: 22,
  IdPosizione: 28,
  IdTestata: 33,
  CodicePosizione: "20-0025*1",
  CodiceCommessa: "20-0025*1",
  DescrizioneFase: "Lavorazione",
  DescrizioneProdotto: null,
  Disegno: "",
  NumeroPezzi: 1,
  NumeroOrdineCliente: null,
  SiglaCliente: "ABC",
  RagioneSocialeCliente: "ABC Lavorazioni",
  StatoAvanzamento: "Effettuata dal 18/06/20 h 16:20 al 18/06/20 h 16:20",
};

const checkAction = {
  Codice: 7,
  Messaggio: null,
};
