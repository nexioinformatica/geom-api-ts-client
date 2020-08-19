import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Activities } from "../src";
import { getMockAdapter, taskOf, taskNever } from "./util";

const mockAxios = getMockAdapter();
const mockUrl = "www.foobar.baz";
const mockVersion = "/api/v1";

beforeEach(() => {
  mockAxios.reset();
});

describe("activities", () => {
  test("it starts new activity", async () => {
    const mockActivity: Activities.NewActivity = {
      TipoAzione: Activities.ActionTypeKey.MachineAndOperator,
      IdTipoAttivita: 3,
    };

    mockAxios
      .onPost(`https://${mockUrl}${mockVersion}/attivita/start`)
      .reply((config) => [
        200,
        { Code: 1, Messaggio: null, Oggetto: JSON.parse(config.data) },
      ]);

    const promise = pipe(
      Activities.start({
        value: mockActivity,
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskNever, taskOf),
    )();

    await expect(promise).resolves.toEqual({
      Code: 1,
      Messaggio: null,
      Oggetto: mockActivity,
    });
  });
});

describe("activity types", () => {
  const mockActivityTypes = [
    {
      IdTipoAttivita: 1,
      Codice: "TA_ATT",
      Descrizione: "Attrezzaggio",
    },
    {
      IdTipoAttivita: 2,
      Codice: "TA_CARSCA",
      Descrizione: "Carico/Scarico",
    },
  ];

  test("it gets collection", async () => {
    mockAxios
      .onGet(`https://${mockUrl}${mockVersion}/tipi-attivita`)
      .reply(200, mockActivityTypes);

    const promise = pipe(
      Activities.ActivityType.getCollection({
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskNever, taskOf),
    )();

    await expect(promise).resolves.toEqual(mockActivityTypes);
  });

  test("it gets collection with filters", async () => {
    mockAxios
      .onGet(`https://${mockUrl}${mockVersion}/tipi-attivita?IdFase=1`)
      .reply(200, [mockActivityTypes[0]]);

    const promise = pipe(
      Activities.ActivityType.getCollection({
        query: { params: { IdFase: 1 } },
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskNever, taskOf),
    )();

    await expect(promise).resolves.toEqual([mockActivityTypes[0]]);
  });
});
