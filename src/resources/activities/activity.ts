import * as t from "io-ts";
import * as TE from "fp-ts/lib/TaskEither";
import * as Request from "../../common/api/request";
import { links } from "../../common/api";
import { QueryParams, StandardParams } from "../../common/api";
import { ResourceIdC, ResultC } from "../../common/structs";

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

const NewActivityC = t.intersection([
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

// FIXME: issue #2
const ActivityC = ResultC(t.any);

export type NewActivity = t.TypeOf<typeof NewActivityC>;
export type Activity = t.TypeOf<typeof ActivityC>;
export type ActionType = t.TypeOf<typeof ActionTypeC>;

export type StartActivityQuery = QueryParams<"">;

export function start(
  params: StandardParams<StartActivityQuery> & { value: NewActivity },
): TE.TaskEither<Error, Activity> {
  return Request.postRequest<NewActivity, Activity>({
    ...params,
    target: links.activities().start(),
    codec: ActivityC,
  });
}
