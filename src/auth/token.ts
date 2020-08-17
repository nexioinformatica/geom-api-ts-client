import * as t from "io-ts";

export const TokenC = t.type({
  access_token: t.string,
  token_type: t.string,
  expires_in: t.number,
  refresh_token: t.string,
});

export type Token = t.TypeOf<typeof TokenC>;

export function getTokenType(
  token: string | Token,
  defaultType = "Bearer",
): string {
  return !TokenC.is(token) ? defaultType : token.token_type;
}

export function getAccessToken(token: string | Token): string {
  return !TokenC.is(token) ? token : token.access_token;
}
