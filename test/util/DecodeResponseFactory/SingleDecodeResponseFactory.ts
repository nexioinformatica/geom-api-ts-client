import * as t from "io-ts";

import { Barcode } from "../../../src";
import { DecodeResponseFactory } from "./DecodeResponseFactory";

export type SingleDecodeResponseFactory = DecodeResponseFactory<
  Barcode.SingleBarcodeDecode
>;

export const getSingleBarcodeResponseFactoryList = (): SingleDecodeResponseFactory[] => [
  new OperatorSingleDecodeResponseFactory(),
  new MachineSingleDecodeResponseFactory(),
  new HeaderSingleDecodeResponseFactory(),
  new PositionSingleDecodeResponseFactory(),
  new PhaseSingleDecodeResponseFactory(),
  new ArticleSingleDecodeResponseFactory(),
  new FreshmanSingleDecodeResponseFactory(),
  new LotSingleDecodeResponseFactory(),
  new SubdivisionSingleDecodeResponseFactory(),
  new CollocationSingleDecodeResponseFactory(),
  new ActivityTypeSingleDecodeResponseFactory(),
];

export abstract class AbstractSingleDecodeResponseFactory
  implements SingleDecodeResponseFactory {
  input(): unknown {
    return this.output();
  }
  abstract output(): Barcode.SingleBarcodeDecode;
  abstract codec(): t.Decoder<unknown, Barcode.SingleBarcodeDecode>;
}

export class OperatorSingleDecodeResponseFactory extends AbstractSingleDecodeResponseFactory {
  output() {
    return {
      Tipo: "O",
      Oggetto: {
        IdOperatore: 1,
        Nome: "foo",
        UserName: "baz",
        Attivo: true,
        AbilitatoAPI: false,
        AbilitatoAttivitaReparto: false,
      },
    } as Barcode.OperatorDecode;
  }
  codec() {
    return Barcode.Codec.BarcodeDecodeType.OperatorDecodeC as t.Decoder<
      unknown,
      Barcode.OperatorDecode
    >;
  }
}

export class MachineSingleDecodeResponseFactory extends AbstractSingleDecodeResponseFactory {
  private id: number;

  constructor(id: number = 1) {
    super();
    this.id = id;
  }

  output() {
    return {
      Tipo: "M",
      Oggetto: { IdMacchina: this.id, Codice: "foo", Descrizione: "test" },
    } as Barcode.MachineDecode;
  }
  codec() {
    return Barcode.Codec.BarcodeDecodeType.MachineDecodeC as t.Decoder<
      unknown,
      Barcode.MachineDecode
    >;
  }
}

export class HeaderSingleDecodeResponseFactory extends AbstractSingleDecodeResponseFactory {
  output() {
    return {
      Tipo: "T",
      Oggetto: { IdTestata: 1, CodiceProgressivo: "123" },
    } as Barcode.HeaderDecode;
  }
  codec() {
    return Barcode.Codec.BarcodeDecodeType.HeaderDecodeC as t.Decoder<
      unknown,
      Barcode.HeaderDecode
    >;
  }
}

export class PositionSingleDecodeResponseFactory extends AbstractSingleDecodeResponseFactory {
  output() {
    return {
      Tipo: "P",
      Oggetto: {
        IdPosizione: 1,
        CodiceCommessa: "JOB1",
        CodicePosizione: "POS1",
        Descrizione: "test",
        IdTestata: 52,
        NumeroPezzi: 4,
      },
    } as Barcode.PositionDecode;
  }
  codec() {
    return Barcode.Codec.BarcodeDecodeType.PositionDecodeC as t.Decoder<
      unknown,
      Barcode.PositionDecode
    >;
  }
}

export class PhaseSingleDecodeResponseFactory extends AbstractSingleDecodeResponseFactory {
  output() {
    return {
      Tipo: "F",
      Oggetto: {
        IdFase: 1,
        NumeroPezzi: 7,
        DescrizioneFase: "foo",
        StatoAvanzamento: "completed",
      },
    } as Barcode.PhaseDecode;
  }
  codec() {
    return Barcode.Codec.BarcodeDecodeType.PhaseDecodeC as t.Decoder<
      unknown,
      Barcode.PhaseDecode
    >;
  }
}

