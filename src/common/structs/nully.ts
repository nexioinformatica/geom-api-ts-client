import * as t from "io-ts";

/**
 * Either a generic type T, null, undefined.
 */
export const NullyC = <C extends t.Mixed>(
  codec: C,
): t.UnionC<[C, t.NullC, t.UndefinedC]> =>
  t.union([codec, t.null, t.undefined]);
