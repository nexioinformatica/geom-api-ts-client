/**
 * Parameters used to narrow down a query,
 * passed into an API request function
 */
export interface QueryParams<
  /** Filters */
  F extends string = string
> {
  /**
   * Query params object, i.e., {foo: "dog", bar: 1, baz: true}.
   */
  query?: Partial<Record<F, string | number | boolean>>;
}

export function formatParams(q: QueryParams | undefined): string {
  if (!q) {
    return "";
  }

  const obj = q.query;

  const str = [];
  for (const p in obj) {
    const v = obj[p] !== undefined ? (obj[p] as string | number | boolean) : "";
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(v));
  }
  return str.join("&");
}

export function paramsStarter(q: QueryParams | undefined): string {
  if (!q) {
    return "";
  }

  return "?";
}
