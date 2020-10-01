import * as t from "io-ts";

import { NullyC } from "../../common/structs";
import { MeasureUnitC } from "./mu";

export const StockC = t.type({
  Giacenza: t.number,
  Disponibilita: t.number,
  UnitaMisura: NullyC(MeasureUnitC),
});
