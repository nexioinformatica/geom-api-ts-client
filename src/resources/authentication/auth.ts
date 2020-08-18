import * as TE from "fp-ts/lib/TaskEither";
import * as Request from "../../common/api/request";
import { links, QueryParams, PublicParams } from "../../common/api";
import { Token, TokenC, Grant } from "../../auth";

export type LoginParamsQuery = QueryParams<"">;

export type RefreshParamsQuery = QueryParams<"grant_type" & "refresh_token">;

export function login(
  params: PublicParams<LoginParamsQuery> & {
    value: Grant.Password;
  },
): TE.TaskEither<Error, Token> {
  return Request.postRequest<Grant.Password, Token>({
    ...params,
    value: params.value,
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
  return Request.postRequest<Grant.RefreshToken, Token>({
    ...params,
    value: params.value,
    target: links.auth().token(),
    codec: TokenC,
    settings: { ...params.settings, noVersion: true },
  });
}
