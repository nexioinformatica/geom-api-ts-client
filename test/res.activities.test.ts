import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Activities } from "../src";
import { getMockAdapter, taskOf, taskFail } from "./util";

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
        { Codice: 1, Messaggio: null, Oggetto: JSON.parse(config.data) },
      ]);

    const promise = pipe(
      Activities.start({
        value: mockActivity,
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual({
      Codice: 1,
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
      TE.fold(taskFail, taskOf),
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
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual([mockActivityTypes[0]]);
  });
});

describe("operator activities", () => {
  test("it gets operator activities", async () => {
    mockAxios
      .onGet(`https://${mockUrl}${mockVersion}/operatori/2/attivita`)
      .reply(200, operatorActivities);

    const promise = pipe(
      Activities.collectionByOperator({
        IdOperatore: 2,
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(stringToDateArr(operatorActivities));
  });

  test("it stops operator activity by operator activity id", async () => {
    mockAxios
      .onPost(`https://${mockUrl}${mockVersion}/attivita-operatori/3/stop`)
      .reply(200, operatorActivities[0]);

    const promise = pipe(
      Activities.stopByOperatorActivity({
        IdAttivitaOperatore: 3,
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(stringToDate(operatorActivities[0]));
  });
});

describe("machine activities", () => {
  test("it gets machine activities", async () => {
    mockAxios
      .onGet(`https://${mockUrl}${mockVersion}/macchine/3/attivita`)
      .reply(200, machineActivities);

    const promise = pipe(
      Activities.collectionByMachine({
        IdMacchina: 3,
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(stringToDateArr(machineActivities));
  });

  test("it stops machine activity by machine activity id", async () => {
    mockAxios
      .onPost(`https://${mockUrl}${mockVersion}/attivita-macchine/44/stop`)
      .reply(200, machineActivities[0]);

    const promise = pipe(
      Activities.stopByMachineActivity({
        IdAttivitaMacchina: 44,
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(stringToDate(machineActivities[0]));
  });

  test("it stops machine and operator activity by machine activity id", async () => {
    mockAxios
      .onPost(`https://${mockUrl}${mockVersion}/attivita-macchine/45/stopall`)
      .reply(200, machineActivities[0]);

    const promise = pipe(
      Activities.stopAllByMachineActivity({
        IdAttivitaMacchina: 45,
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(stringToDate(machineActivities[0]));
  });
});

const stringToDate = (x: any) => ({
  ...x,
  DataOraInizio: new Date(x.DataOraInizio),
});
const stringToDateArr = (arr: any[]) => arr.map((x) => stringToDate(x));

const machineActivities = [
  {
    IdAttivitaMacchina: 779,
    IdMacchina: 3,
    IdTipoAttivita: 3,
    IdTestataOrdineEsecutivo: null,
    IdPosizioneOrdineEsecutivo: null,
    IdFaseLavorazione: 9,
    IdOperatoreInizio: 5,
    IdOperatoreFine: null,
    DataOraInizio: "2020-06-19T17:10:00",
    DataOraFine: null,
    DurataMinuti: null,
    Descrizione: "Lavorazione (20-0006*1) avviata il: 19/06/20 17:10 [Test]",
    AttivitàOperatoriAssociate: [
      {
        IdAttivitaOperatore: 20,
        IdOperatore: 5,
        IdTipoAttivita: 3,
        IdTestataOrdineEsecutivo: null,
        IdPosizioneOrdineEsecutivo: null,
        IdFaseLavorazione: 9,
        IdManutenzione: null,
        DataOraInizio: "2020-06-19T17:10:00",
        DataOraFine: null,
        DurataMinuti: null,
        Descrizione:
          "Lavorazione (20-0006*1) - Lavorazione Avviata il: 19/06/20 17:10 sulla Macchina: Tornio C",
        AttivitaMacchinaAssociata: null,
      },
    ],
  },
];

const operatorActivities = [
  {
    IdAttivitaOperatore: 27,
    IdOperatore: 5,
    IdTipoAttivita: 3,
    IdTestataOrdineEsecutivo: null,
    IdPosizioneOrdineEsecutivo: null,
    IdFaseLavorazione: 25,
    IdManutenzione: null,
    DataOraInizio: "2020-06-22T17:11:00",
    DataOraFine: null,
    DurataMinuti: 4,
    Descrizione:
      "Lavorazione (20-0029*1) - Lavorazione Avviata il: 22/06/20 17:11",
    AttivitaMacchinaAssociata: null,
  },
];
