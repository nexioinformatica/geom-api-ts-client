import * as t from "io-ts";
import * as TE from "fp-ts/lib/TaskEither";
import * as Request from "../../common/api/request";
import { links } from "../../common/api";
import { QueryParams, StandardParams } from "../../common/api";
import { CollectionDocC } from "../../common/structs";

const ActivityTypeC = t.type({
  IdTipoAttivita: t.number,
  Codice: t.string,
  Descrizione: t.string,
});

const CollectionC = CollectionDocC(ActivityTypeC);

export type ActivityType = t.TypeOf<typeof ActivityTypeC>;
export type Collection = t.TypeOf<typeof CollectionC>;

export type ActivityTypeQuery = QueryParams<
  "IdUnitaOperativa" | "IdMacchina" | "IdFase"
>;

export function getCollection(
  params: StandardParams<ActivityTypeQuery>,
): TE.TaskEither<Error, Collection> {
  return Request.getRequest<Collection>({
    ...params,
    target: links.activities().types().collection(),
    codec: CollectionC,
  });
}
