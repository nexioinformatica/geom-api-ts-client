import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";

import { links, QueryParams } from "../../common/api";
import * as Request from "../../common/api/request";
import { CollectionDocC, ResourceIdC } from "../../common/structs";

const ReasonC = t.type({
  IdCausale: ResourceIdC,
  Codice: t.string,
  Descrizione: t.string,
});

const CollectionC = CollectionDocC(ReasonC);

export type Reason = t.TypeOf<typeof ReasonC>;
export type Collection = t.TypeOf<typeof CollectionC>;

export type ReasonsQuery = QueryParams<"">;

export function getCollection(
  params: Request.StandardParams<ReasonsQuery>,
): TE.TaskEither<Error, Collection> {
  return Request.getRequest<Collection>({
    ...params,
    target: links.warehouse().reasons().collection(),
    codec: CollectionC,
  });
}
