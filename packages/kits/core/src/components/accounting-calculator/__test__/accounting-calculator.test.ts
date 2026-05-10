import { describe, expect, it } from "vitest";
import {
  applyAccountingCalculatorKeyboardEvent,
  createAccountingCalculatorState,
  hasAccountingExpressionOperator,
} from "..";

describe("accounting calculator core", () => {
  it.each([
    ["1+2*3", 2, "7.00"],
    ["9-10", 2, "-1.00"],
    ["2*-3", 2, "-6.00"],
    ["6/-2", 2, "-3.00"],
    ["2×3+8÷4", 2, "8.00"],
    ["1.005+0.005", 2, "1.01"],
    ["2+", 2, "2.00"],
    ["", 2, "0.00"],
  ])(
    "creates display state for %s at scale %i",
    (expression, scale, result) => {
      expect(createAccountingCalculatorState(expression, scale)).toEqual({
        expression,
        result,
      });
    },
  );

  it.each([
    ["12", backspaceEvent(), { expression: "1", result: "1.00" }],
    ["12", clearEvent(), { expression: "", result: "0.00" }],
    ["12", inputEvent("3"), { expression: "123", result: "123.00" }],
    ["12", inputEvent("+"), { expression: "12+", result: "12.00" }],
    ["", inputEvent("."), { expression: ".", result: "0.00" }],
  ])("applies semantic keyboard event %#", (expression, event, expected) => {
    const state = applyAccountingCalculatorKeyboardEvent(expression, 2, event);

    expect(state).toEqual(expected);
  });

  it.each([
    ["2+3", 2, "5", "5.00"],
    ["9-10", 2, "-1", "-1.00"],
    ["2*3+4", 2, "10", "10.00"],
    ["2*-3", 2, "-6", "-6.00"],
    ["6/-2", 2, "-3", "-3.00"],
    ["2×3+8÷4", 2, "8", "8.00"],
    ["5.50+0.50", 2, "6", "6.00"],
    ["5.25+0.25", 2, "5.5", "5.50"],
    ["1/4", 2, "0.25", "0.25"],
    ["1/3", 2, "0.33", "0.33"],
  ])(
    "commits complete expression %s as normalized input",
    (expression, scale, committedExpression, result) => {
      const state = applyAccountingCalculatorKeyboardEvent(
        expression,
        scale,
        equalsEvent(),
      );

      expect(state).toEqual({
        expression: committedExpression,
        result,
      });
    },
  );

  it("continues editing from the committed equals result", () => {
    const committed = applyAccountingCalculatorKeyboardEvent("2+3", 2, equalsEvent());
    const appendedDigit = applyAccountingCalculatorKeyboardEvent(
      committed.expression,
      2,
      inputEvent("2"),
    );
    const appendedOperator = applyAccountingCalculatorKeyboardEvent(
      committed.expression,
      2,
      inputEvent("+"),
    );

    expect(appendedDigit).toEqual({
      expression: "52",
      result: "52.00",
    });
    expect(appendedOperator).toEqual({
      expression: "5+",
      result: "5.00",
    });
  });

  it.each([
    ["2+", "2.00"],
    ["2-", "2.00"],
    ["2*", "2.00"],
    ["8/", "8.00"],
    ["2*-", "2.00"],
    ["-", "0.00"],
    ["-.", "0.00"],
    ["52", "52.00"],
    ["-1", "-1.00"],
    ["0.25", "0.25"],
  ])("does not change %s when equals cannot commit", (expression, result) => {
    expect(applyAccountingCalculatorKeyboardEvent(expression, 2, equalsEvent())).toEqual({
      expression,
      result,
    });
  });

  it("recognizes equals from key id or shortcut payload", () => {
    expect(
      applyAccountingCalculatorKeyboardEvent("2+3", 2, equalsEvent({ payload: undefined })),
    ).toEqual({
      expression: "5",
      result: "5.00",
    });
    expect(
      applyAccountingCalculatorKeyboardEvent("2+3", 2, equalsEvent({ keyId: "custom-equals" })),
    ).toEqual({
      expression: "5",
      result: "5.00",
    });
  });

  it.each([
    ["2+3", true],
    ["2-3", true],
    ["2*3", true],
    ["2/3", true],
    ["2×3", true],
    ["2÷3", true],
    ["2*-3", true],
    ["6/-2", true],
    ["5+", true],
    ["-1", false],
    [" -1", false],
    ["-0.5", false],
    ["52", false],
    ["0.25", false],
    ["", false],
    [".", false],
  ])("detects accounting expression operators in %s", (expression, expected) => {
    expect(hasAccountingExpressionOperator(expression)).toBe(expected);
  });
});

function inputEvent(value: string) {
  return {
    action: "input",
    value,
    key: {
      action: "input",
      id: value,
      label: value,
      span: 1,
      value,
      variant: "number",
    },
  } as const;
}

function backspaceEvent() {
  return {
    action: "backspace",
    key: {
      action: "backspace",
      id: "backspace",
      label: "Backspace",
      span: 1,
      variant: "default",
    },
  } as const;
}

function clearEvent() {
  return {
    action: "clear",
    key: {
      action: "clear",
      id: "clear",
      label: "Clear",
      span: 1,
      variant: "danger",
    },
  } as const;
}

function equalsEvent(options: { keyId?: string; payload?: unknown } = {}) {
  const payload =
    "payload" in options ? options.payload : { shortcut: "equals" };

  return {
    action: "custom",
    payload,
    key: {
      action: "custom",
      id: options.keyId ?? "=",
      label: "=",
      payload: { shortcut: "equals" },
      span: 1,
      variant: "operator",
    },
  } as const;
}