export class ArticleSingleDecodeResponseFactory extends AbstractSingleDecodeResponseFactory {
  output() {
    return {
      Tipo: "A",
      Oggetto: {
        IdArticolo: 1,
        Codice: "ART1",
        Descrizione: "foo",
        DescrizioneTipo: "baz",
        Tipo: "T1",
      },
    } as Barcode.ArticleDecode;
  }
  codec() {
    return Barcode.Codec.BarcodeDecodeType.ArticleDecodeC as t.Decoder<
      unknown,
      Barcode.ArticleDecode
    >;
  }
}

export class FreshmanSingleDecodeResponseFactory extends AbstractSingleDecodeResponseFactory {
  output() {
    return {
      Tipo: "R",
      Oggetto: {
        IdMatricola: 1,
        IdArticolo: 4,
        Matricola: "R1",
        Attiva: false,
      },
    } as Barcode.FreshmanDecode;
  }
  codec() {
    return Barcode.Codec.BarcodeDecodeType.FreshmanDecodeC as t.Decoder<
      unknown,
      Barcode.FreshmanDecode
    >;
  }
}

export class LotSingleDecodeResponseFactory extends AbstractSingleDecodeResponseFactory {
  output() {
    return {
      Tipo: "L",
      Oggetto: {
        IdLotto: 1,
        IdArticolo: 78,
        Codice: "LOT1",
        Descrizione: "foo",
        Quantita: [],
      },
    } as Barcode.LotDecode;
  }
  codec() {
    return Barcode.Codec.BarcodeDecodeType.LotDecodeC as t.Decoder<
      unknown,
      Barcode.LotDecode
    >;
  }
}

export class SubdivisionSingleDecodeResponseFactory extends AbstractSingleDecodeResponseFactory {
  output() {
    return {
      Tipo: "S",
      Oggetto: {
        IdSuddivisione: 1,
        IdArticolo: 5,
        IdMatricola: 66,
        Descrizione: "foo",
        Quantita: [
          {
            Disponibilita: 1,
            Giacenza: 8,
            UnitaMisura: {
              IdUnitaMisura: 7,
              Descrizione: "meters",
              Sigla: "m",
            },
          },
        ],
      },
    } as Barcode.SubdivisionDecode;
  }
  codec() {
    return Barcode.Codec.BarcodeDecodeType.SubdivisionDecodeC as t.Decoder<
      unknown,
      Barcode.SubdivisionDecode
    >;
  }
}

export class CollocationSingleDecodeResponseFactory extends AbstractSingleDecodeResponseFactory {
  output() {
    return {
      Tipo: "C",
      Oggetto: { IdCollocazione: 1, Codice: "C", CodiceCompleto: "CC" },
    } as Barcode.CollocationDecode;
  }
  codec() {
    return Barcode.Codec.BarcodeDecodeType.CollocationDecodeC as t.Decoder<
      unknown,
      Barcode.CollocationDecode
    >;
  }
}

export class MismatchSingleDecodeResponseFactory extends AbstractSingleDecodeResponseFactory {
  input() {
    return {
      Tipo: "C",
      Oggetto: { OtherField: 1 },
    } as unknown;
  }
  output() {
    return {
      Tipo: "C",
      Oggetto: { IdCollocazione: 1 },
    } as Barcode.CollocationDecode;
  }
  codec() {
    return Barcode.Codec.BarcodeDecodeType.CollocationDecodeC as t.Decoder<
      unknown,
      Barcode.CollocationDecode
    >;
  }
}

export class ActivityTypeSingleDecodeResponseFactory extends AbstractSingleDecodeResponseFactory {
  output() {
    return {
      Tipo: "V",
      Oggetto: { IdTipoAttivita: 1 },
    } as Barcode.ActivityTypeDecode;
  }
  codec() {
    return Barcode.Codec.BarcodeDecodeType.ActivityTypeDecodeC as t.Decoder<
      unknown,
      Barcode.ActivityTypeDecode
    >;
  }
}
