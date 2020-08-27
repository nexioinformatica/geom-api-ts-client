import * as t from "io-ts";
import * as TE from "fp-ts/lib/TaskEither";
import * as Request from "../../common/api/request";
import { links } from "../../common/api";
import { QueryParams, StandardParams } from "../../common/api";
import {
  ResourceIdC,
  ResourceId,
  DateFromStringC,
  CollectionDocC,
  NullableC,
} from "../../common/structs";

const OperatorActivityC = t.intersection([
  t.type({
    IdAttivitaOperatore: ResourceIdC,
    IdOperatore: ResourceIdC,
    IdTipoAttivita: ResourceIdC,
    DataOraInizio: DateFromStringC,
    Descrizione: t.string,
  }),
  t.partial({
    IdTestataOrdineEsecutivo: NullableC(ResourceIdC),
    IdPosizioneOrdineEsecutivo: NullableC(ResourceIdC),
    IdFaseLavorazione: NullableC(ResourceIdC),
    IdManutenzione: NullableC(ResourceIdC),
    DataOraFine: NullableC(DateFromStringC),
    DurataMinuti: NullableC(t.number),
    // TODO: AttivitaMacchinaAssociata (see issue #3)
    AttivitaMacchinaAssociata: t.unknown,
  }),
]);

const CollectionC = CollectionDocC(OperatorActivityC);

export type OperatorActivity = t.TypeOf<typeof OperatorActivityC>;
export type OperatorCollection = t.TypeOf<typeof CollectionC>;

export type OperatorActivitiesQuery = QueryParams<"">;

export function collectionByOperator(
  params: StandardParams<OperatorActivitiesQuery> & { IdOperatore: ResourceId },
): TE.TaskEither<Error, OperatorCollection> {
  return Request.getRequest<OperatorCollection>({
    ...params,
    target: links.activities().operator().collection(params.IdOperatore),
    codec: CollectionC,
  });
}
