import * as t from "io-ts";

import { NullyC } from "../../common/structs";

export const MeasureUnitC = t.type({
  IdUnitaMisura: t.number,
  Sigla: t.string,
  Descrizione: NullyC(t.string),
});
