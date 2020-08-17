import * as t from "io-ts";
import * as TE from "fp-ts/lib/TaskEither";
import * as Request from "../../common/api/request";
import { links } from "../../common/api";
import { QueryParams, StandardParams } from "../../common/api";
import { ResourceIdC } from "../../common/structs";

export enum ActionTypeKey {
  MachineAndOperator = 1,
  Machine = 2,
  Operator = 3,
}

const ActionTypeC = t.union([
  t.literal(ActionTypeKey.MachineAndOperator),
  t.literal(ActionTypeKey.Machine),
  t.literal(ActionTypeKey.Operator),
]);

const ActivityC = t.intersection([
  t.type({
    TipoAzione: ActionTypeC,
    IdTipoAttivita: ResourceIdC,
  }),
  t.partial({
    IdUnitaOperativa: ResourceIdC,
    IdMacchina: ResourceIdC,
    IdTestataOrdine: ResourceIdC,
    IdPosizioneOrdine: ResourceIdC,
    IdFaseLavorazioneOrdine: ResourceIdC,
  }),
]);

export type Activity = t.TypeOf<typeof ActivityC>;

export type StartActivityQuery = QueryParams<"">;

export function start(
  params: StandardParams<StartActivityQuery> & { value: Activity },
): TE.TaskEither<Error, Activity> {
  return Request.postRequest<Activity, Activity>({
    ...params,
    target: links.activities().start(),
    codec: ActivityC,
  });
}
