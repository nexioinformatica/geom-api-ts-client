import * as t from "io-ts";
import * as TE from "fp-ts/lib/TaskEither";
import * as Request from "../../common/api/request";
import { links } from "../../common/api";
import { QueryParams, StandardParams } from "../../common/api";
import { ResourceIdC, ResultC } from "../../common/structs";

export enum ReasonTypeKey {
  Specified = 0, // Specificata
  UnloadProd = 1, // Scarico per Produzione
  LoadProd = 2, // Carico da Produzione
  LoadRemnant = 3, // Carico Avanzo
  LoadScrap = 4, // Carico Scarto
}

const ReasonTypeC = t.union([
  t.literal(ReasonTypeKey.Specified),
  t.literal(ReasonTypeKey.UnloadProd),
  t.literal(ReasonTypeKey.LoadProd),
  t.literal(ReasonTypeKey.LoadRemnant),
  t.literal(ReasonTypeKey.LoadScrap),
]);

const NewMovementC = t.intersection([
  // FIXME: the logic of this object isn't weel specified on
  // the API docs (see issue #2).
  t.type({
    // always required
    TipoCausale: ReasonTypeC,
    Quantita: t.array(t.number),
  }),
  t.partial({
    // type of movement (may be in union)
    IdArticolo: ResourceIdC,
    IdLotto: ResourceIdC,
    IdSuddivisione: ResourceIdC,
    Matricole: t.array(ResourceIdC),
    // details
    IdCausale: ResourceIdC,
    IdCollocazione: ResourceIdC,
    IdAttivitaOperatore: ResourceIdC,
    IdAttivitaMacchina: ResourceIdC,
    IdTestata: ResourceIdC,
    IdPosizione: ResourceIdC,
    IdFase: ResourceIdC,
    Note: t.string,
  }),
]);

// FIXME: t.any is due to the same shitty problem as before (issue #2).
const MovementC = ResultC(t.any);

export type ReasonType = t.TypeOf<typeof ReasonTypeC>;
export type NewMovement = t.TypeOf<typeof NewMovementC>;
export type Movement = t.TypeOf<typeof MovementC>;

type CreateMovementQuery = QueryParams<"">;

export function create(
  params: StandardParams<CreateMovementQuery> & { value: NewMovement },
): TE.TaskEither<Error, Movement> {
  return Request.postRequest<NewMovement, Movement>({
    ...params,
    target: links.warehouse().movement().create(),
    codec: MovementC,
  });
}
