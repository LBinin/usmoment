import { describe, expect, it } from "vitest";
import { CalcKeyboard } from "..";

describe("CalcKeyboard", () => {
  it("exports component", () => {
    expect(typeof CalcKeyboard).toBe("function");
  });
});
