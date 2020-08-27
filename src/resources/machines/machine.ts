import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import { QueryParams, StandardParams } from "../../common/api";
import { links } from "../../common/api";
import * as Request from "../../common/api/request";
import { CollectionDocC, ResourceIdC } from "../../common/structs";

const MachineC = t.type(
  {
    IdMacchina: ResourceIdC,
    Codice: t.string,
    Descrizione: t.string,
  },
  "MachineC",
);

const CollectionC = CollectionDocC(MachineC);

const SingleC = MachineC;

export type Machine = t.TypeOf<typeof MachineC>;
export type Collection = t.TypeOf<typeof CollectionC>;
export type Single = t.TypeOf<typeof SingleC>;

export type MachinesQuery = QueryParams<"">;
export type MachineQuery = QueryParams<"">;

export function getCollection(
  params: StandardParams<MachinesQuery>,
): TE.TaskEither<Error, Collection> {
  return Request.getRequest<Collection>({
    ...params,
    target: links.machines().collection(),
    codec: CollectionC,
  });
}

export function getSingle(
  params: StandardParams<MachineQuery> & { IdMacchina: number },
): TE.TaskEither<Error, Single> {
  return Request.getRequest<Single>({
    ...params,
    target: links.machines().single(params.IdMacchina),
    codec: SingleC,
  });
}
