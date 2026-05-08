import { describe, expect, it, vi } from "vitest";
import {
  AccountingCalculator,
  BusinessKeyboard,
  createExpressionEngine,
} from "../src";

vi.mock("@tarojs/components", () => ({
  Button: "button",
  Text: "span",
  View: "div",
}));

describe("@usmoment/taro public api", () => {
  it("exports the primary user-facing components from the root entry", () => {
    expect(typeof AccountingCalculator).toBe("function");
    expect(typeof BusinessKeyboard).toBe("function");
  });

  it("exports common headless capabilities without exposing package layers", () => {
    expect(typeof createExpressionEngine).toBe("function");
  });
});
