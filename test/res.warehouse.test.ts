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
    const mockMovement: Warehouse.Movement.Movement = {
      TipoCausale: ReasonTypeKey.LoadScrap,
      Quantita: [50],
      Matricole: [1, 2, 3],
      Note: "foo",
    };

    mockAxios
      .onPost(`https://${mockUrl}${mockVersion}/movimenti-magazzino`)
      .reply((config) => [200, config.data]);

    const promise = pipe(
      Warehouse.Movement.create({
        value: mockMovement,
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskNever, taskOf),
    )();

    await expect(promise).resolves.toEqual(mockMovement);
  });
});
