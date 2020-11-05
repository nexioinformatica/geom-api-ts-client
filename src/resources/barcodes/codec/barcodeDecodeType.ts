import * as t from "io-ts";

import { CollectionDocC, NullyC, ResourceIdC } from "../../../common/structs";
import { OperatorC } from "../../operators";
import { MachineC } from "../../machines";
import { BarcodeType } from "./index";
import { StockC } from "../../warehouse/stock";

export const OperatorDecodeC = t.type({
  Tipo: BarcodeType.OperatorDecodeTypeC,
  Oggetto: OperatorC,
});

export const MachineDecodeC = t.type({
  Tipo: BarcodeType.MachineDecodeTypeC,
  Oggetto: MachineC,
});

export const HeaderDecodeC = t.type({
  Tipo: BarcodeType.HeaderDecodeTypeC,
  Oggetto: t.intersection([
    t.type({
      IdTestata: ResourceIdC,
      CodiceProgressivo: t.string,
    }),
    t.partial({
      NumeroOrdineCliente: t.string,
      SiglaCliente: t.string,
      RagioneSocialeCliente: t.string,
    }),
  ]),
});

export const PositionDecodeC = t.type({
  Tipo: BarcodeType.PositionDecodeTypeC,
  Oggetto: t.intersection([
    t.type({
      IdPosizione: ResourceIdC,
      IdTestata: ResourceIdC,
      CodicePosizione: t.string,
      CodiceCommessa: t.string,
      Descrizione: t.string,
      NumeroPezzi: t.number,
    }),
    t.partial({
      NumeroOrdineCliente: t.string,
      SiglaCliente: t.string,
      RagioneSocialeCliente: t.string,
      DataConsegna: t.string,
      Disegno: t.string,
    }),
  ]),
});

export const PhaseDecodeC = t.type({
  Tipo: BarcodeType.PhaseDecodeTypeC,
  Oggetto: t.intersection([
    t.type({
      IdFase: ResourceIdC,
      DescrizioneFase: t.string,
      NumeroPezzi: t.number,
      StatoAvanzamento: t.string,
    }),
    t.partial({
      IdPosizione: ResourceIdC,
      IdTestata: ResourceIdC,
      CodicePosizione: t.string,
      CodiceCommessa: t.string,
      DescrizioneProdotto: t.string,
      Disegn: t.string,
      NumeroOrdineCliente: t.string,
      SiglaCliente: t.string,
      RegioneSocialeCliente: t.string,
    }),
  ]),
});

export const ArticleDecodeC = t.type({
  Tipo: BarcodeType.ArticleDecodeTypeC,
  Oggetto: t.type({
    IdArticolo: ResourceIdC,
    Codice: t.string,
    Descrizione: t.string,
    Tipo: t.string,
    DescrizioneTipo: t.string,
    // Missing UM and Quantita as the spec do not shows the model.
  }),
});

export const FreshmanDecodeC = t.type({
  Tipo: BarcodeType.FreshmanDecodeTypeC,
  Oggetto: t.intersection([
    t.type({
      IdMatricola: ResourceIdC,
      IdArticolo: ResourceIdC,
      Matricola: t.string,
      Attiva: t.boolean,
    }),
    t.partial({
      IdLotto: ResourceIdC,
      Protocollo: t.string,
    }),
  ]),
});

export const LotDecodeC = t.type({
  Tipo: BarcodeType.LotDecodeTypeC,
  Oggetto: t.type({
    IdLotto: ResourceIdC,
    IdArticolo: ResourceIdC,
    Codice: t.string,
    Quantita: CollectionDocC(StockC),
    Descrizione: NullyC(t.string),
  }),
});

export const SubdivisionDecodeC = t.type({
  Tipo: BarcodeType.SubdivisionDecodeTypeC,
  Oggetto: t.type({
    IdSuddivisione: ResourceIdC,
    IdArticolo: ResourceIdC,
    Descrizione: t.string,
    Quantita: StockC,
    IdMatricola: NullyC(ResourceIdC),
  }),
});

export const CollocationDecodeC = t.type({
  Tipo: BarcodeType.CollocationDecodeTypeC,
  Oggetto: t.intersection([
    t.type({
      IdCollocazione: ResourceIdC,
      Codice: t.string,
      CodiceCompleto: t.string,
    }),
    t.partial({
      Descrizione: t.string,
      IdArticolo: t.number,
      IdSuddivisione: t.number,
      IdLotto: t.number,
      IdMatricola: t.number,
      Quantita: StockC,
    }),
  ]),
});

export const ActivityTypeDecodeC = t.type({
  Tipo: BarcodeType.ActivityTypeTypeC,
  Oggetto: t.type({
    IdTipoAttivita: ResourceIdC,
  }),
});
