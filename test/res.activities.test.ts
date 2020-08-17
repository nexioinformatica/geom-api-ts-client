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
    const mockActivity: Activities.Activity = {
      TipoAzione: Activities.ActionTypeKey.MachineAndOperator,
      IdTipoAttivita: 3,
    };

    mockAxios
      .onPost(`https://${mockUrl}${mockVersion}/attivita/start`)
      .reply((config) => [200, config.data]);

    const promise = pipe(
      Activities.start({
        value: mockActivity,
        token: "my-token-123",
        settings: { url: mockUrl },
      }),
      TE.fold(taskNever, taskOf),
    )();

    await expect(promise).resolves.toEqual(mockActivity);
  });
});
