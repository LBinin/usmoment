import { describe, expect, it } from "vitest";
import { AccountingCalcKit } from "..";

describe("AccountingCalcKit", () => {
  it("exports kit component", () => {
    expect(typeof AccountingCalcKit).toBe("function");
  });
});
