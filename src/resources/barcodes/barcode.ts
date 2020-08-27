import * as t from "io-ts";
import * as TE from "fp-ts/lib/TaskEither";
import * as Request from "../../common/api/request";
import { links } from "../../common/api";
import { QueryParams } from "../../common/api";
import { Codec } from "./.";
import {
  SingleBarcodeTypeC,
  SingleBarcodeDecodeC,
  BarcodeDecodeC,
  CodeC,
  BarcodeDecodeType,
} from "./codec";

// basic types
export type Code = t.TypeOf<typeof CodeC>;
export type BarcodeDecode = t.TypeOf<typeof BarcodeDecodeC>;

// single (union) types for decode
export type SingleBarcodeType = t.TypeOf<typeof SingleBarcodeTypeC>;
export type SingleBarcodeDecode = t.TypeOf<typeof SingleBarcodeDecodeC>;

// specific type for decode
export type OperatorDecode = t.TypeOf<typeof BarcodeDecodeType.OperatorDecodeC>;
export type MachineDecode = t.TypeOf<typeof BarcodeDecodeType.MachineDecodeC>;
export type HeaderDecode = t.TypeOf<typeof BarcodeDecodeType.HeaderDecodeC>;
export type PositionDecode = t.TypeOf<typeof BarcodeDecodeType.PositionDecodeC>;
export type PhaseDecode = t.TypeOf<typeof BarcodeDecodeType.PhaseDecodeC>;
export type ArticleDecode = t.TypeOf<typeof BarcodeDecodeType.ArticleDecodeC>;
export type FreshmanDecode = t.TypeOf<typeof BarcodeDecodeType.FreshmanDecodeC>;
export type LotDecode = t.TypeOf<typeof BarcodeDecodeType.LotDecodeC>;
export type SubdivisionDecode = t.TypeOf<
  typeof BarcodeDecodeType.SubdivisionDecodeC
>;
export type CollocationDecode = t.TypeOf<
  typeof BarcodeDecodeType.CollocationDecodeC
>;
export type ActivityTypeDecode = t.TypeOf<
  typeof BarcodeDecodeType.ActivityTypeDecodeC
>;

// query related
export type BarcodeDecodeQuery = QueryParams<"">;

export function decode(
  params: Request.PublicParams<BarcodeDecodeQuery> & { value: Code },
): TE.TaskEither<Error, BarcodeDecode> {
  return Request.postRequest<Code, BarcodeDecode>({
    ...params,
    target: links.barcode_decode(),
    codec: Codec.BarcodeDecodeC,
  });
}
