/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { ResourceId } from "../structs";

/**
 * All available endpoints for GeOM APIs.
 */
export const links = {
  operators: () => ({
    collection: () => "/operatori",
    single: (id: ResourceId) => `/operatori/${id}`,
    me: () => "/operatori/me",
  }),
  barcode_decode: () => "/barcode-decode",
  warehouse: () => ({
    movement: () => ({
      create: () => "/movimenti-magazzino",
    }),
  }),
};
