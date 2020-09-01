import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";

import { Request } from "../..";
import { links, QueryParams, StandardParams } from "../../common/api";
import { ResourceId, NullableC } from "../../common/structs";

const JobC = t.intersection([
  t.type({
    IdFase: t.number,
    StatoAvanzamento: t.string,
    DescrizioneFase: t.string,
    NumeroPezzi: t.number,
  }),
  t.partial({
    IdPosizione: NullableC(t.number),
    IdTestata: NullableC(t.number),
    CodicePosizione: NullableC(t.string),
    CodiceCommessa: NullableC(t.string),
    DescrizioneProdotto: NullableC(t.string),
    Disegn: NullableC(t.string),
    NumeroOrdineCliente: NullableC(t.string),
    SiglaCliente: NullableC(t.string),
    RegioneSocialeCliente: NullableC(t.string),
  }),
]);

const ActionC = t.intersection([
  t.type({ Codice: t.number }),
  t.partial({ Messaggio: NullableC(t.string) }),
]);

export type Job = t.TypeOf<typeof JobC>;
export type Action = t.TypeOf<typeof ActionC>;

export type EndPhaseQuery = QueryParams<"">;
export type CheckActionQuery = QueryParams<"">;

export function end(
  params: StandardParams<EndPhaseQuery> & {
    IdFase: ResourceId;
  },
): TE.TaskEither<Error, Job> {
  return Request.postRequest<undefined, Job>({
    ...params,
    value: undefined,
    target: links.jobs(params.IdFase).end(),
    codec: JobC,
  });
}

export function checkAction(
  params: StandardParams<CheckActionQuery> & {
    IdFase: ResourceId;
  },
): TE.TaskEither<Error, Action> {
  return Request.getRequest<Action>({
    ...params,
    target: links.jobs(params.IdFase).checkAction(),
    codec: ActionC,
  });
}
