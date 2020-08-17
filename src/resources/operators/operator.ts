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

export type OperatorsQuery = QueryParams<
  "AbilitatoAPI" | "AbilitatoAttivitaReparto"
>;

export type OperatorQuery = QueryParams<"">;

const Collection = CollectionDocC(OperatorC);
export type Collection = t.TypeOf<typeof Collection>;

const Single = OperatorC;
export type Single = t.TypeOf<typeof Single>;

export function getCollection(
  params: PublicParams<OperatorsQuery>,
): TE.TaskEither<Error, Collection> {
  return Request.getRequest<Collection>({
    ...params,
    target: links.operators().collection(),
    codec: Collection,
  });
}

export function getSingle(
  params: StandardParams<OperatorQuery> & { IdOperatore: number },
): TE.TaskEither<Error, Single> {
  return Request.getRequest<Single>({
    ...params,
    target: links.operators().single(params.IdOperatore),
    codec: Single,
  });
}

export function getMe(
  params: StandardParams<OperatorQuery>,
): TE.TaskEither<Error, Single> {
  return Request.getRequest<Single>({
    ...params,
    target: links.operators().me(),
    codec: Single,
  });
}
