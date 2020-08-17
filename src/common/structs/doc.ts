import * as t from "io-ts";

export const ResourceIdC = t.number;
export type ResourceId = t.TypeOf<typeof ResourceIdC>;

// Note: we do not find a way to export the CollectionDoc type with
// t.TypeOf construct, so we opted to export the instantiated type.
export const CollectionDocC = <C extends t.Mixed>(codec: C): t.ArrayC<C> =>
  t.array(codec);
