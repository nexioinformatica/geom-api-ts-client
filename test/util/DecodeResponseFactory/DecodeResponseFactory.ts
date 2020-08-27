import * as t from "io-ts";

export interface DecodeResponseFactory<T> {
  input(): unknown;
  output(): T;
  codec(): t.Decoder<unknown, T>;
}
