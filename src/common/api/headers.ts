import { addHeader } from "../api/request";

export const empty = {};

export const contentTypeWwwFormUrlencoded = addHeader(
  "Content-Type",
  "application/x-www-form-urlencoded",
);
