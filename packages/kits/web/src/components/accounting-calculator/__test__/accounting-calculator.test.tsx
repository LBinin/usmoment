import { describe, expect, it } from "vitest";
import { AccountingCalculator } from "..";

describe("AccountingCalculator", () => {
  it("exports the single web accounting calculator kit component", () => {
    expect(typeof AccountingCalculator).toBe("function");
  });
});
