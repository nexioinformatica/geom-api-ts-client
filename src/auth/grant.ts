import * as t from "io-ts";

const GrantTypeC = t.keyof({ password: null, refresh_token: null });

const PasswordC = t.type({
  username: t.string,
  password: t.string,
  grant_type: GrantTypeC,
  client_id: t.string,
});

const RefreshTokenC = t.type({
  refresh_token: t.string,
  grant_type: GrantTypeC,
});

export type Password = t.TypeOf<typeof PasswordC>;
export type RefreshToken = t.TypeOf<typeof RefreshTokenC>;
