import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Subdivision } from "../src";
import { getMockAdapter, taskOf, taskFail } from "./util";

const mockAxios = getMockAdapter();
const mockUrl = "www.foobar.baz";
const mockVersion = "/api/v1";

beforeEach(() => {
  mockAxios.reset();
});

describe("subivisions", () => {
  test("it gets subdivision collection by freshman", async () => {
    mockAxios
      .onGet(
        `https://${mockUrl}${mockVersion}/articoli-matricole/3/suddivisioni`,
      )
      .reply(200, subdivisionCollection);

    const promise = pipe(
      Subdivision.collectionByFreshman({
        IdMatricola: 3,
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(subdivisionCollection);
  });

  test("it gets subdivision collection by article", async () => {
    mockAxios
      .onGet(`https://${mockUrl}${mockVersion}/articoli/5/suddivisioni`)
      .reply(200, subdivisionCollection);

    const promise = pipe(
      Subdivision.collectionByArticle({
        IdArticolo: 5,
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(subdivisionCollection);
  });

  test("it gets single subdivision by subdicision", async () => {
    mockAxios
      .onGet(`https://${mockUrl}${mockVersion}/articoli-suddivisioni/7`)
      .reply(200, subdivisionCollection[0]);

    const promise = pipe(
      Subdivision.single({
        IdSuddivisione: 7,
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(subdivisionCollection[0]);
  });

  test("it creates new subdivision", async () => {
    mockAxios
      .onPost(
        `https://${mockUrl}${mockVersion}/articoli-suddivisioni`,
        expect.objectContaining(newSubdivision),
      )
      .reply(200, newSubdivisionResult);

    const promise = pipe(
      Subdivision.create({
        value: newSubdivision,
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(newSubdivisionResult);
  });
});

const subdivisionCollection = [
  {
    IdSuddivisione: 4,
    IdArticolo: 1,
    IdLotto: null,
    IdMatricola: 2,
    Descrizione: "2000 mm",
    Quantita: [
      {
        Giacenza: 2,
        Disponibilita: 0,
        UnitaMisura: {
          IdUnitaMisura: 4,
          Sigla: "m",
          Descrizione: "Metri",
        },
      },
      {
        Giacenza: 50,
        Disponibilita: 0,
        UnitaMisura: {
          IdUnitaMisura: 2,
          Sigla: "kg",
          Descrizione: "Kg",
        },
      },
      {
        Giacenza: 2,
        Disponibilita: 0,
        UnitaMisura: {
          IdUnitaMisura: 1,
          Sigla: "pz",
          Descrizione: "Pezzi",
        },
      },
    ],
  },
];

const newSubdivision = {
  IdArticolo: 2,
  Descrizione: "Suddivisione Prova 50x50mm",
  Valori: [1, 2],
};

const newSubdivisionResult = {
  Codice: 1,
  Messaggio: null,
  Oggetto: {
    IdSuddivisione: 6,
    IdArticolo: 2,
    IdLotto: null,
    IdMatricola: null,
    Descrizione: "Suddivisione Prova 50x50mm",
    Quantita: [
      {
        Giacenza: 0,
        Disponibilita: 0,
        UnitaMisura: {
          IdUnitaMisura: 1,
          Sigla: "pz",
          Descrizione: "Pezzi",
        },
      },
      {
        Giacenza: 0,
        Disponibilita: 0,
        UnitaMisura: {
          IdUnitaMisura: 2,
          Sigla: "kg",
          Descrizione: "Kg",
        },
      },
    ],
  },
};
