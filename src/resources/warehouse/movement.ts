import * as t from "io-ts";
import * as TE from "fp-ts/lib/TaskEither";
import * as Request from "../../common/api/request";
import { links } from "../../common/api";
import { QueryParams, StandardParams } from "../../common/api";
import { ResourceIdC } from "../../common/structs";

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

const MovementC = t.intersection([
  t.type({
    // always required
    TipoCausale: ReasonTypeC,
    Quantita: t.array(t.number),
  }),
  t.union([
    // type of movement
    t.type({ IdArticolo: ResourceIdC }),
    t.type({ IdLotto: ResourceIdC }),
    t.type({ IdSuddivisione: ResourceIdC }),
    t.type({ Matricole: t.array(ResourceIdC) }),
  ]),
  t.partial({
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

export type ReasonType = t.TypeOf<typeof ReasonTypeC>;
export type Movement = t.TypeOf<typeof MovementC>;

type CreateMovementQuery = QueryParams<"">;

export function create(
  params: StandardParams<CreateMovementQuery> & { value: Movement },
): TE.TaskEither<Error, Movement> {
  return Request.postRequest<Movement, Movement>({
    ...params,
    target: links.warehouse().movement().create(),
    codec: MovementC,
  });
}
