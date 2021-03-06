import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Authentication, Auth } from "../src";
import { getMockAdapter, taskOf, taskFail } from "./util";
import qs from "qs";

const mockAxios = getMockAdapter();
const mockUrl = "www.foobar.baz";
const mockVersion = "";

beforeEach(() => {
  mockAxios.reset();
});

describe("auth", () => {
  test("it logins with username/password", async () => {
    const mockAuthData: Auth.Grant.Password = {
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
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    mockAxios
      .onPost(
        `https://${mockUrl}${mockVersion}/token`,
        qs.stringify(mockAuthData),
        expect.objectContaining(headers),
      )
      .reply(200, mockToken);

    const promise = pipe(
      Authentication.login({ settings: { url: mockUrl }, value: mockAuthData }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(mockToken);
  });

  test("it logins with refresh token", async () => {
    const mockAuthData: Auth.Grant.RefreshToken = {
      refresh_token: "cde456",
      grant_type: "refresh_token",
      client_id: "123",
    };
    const mockToken = {
      access_token: "abc123",
      expires_in: 3600,
      refresh_token: "cde456",
      token_type: "Bearer",
    };
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    mockAxios
      .onPost(
        `https://${mockUrl}${mockVersion}/token`,
        qs.stringify(mockAuthData),
        expect.objectContaining(headers),
      )
      .reply(200, mockToken);

    const promise = pipe(
      Authentication.refresh({
        settings: { url: mockUrl },
        value: mockAuthData,
      }),
      TE.fold(taskFail, taskOf),
    )();

    await expect(promise).resolves.toEqual(mockToken);
  });
});
