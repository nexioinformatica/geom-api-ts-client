import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from "axios";
import * as O from "fp-ts/lib/Option";
import * as TE from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/pipeable";
import * as t from "io-ts";
import { QueryParams, formatParams, paramsStarter } from "./query";
import { Settings } from "./settings";
import { Token, getTokenType, getAccessToken } from "../../auth";
import { VERSION } from "./version";
import { decodeWith } from "./codec";

export type ApiResult<T> = ResultSuccess<T> | ResultFail<Error>;

export interface ResultSuccess<T> {
  ok: true;
  value: T;
}

export interface ResultFail<T> {
  ok: false;
  error: T;
}

export type BaseParams<T = QueryParams> = {
  query?: T;
  settings?: Settings;
};

export type StandardParams<T = QueryParams> = BaseParams<T> & {
  token: Token | string;
};

export type PublicParams<T = QueryParams> = BaseParams<T>;

export function makeUrl(settings?: Settings, websocket?: boolean): string {
  let secure = true;
  let version = `/${VERSION}`;

  if (settings && settings.noVersion) {
    version = "";
  }

  if (settings && settings.useHttp) {
    secure = false;
  }

  if (settings && settings.url && settings.url.indexOf("://") > -1) {
    return settings.url;
  }

  const prefix = websocket
    ? `ws${secure ? "s" : ""}://`
    : `http${secure ? "s" : ""}://`;

  if (settings && settings.url) {
    return `${prefix}${settings.url}${version}`;
  }

  // Default URL returned. Version will be updated here if changed
  return `${prefix}srv-geom-mc2.metalcamuna.it:8443${version}`;
}

export const makeHeader = <T>(
  name: string,
  value?: T,
): Partial<Record<string, T>> =>
  pipe(
    value,
    O.fromNullable,
    O.fold(
      () => ({}),
      (x) => ({ [name]: x }),
    ),
  );

export const addHeader = <T>(name: string, value?: T) => <U>(
  headers: Partial<Record<string, U>>,
): Partial<Record<string, U | T>> => ({
  ...headers,
  ...makeHeader(name, value),
});

export const makeSignal = (timeout = 1000): CancelTokenSource => {
  const signal = axios.CancelToken.source();
  setTimeout(
    () => signal.cancel(`Request canceled after ${timeout}ms.`),
    timeout,
  );
  return signal;
};

export function makeRequest<T>(
  req: AxiosRequestConfig,
  codec: t.Decoder<unknown, T>,
  token?: Token | string,
  settings?: Settings,
): TE.TaskEither<Error, T> {
  const headers = pipe(
    req.headers || {},
    addHeader("X-ApiKey", settings && settings.apiKey),
    addHeader(
      "Authorization",
      token && `${getTokenType(token)} ${getAccessToken(token)}`,
    ),
  );

  const config: AxiosRequestConfig = {
    ...req,
    headers: headers,
    timeout: settings && settings.timeout,
    cancelToken: settings && settings.signal,
  };

  const request = TE.tryCatch(
    () => axios.request<T>(config),
    (reason) => reason as Error,
  );

  const reviver = (r: TE.TaskEither<Error, AxiosResponse<T>>) =>
    pipe(
      r,
      TE.fold(
        (err) => TE.left(err),
        (res) => decodeWith(codec)(res.data),
      ),
    );

  return pipe(request, reviver);
}

export function getRequest<T>({
  target,
  codec,
  query,
  token,
  settings,
}: {
  target: string;
  codec: t.Decoder<unknown, T>;
  query?: QueryParams;
  token?: Token | string;
  settings?: Settings;
}): TE.TaskEither<Error, T> {
  const req: AxiosRequestConfig = {
    url: `${makeUrl(settings)}${target}${paramsStarter(query)}${formatParams(
      query,
    )}`,
  };
  return makeRequest<T>(req, codec, token, settings);
}

export function postRequest<U, V>({
  config,
  target,
  value,
  codec,
  query,
  token,
  settings,
}: {
  target: string;
  value: U;
  codec: t.Decoder<unknown, V>;
  query?: QueryParams;
  token?: Token | string;
  settings?: Settings;
  config?: AxiosRequestConfig;
}): TE.TaskEither<Error, V> {
  const req: AxiosRequestConfig = {
    url: `${makeUrl(settings)}${target}${paramsStarter(query)}${formatParams(
      query,
    )}`,
    data: value,
    method: "POST",
    ...(config || {}),
  };
  return makeRequest<V>(req, codec, token, settings);
}
