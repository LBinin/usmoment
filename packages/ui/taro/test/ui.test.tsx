import { describe, expect, it } from "vitest";
import { CalcKeyboard } from "../src";

describe("CalcKeyboard", () => {
  it("exports component", () => {
    expect(typeof CalcKeyboard).toBe("function");
  });
});
