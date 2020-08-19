import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Warehouse } from "../src";
import { getMockAdapter, taskOf, taskNever } from "./util";
import { ReasonTypeKey } from "../src/resources/warehouse/movement";

const mockAxios = getMockAdapter();
const mockUrl = "www.foobar.baz";
const mockVersion = "/api/v1";

beforeEach(() => {
  mockAxios.reset();
});

describe("warehouse movements", () => {
  test("it creates new warehouse movement", async () => {
    const mockMovement: Warehouse.Movement.NewMovement = {
      TipoCausale: ReasonTypeKey.LoadScrap,
      Quantita: [50],
      Matricole: [1, 2, 3],
      Note: "foo",
    };

    mockAxios
      .onPost(`https://${mockUrl}${mockVersion}/movimenti-magazzino`)
      .reply((config) => {
        const d = JSON.parse(config.data);
        return [
          200,
          {
            Code: 1,
            Messaggio: null,
            Oggetto: {
              IdMovimento: 1,
              Quantita: d.Quantita,
              Matricole: d.Matricole,
              Note: d.Note,
            },
          },
        ];
      });

    const promise = pipe(
      Warehouse.Movement.create({
        value: mockMovement,
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskNever, taskOf),
    )();

    await expect(promise).resolves.toEqual({
      Code: 1,
      Messaggio: null,
      Oggetto: {
        IdMovimento: 1,
        Quantita: [50],
        Matricole: [1, 2, 3],
        Note: "foo",
      },
    });
  });
});

describe("warehouse reasons", () => {
  test("it gets collection", async () => {
    const mockReasons: Warehouse.Reason.Collection = [
      {
        IdCausale: 14,
        Codice: "VEN",
        Descrizione: "Vendita",
      },
    ];

    mockAxios
      .onGet(`https://${mockUrl}${mockVersion}/causali-magazzino`)
      .reply(200, mockReasons);

    const promise = pipe(
      Warehouse.Reason.getCollection({
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskNever, taskOf),
    )();

    await expect(promise).resolves.toEqual(mockReasons);
  });
});
