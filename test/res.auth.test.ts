import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Auth } from "../src";
import { getMockAdapter, taskOf, taskNever } from "./util";
import { Grant } from "../src/auth";

const mockAxios = getMockAdapter();
const mockUrl = "www.foobar.baz";
const mockVersion = "";

beforeEach(() => {
  mockAxios.reset();
});

describe("auth", () => {
  test("it logins with username/password", async () => {
    const mockAuthData: Grant.Password = {
      username: "foo",
      password: "secret",
      grant_type: "password",
      client_id: "123",
    };
    const mockToken = {
      access_token: "abc123",
      expires_in: 3600,
      refresh_token: "cde456",
      token_type: "Bearer",
    };

    mockAxios
      .onPost(
        `https://${mockUrl}${mockVersion}/token`,
        expect.objectContaining(mockAuthData),
      )
      .reply(200, mockToken);

    const promise = pipe(
      Auth.login({ settings: { url: mockUrl }, value: mockAuthData }),
      TE.fold(taskNever, taskOf),
    )();

    await expect(promise).resolves.toEqual(mockToken);
  });

  test("it logins with refresh token", async () => {
    const mockAuthData: Grant.RefreshToken = {
      refresh_token: "cde456",
      grant_type: "refresh_token",
    };
    const mockToken = {
      access_token: "abc123",
      expires_in: 3600,
      refresh_token: "cde456",
      token_type: "Bearer",
    };

    mockAxios
      .onPost(`https://${mockUrl}${mockVersion}/token`)
      .reply(200, mockToken);

    const promise = pipe(
      Auth.refresh({ settings: { url: mockUrl }, value: mockAuthData }),
      TE.fold(taskNever, taskOf),
    )();

    await expect(promise).resolves.toEqual(mockToken);
  });
});
