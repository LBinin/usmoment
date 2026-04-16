import { describe, expect, it } from "vitest";
import { AccountingCalcKit } from "../src";

describe("AccountingCalcKit", () => {
  it("exports kit component", () => {
    expect(typeof AccountingCalcKit).toBe("function");
  });
});
