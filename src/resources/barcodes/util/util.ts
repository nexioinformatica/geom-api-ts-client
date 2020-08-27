import * as A from "fp-ts/lib/Array";
import * as O from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import {
  SingleBarcodeDecode,
  BarcodeDecode,
  SingleBarcodeType,
} from "../barcode";

export const getDecode = <T extends SingleBarcodeDecode>(
  barcodeType: SingleBarcodeType,
) => (collection: BarcodeDecode): T | undefined => {
  return pipe(
    collection,
    A.findFirst((x) => x.Tipo === barcodeType),
    O.fold(
      () => undefined,
      (x) => x as T,
    ),
  );
};
