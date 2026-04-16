import { describe, expect, it } from "vitest";
import * as headless from "../src/headless";
import * as ui from "../src/ui";
import * as kit from "../src/kit";

describe("@usmoment/taro facade", () => {
  it("re-exports headless modules", () => {
    expect(typeof headless.createExpressionEngine).toBe("function");
    expect(typeof headless.createSelectionState).toBe("function");
  });

  it("re-exports ui modules", () => {
    expect(typeof ui.CalcKeyboard).toBe("function");
    expect(typeof ui.CalcDisplay).toBe("function");
  });

  it("re-exports kit modules", () => {
    expect(typeof kit.AccountingCalcKit).toBe("function");
  });
});
