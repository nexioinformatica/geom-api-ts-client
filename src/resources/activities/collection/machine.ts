import * as t from "io-ts";
import * as TE from "fp-ts/lib/TaskEither";
import * as Request from "../../../common/api/request";
import { links } from "../../../common/api";
import { QueryParams, StandardParams } from "../../../common/api";
import {
  ResourceIdC,
  ResourceId,
  DateFromStringC,
  CollectionDocC,
  NullableC,
} from "../../../common/structs";

const MachineActivityC = t.intersection([
  t.type({
    IdAttivitaMacchina: ResourceIdC,
    IdMacchina: ResourceIdC,
    IdTipoAttivita: ResourceIdC,
    IdOperatoreInizio: ResourceIdC,
    DataOraInizio: DateFromStringC,
    Descrizione: t.string,
  }),
  t.partial({
    IdTestataOrdineEsecutivo: NullableC(ResourceIdC),
    IdPosizioneOrdineEsecutivo: NullableC(ResourceIdC),
    IdFaseLavorazione: NullableC(ResourceIdC),
    IdOperatoreFine: NullableC(ResourceIdC),
    DataOraFine: NullableC(DateFromStringC),
    DurataMinuti: NullableC(t.number),
    // TODO: AttivitàOperatoriAssociate (see issue #3)
    AttivitàOperatoriAssociate: t.unknown,
  }),
]);

const CollectionC = CollectionDocC(MachineActivityC);

export type MachineActivity = t.TypeOf<typeof MachineActivityC>;
export type MachineCollection = t.TypeOf<typeof CollectionC>;

export type MachineActivitiesQuery = QueryParams<"">;

export function collectionByMachine(
  params: StandardParams<MachineActivitiesQuery> & { IdMacchina: ResourceId },
): TE.TaskEither<Error, MachineCollection> {
  return Request.getRequest<MachineCollection>({
    ...params,
    target: links.activities().collection().machine(params.IdMacchina),
    codec: CollectionC,
  });
}
