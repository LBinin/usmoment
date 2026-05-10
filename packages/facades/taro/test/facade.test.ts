import { describe, expect, it, vi } from "vitest";
import * as headless from "../src/headless";
import * as ui from "../src/ui";
import * as kit from "../src/kit";

vi.mock("@tarojs/components", () => ({
  Button: "button",
  Input: "input",
  Text: "span",
  View: "div",
}));

describe("@usmoment/taro facade", () => {
  it("re-exports headless modules", () => {
    expect(typeof headless.createExpressionEngine).toBe("function");
    expect(typeof headless.createSelectionState).toBe("function");
  });

  it("re-exports ui modules", () => {
    expect(typeof ui.BusinessKeyboard).toBe("function");
    expect(typeof ui.CalcDisplay).toBe("function");
  });

  it("re-exports kit modules", () => {
    expect(typeof kit.AccountingCalculator).toBe("function");
    expect(typeof kit.AccountingDisplay).toBe("function");
  });
});
