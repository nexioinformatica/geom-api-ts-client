import * as t from "io-ts";
import { BarcodeType } from "./index";
import { ResourceIdC } from "../../../common/structs";

export const OperatorDecodeC = t.type({
  Tipo: BarcodeType.OperatorDecodeTypeC,
  Oggetto: t.type({
    IdOperatore: ResourceIdC,
  }),
});

export const MachineDecodeC = t.type({
  Tipo: BarcodeType.MachineDecodeTypeC,
  Oggetto: t.type({
    IdMacchina: ResourceIdC,
  }),
});

export const HeaderDecodeC = t.type({
  Tipo: BarcodeType.HeaderDecodeTypeC,
  Oggetto: t.type({
    IdTestata: ResourceIdC,
  }),
});

export const PositionDecodeC = t.type({
  Tipo: BarcodeType.PositionDecodeTypeC,
  Oggetto: t.type({
    IdPosizione: ResourceIdC,
  }),
});

export const PhaseDecodeC = t.type({
  Tipo: BarcodeType.PhaseDecodeTypeC,
  Oggetto: t.type({
    IdFase: ResourceIdC,
  }),
});

export const ArticleDecodeC = t.type({
  Tipo: BarcodeType.ArticleDecodeTypeC,
  Oggetto: t.type({
    IdArticolo: ResourceIdC,
  }),
});

export const FreshmanDecodeC = t.type({
  Tipo: BarcodeType.FreshmanDecodeTypeC,
  Oggetto: t.type({
    IdMatricola: ResourceIdC,
  }),
});

export const LotDecodeC = t.type({
  Tipo: BarcodeType.LotDecodeTypeC,
  Oggetto: t.type({
    IdLotto: ResourceIdC,
  }),
});

export const SubdivisionDecodeC = t.type({
  Tipo: BarcodeType.SubdivisionDecodeTypeC,
  Oggetto: t.type({
    IdSuddivisione: ResourceIdC,
  }),
});

export const CollocationDecodeC = t.type({
  Tipo: BarcodeType.CollocationDecodeTypeC,
  Oggetto: t.type({
    IdCollocazione: ResourceIdC,
  }),
});

export const ActivityTypeDecodeC = t.type({
  Tipo: BarcodeType.ActivityTypeTypeC,
  Oggetto: t.type({
    IdTipoAttivita: ResourceIdC,
  }),
});
