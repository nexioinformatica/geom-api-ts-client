import * as t from "io-ts";
import { BarcodeType, BarcodeDecodeType } from "./index";
import { CollectionDocC } from "../../../common/structs";

export const SingleBarcodeTypeC = t.union([
  BarcodeType.OperatorDecodeTypeC,
  BarcodeType.MachineDecodeTypeC,
  BarcodeType.HeaderDecodeTypeC,
  BarcodeType.PositionDecodeTypeC,
  BarcodeType.PhaseDecodeTypeC,
  BarcodeType.ArticleDecodeTypeC,
  BarcodeType.FreshmanDecodeTypeC,
  BarcodeType.LotDecodeTypeC,
  BarcodeType.SubdivisionDecodeTypeC,
  BarcodeType.CollocationDecodeTypeC,
  BarcodeType.ActivityTypeTypeC,
]);

export const SingleBarcodeDecodeC = t.union([
  BarcodeDecodeType.OperatorDecodeC,
  BarcodeDecodeType.MachineDecodeC,
  BarcodeDecodeType.HeaderDecodeC,
  BarcodeDecodeType.PositionDecodeC,
  BarcodeDecodeType.PhaseDecodeC,
  BarcodeDecodeType.ArticleDecodeC,
  BarcodeDecodeType.FreshmanDecodeC,
  BarcodeDecodeType.LotDecodeC,
  BarcodeDecodeType.SubdivisionDecodeC,
  BarcodeDecodeType.CollocationDecodeC,
  BarcodeDecodeType.ActivityTypeDecodeC,
]);

export const BarcodeDecodeC = CollectionDocC(SingleBarcodeDecodeC);
