import * as t from "io-ts";
import * as TE from "fp-ts/lib/TaskEither";
import * as Request from "../../common/api/request";
import { links } from "../../common/api";
import { QueryParams, StandardParams } from "../../common/api";

const BarcodeDecodeTypeC = t.union([
  t.literal("O"), // Operatore
  t.literal("M"), // Macchina
  t.literal("T"), // Testata dell’Ordine Esecutivo
  t.literal("P"), // Posizione dell’Ordine Esecutivo
  t.literal("F"), // Fase di Lavorazione
  t.literal("A"), // Articolo
  t.literal("M"), // Matricola
  t.literal("L"), // Lotto
  t.literal("S"), // Suddivisione
  t.literal("C"), // Collocazione
]);

const FreshmanC = t.any;

const BarcodeDecodeC = t.type({
  Tipo: BarcodeDecodeTypeC,
  Id: FreshmanC,
});

const CodeC = t.type({
  Code: t.string,
});

type Code = t.TypeOf<typeof CodeC>;
type BarcodeDecode = t.TypeOf<typeof BarcodeDecodeC>;

type BarcodeDecodeQuery = QueryParams<"">;

export function decode(
  params: StandardParams<BarcodeDecodeQuery> & { value: Code },
): TE.TaskEither<Error, BarcodeDecode> {
  return Request.postRequest<Code, BarcodeDecode>({
    ...params,
    target: links.barcode_decode(),
    codec: BarcodeDecodeC,
  });
}
