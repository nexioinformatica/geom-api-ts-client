import * as t from "io-ts";
import * as TE from "fp-ts/lib/TaskEither";
import { links, QueryParams, StandardParams } from "../../common/api";
import { CollectionDocC, ResourceId, ResourceIdC } from "../../common/structs";
import { Request } from "../..";

const SizeC = t.type({
  Sigla: t.string,
  Descrizione: t.string,
  UM: t.string,
});

const ShapeC = t.type({
  IdForma: ResourceIdC,
  Descrizione: t.string,
  Dimensioni: CollectionDocC(SizeC),
});

const CollectionC = CollectionDocC(ShapeC);

export type Size = t.TypeOf<typeof SizeC>;
export type Shape = t.TypeOf<typeof ShapeC>;
export type Collection = t.TypeOf<typeof CollectionC>;

export type CollectionQuery = QueryParams<"">;
export type SingleQuery = QueryParams<"">;

export function collection(
  params: StandardParams<CollectionQuery> & {
    IdArticolo?: ResourceId;
  },
): TE.TaskEither<Error, Collection> {
  return Request.getRequest<Collection>({
    ...params,
    target: links.shapes().collection(),
    codec: CollectionC,
  });
}

export function single(
  params: StandardParams<SingleQuery> & { IdForma: ResourceId },
): TE.TaskEither<Error, Shape> {
  return Request.getRequest<Shape>({
    ...params,
    target: links.shapes().single(params.IdForma),
    codec: ShapeC,
  });
}
