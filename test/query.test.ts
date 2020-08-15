import { formatParams, paramsStarter } from "../src/common/api/query";

describe("format parameters", () => {
  test("it returns empty string if undefined query", () => {
    expect(formatParams(undefined)).toBe("");
  });

  test("it returns string with empty params if undefined", () => {
    expect(formatParams({ query: { foo: "apple", baz: undefined } })).toBe(
      "foo=apple&baz=",
    );
  });

  test("it returns string with all primite types", () => {
    expect(formatParams({ query: { foo: "apple", bar: 1, baz: false } })).toBe(
      "foo=apple&bar=1&baz=false",
    );
  });

  test("it returns params starter if query", () => {
    expect(paramsStarter({ query: { foo: "apple" } })).toBe("?");
  });

  test("it returns nothing if not query", () => {
    expect(paramsStarter(undefined)).toBe("");
  });
});
