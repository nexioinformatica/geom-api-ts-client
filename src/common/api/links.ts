/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { ResourceId } from "../structs";

/**
 * All available endpoints for GeOM APIs.
 */
export const links = {
  auth: () => ({
    token: () => "/token",
  }),
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
    reasons: () => ({
      collection: () => "/causali-magazzino",
    }),
  }),
  activities: () => ({
    start: () => "/attivita/start",
    types: () => ({
      collection: () => "/tipi-attivita",
    }),
    collection: () => ({
      operator: (id: ResourceId) => `/operatori/${id}/attivita`,
      machine: (id: ResourceId) => `/macchine/${id}/attivita`,
    }),
  }),
  machines: () => ({
    collection: () => "/macchine",
    single: (id: ResourceId) => `/macchine/${id}`,
  }),
};
