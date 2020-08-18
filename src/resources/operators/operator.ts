import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";
import { QueryParams, PublicParams, StandardParams } from "../../common/api";
import { links } from "../../common/api";
import * as Request from "../../common/api/request";
import { CollectionDocC } from "../../common/structs";

const OperatorC = t.type(
  {
    IdOperatore: t.number,
    Nome: t.string,
    UserName: t.union([t.string, t.undefined]),
    Attivo: t.boolean,
    AbilitatoAPI: t.boolean,
    AbilitatoAttivitaReparto: t.boolean,
  },
  "OperatorC",
);

const CollectionC = CollectionDocC(OperatorC);

const SingleC = OperatorC;

export type Barcode = t.TypeOf<typeof OperatorC>;
export type Collection = t.TypeOf<typeof CollectionC>;
export type Single = t.TypeOf<typeof SingleC>;

export type OperatorsQuery = QueryParams<
  "AbilitatoAPI" | "AbilitatoAttivitaReparto"
>;
export type OperatorQuery = QueryParams<"">;

export function getCollection(
  params: PublicParams<OperatorsQuery>,
): TE.TaskEither<Error, Collection> {
  return Request.getRequest<Collection>({
    ...params,
    target: links.operators().collection(),
    codec: CollectionC,
  });
}

export function getSingle(
  params: StandardParams<OperatorQuery> & { IdOperatore: number },
): TE.TaskEither<Error, Single> {
  return Request.getRequest<Single>({
    ...params,
    target: links.operators().single(params.IdOperatore),
    codec: SingleC,
  });
}

export function getMe(
  params: StandardParams<OperatorQuery>,
): TE.TaskEither<Error, Single> {
  return Request.getRequest<Single>({
    ...params,
    target: links.operators().me(),
    codec: SingleC,
  });
}
