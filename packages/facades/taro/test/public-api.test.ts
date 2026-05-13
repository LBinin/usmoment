import { describe, expect, it, vi } from "vitest";
import {
  AccountingCalculator,
  AccountingCalculatorPopup,
  AccountingCategorySelector,
  AccountingDisplay,
  BusinessKeyboard,
  FullscreenOptionList,
  Popup,
  createExpressionEngine,
} from "../src";

vi.mock("@tarojs/components", () => ({
  Button: "button",
  Input: "input",
  RootPortal: ({ children }: { children?: unknown }) => children,
  Text: "span",
  View: "div",
}));

describe("@usmoment/taro public api", () => {
  it("exports the primary user-facing components from the root entry", () => {
    expect(typeof AccountingCalculator).toBe("function");
    expect(typeof AccountingCalculatorPopup).toBe("function");
    expect(typeof AccountingCategorySelector).toBe("function");
    expect(typeof AccountingDisplay).toBe("function");
    expect(typeof BusinessKeyboard).toBe("function");
    expect(typeof FullscreenOptionList).toBe("function");
    expect(typeof Popup).toBe("function");
  });

  it("exports common headless capabilities without exposing package layers", () => {
    expect(typeof createExpressionEngine).toBe("function");
  });
});
