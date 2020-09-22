import * as TE from "fp-ts/lib/TaskEither";
import * as t from "io-ts";

import { Request } from "../..";
import { links, QueryParams, StandardParams } from "../../common/api";
import {
  CollectionDocC,
  NullableC,
  ResourceId,
  ResourceIdC,
  ResultC,
} from "../../common/structs";

const MeasureUnitC = t.type({
  Sigla: t.string,
  Descrizione: t.string,
  IdUnitaMisura: t.number,
});

const QuantityC = t.type({
  Giacenza: t.number,
  Disponibilita: t.number,
  UnitaMisura: MeasureUnitC,
});

const SubdivisionC = t.intersection([
  t.type({
    IdSuddivisione: ResourceIdC,
    IdArticolo: ResourceIdC,
    Descrizione: t.string,
    Quantita: t.array(QuantityC),
  }),
  t.partial({
    IdLotto: NullableC(ResourceIdC),
    IdMatricola: NullableC(ResourceIdC),
  }),
]);

const CollectionC = CollectionDocC(SubdivisionC);

const SizeValueC = t.type({ Sigla: t.string, Valore: t.number });
const NewSubdivisionC = t.intersection([
  t.type({
    IdArticolo: ResourceIdC,
  }),
  t.partial({
    IdForma: NullableC(ResourceIdC),
    Descrizione: NullableC(t.string),
    Dimensioni: NullableC(CollectionDocC(SizeValueC)),
  }),
]);

const NewSubdivisionResultC = ResultC(SubdivisionC);

export type MeasureUnit = t.TypeOf<typeof MeasureUnitC>;
export type Quantity = t.TypeOf<typeof QuantityC>;
export type Subdivision = t.TypeOf<typeof SubdivisionC>;
export type Collection = t.TypeOf<typeof CollectionC>;
export type NewSubdivision = t.TypeOf<typeof NewSubdivisionC>;
export type NewSubdivisionResult = t.TypeOf<typeof NewSubdivisionResultC>;

export type CollectionByFreshmanQuery = QueryParams<"">;
export type CollectionByArticleQuery = QueryParams<"">;
export type SingleQuery = QueryParams<"">;
export type NewSubdivisionQuery = QueryParams<"">;

export function collectionByFreshman(
  params: StandardParams<CollectionByFreshmanQuery> & {
    IdMatricola: ResourceId;
  },
): TE.TaskEither<Error, Collection> {
  return Request.getRequest<Collection>({
    ...params,
    target: links
      .subdivisions()
      .articleFreshman(params.IdMatricola)
      .collection(),
    codec: CollectionC,
  });
}

export function collectionByArticle(
  params: StandardParams<CollectionByArticleQuery> & { IdArticolo: ResourceId },
): TE.TaskEither<Error, Collection> {
  return Request.getRequest<Collection>({
    ...params,
    target: links.subdivisions().article(params.IdArticolo).collection(),
    codec: CollectionC,
  });
}

export function single(
  params: StandardParams<SingleQuery> & { IdSuddivisione: ResourceId },
): TE.TaskEither<Error, Subdivision> {
  return Request.getRequest<Subdivision>({
    ...params,
    target: links
      .subdivisions()
      .articleSubdivision()
      .single(params.IdSuddivisione),
    codec: SubdivisionC,
  });
}

export function create(
  params: StandardParams<NewSubdivisionQuery> & {
    value: NewSubdivision;
  },
): TE.TaskEither<Error, NewSubdivisionResult> {
  return Request.postRequest<NewSubdivision, NewSubdivisionResult>({
    ...params,
    target: links.subdivisions().articleSubdivision().create(),
    codec: NewSubdivisionResultC,
  });
}
