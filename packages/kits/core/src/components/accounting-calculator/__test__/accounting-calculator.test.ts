import { describe, expect, it } from "vitest";
import {
  applyAccountingCalculatorKeyboardEvent,
  createAccountingCalculatorState,
} from "..";

describe("accounting calculator core", () => {
  it("creates display state from an expression", () => {
    expect(createAccountingCalculatorState("1+2*3", 2)).toEqual({
      expression: "1+2*3",
      result: "7.00",
    });
  });

  it("applies semantic keyboard events", () => {
    const state = applyAccountingCalculatorKeyboardEvent("12", 2, {
      action: "backspace",
      key: {
        action: "backspace",
        id: "backspace",
        label: "Backspace",
        span: 1,
        variant: "default",
      },
    });

    expect(state).toEqual({
      expression: "1",
      result: "1.00",
    });
  });
});
