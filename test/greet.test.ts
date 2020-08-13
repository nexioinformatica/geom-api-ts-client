import { greet } from "../src";

test("My Greeter", () => {
  expect(greet("Carl")).toBe("Hello Carl");
});
