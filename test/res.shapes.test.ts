import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Shapes } from "../src";
import { getMockAdapter, taskOf, taskFail } from "./util";
import { makeSettings } from "./util";

const mockAxios = getMockAdapter();
const mockUrl = "www.foobar.baz";
const mockVersion = "/api/v1";

const mockSettings = makeSettings("my-token-123")(mockUrl);

beforeEach(() => {
  mockAxios.reset();
});

describe("shapes", () => {
  test("it gets shape collection", async () => {
    mockAxios
      .onGet(`https://${mockUrl}${mockVersion}/forme`)
      .reply(200, shapes);

    const promise = pipe(
      Shapes.collection(mockSettings({})),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(shapes);
  });

  test("it gets shape collection with article", async () => {
    mockAxios
      .onGet(`https://${mockUrl}${mockVersion}/forme`, expect.objectContaining({ IdArticolo: 3 }))
      .reply(200, [shapes[0]]);

    const promise = pipe(
      Shapes.collection(mockSettings({ IdArticolo: 3 })),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual([shapes[0]]);
  });

  test("it gets single shape by id", async () => {
    mockAxios
    .onGet(`https://${mockUrl}${mockVersion}/forma/27`)
    .reply(200, shapes[0]);

    const promise = pipe(
      Shapes.single(mockSettings({ IdForma: 27 })),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(shapes[0]);
  })
});

const shapes = [
    {
      "IdForma": 27,
      "Descrizione": "Albero 2 diametri",
      "Dimensioni": [
        {
          "Sigla": "D1",
          "Descrizione": "Diametro1",
          "UM": "mm"
        },
        {
          "Sigla": "D2",
          "Descrizione": "Diametro2",
          "UM": "mm"
        }
      ]
    },
    {
      "IdForma": 3,
      "Descrizione": "Albero 3 diametri",
      "Dimensioni": [
        {
          "Sigla": "D1",
          "Descrizione": "Diametro1",
          "UM": "mm"
        },
        {
          "Sigla": "D2",
          "Descrizione": "Diametro2",
          "UM": "mm"
        },
        {
          "Sigla": "D3",
          "Descrizione": "Diametro3",
          "UM": "mm"
        },
        {
          "Sigla": "L",
          "Descrizione": "Lunghezza",
          "UM": "mm"
        }
      ]
    },
  ];
