import * as Auth from "./auth";
import * as Request from "./common/api";

import * as Activities from "./resources/activities";
import * as Authentication from "./resources/authentication";
import * as Barcode from "./resources/barcodes";
import * as Operator from "./resources/operators";
import * as Warehouse from "./resources/warehouse";
import * as Machine from "./resources/machines";
import * as Shape from "./resources/shapes";
import * as Subdivision from "./resources/subdivisions";
import * as Job from "./resources/jobs";

export {
  // api common
  Request,
  Auth,
  // resources
  Activities,
  Authentication,
  Barcode,
  Job,
  Machine,
  Operator,
  Shape,
  Subdivision,
  Warehouse,
};
