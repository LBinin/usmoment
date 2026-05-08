import { describe, expect, it, vi } from "vitest";
import { AccountingCalculator } from "..";

vi.mock("@tarojs/components", () => ({
  Button: "button",
  Text: "span",
  View: "div",
}));

describe("AccountingCalculator", () => {
  it("exports the single accounting calculator kit component", () => {
    expect(typeof AccountingCalculator).toBe("function");
  });
});
