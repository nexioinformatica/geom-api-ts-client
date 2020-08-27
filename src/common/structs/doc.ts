import * as t from "io-ts";
import { DateFromISOString } from "io-ts-types/lib/DateFromISOString";

export const ResourceIdC = t.number;
export type ResourceId = t.TypeOf<typeof ResourceIdC>;

// Note: we do not find a way to export the CollectionDoc type with
// t.TypeOf construct, so we opted to export the instantiated type.
export const CollectionDocC = <C extends t.Mixed>(codec: C): t.ArrayC<C> =>
  t.array(codec);

export const ResultC = <C extends t.Mixed>(
  codec: C,
): t.TypeC<{
  Code: t.NumberC;
  Messaggio: t.UnionC<[t.StringC, t.NullC]>;
  Oggetto: C;
}> =>
  t.type(
    {
      Code: t.number,
      Messaggio: t.union([t.string, t.null]),
      Oggetto: codec,
    },
    "ResultC",
  );

export const NullableC = <C extends t.Mixed>(
  codec: C,
): t.UnionC<[C, t.NullC]> => t.union([codec, t.null]);

export const DateFromStringC = DateFromISOString;
