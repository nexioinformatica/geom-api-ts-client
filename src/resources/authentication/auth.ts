import { pipe } from "fp-ts/lib/pipeable";
import * as TE from "fp-ts/lib/TaskEither";
import qs from "qs";

import { Grant, Token, TokenC } from "../../auth";
import { links, PublicParams, QueryParams } from "../../common/api";
import { contentTypeWwwFormUrlencoded, empty } from "../../common/api/headers";
import * as Request from "../../common/api/request";

export type LoginParamsQuery = QueryParams<"">;

export type RefreshParamsQuery = QueryParams<"grant_type" & "refresh_token">;

export function login(
  params: PublicParams<LoginParamsQuery> & {
    value: Grant.Password;
  },
): TE.TaskEither<Error, Token> {
  const headers = pipe(empty, contentTypeWwwFormUrlencoded);
  return Request.postRequest<string, Token>({
    config: { headers: headers },
    ...params,
    value: qs.stringify(params.value),
    target: links.auth().token(),
    codec: TokenC,
    settings: { ...params.settings, noVersion: true },
  });
}

export function refresh(
  params: PublicParams<RefreshParamsQuery> & {
    value: Grant.RefreshToken;
  },
): TE.TaskEither<Error, Token> {
  const headers = pipe(empty, contentTypeWwwFormUrlencoded);
  return Request.postRequest<string, Token>({
    config: { headers: headers },
    ...params,
    value: qs.stringify(params.value),
    target: links.auth().token(),
    codec: TokenC,
    settings: { ...params.settings, noVersion: true },
  });
}
