import {
  createExpressionEngine,
  type BusinessKeyboardEvent,
} from "@usmoment/headless";

export type AccountingCalculatorState = {
  expression: string;
  result: string;
};

export function createAccountingCalculatorState(
  expression: string,
  scale: number,
): AccountingCalculatorState {
  const engine = createExpressionEngine({ scale });

  if (expression) {
    engine.input(expression);
  }

  return {
    expression: engine.expression(),
    result: engine.evaluate(),
  };
}

export function applyAccountingCalculatorKeyboardEvent(
  expression: string,
  scale: number,
  event: BusinessKeyboardEvent,
): AccountingCalculatorState {
  const engine = createExpressionEngine({ scale });

  if (expression) {
    engine.input(expression);
  }

  if (event.action === "input" && event.value) {
    engine.input(event.value);
  }

  if (event.action === "backspace") {
    engine.backspace();
  }

  if (event.action === "clear") {
    engine.clear();
  }

  if (isEqualsEvent(event) && isCompleteCalculableExpression(engine.expression())) {
    const committedValue = normalizeCommittedInput(engine.evaluate());
    engine.clear();
    engine.input(committedValue);
  }

  return {
    expression: engine.expression(),
    result: engine.evaluate(),
  };
}

function isEqualsEvent(event: BusinessKeyboardEvent): boolean {
  return (
    event.action === "custom" &&
    (event.key.id === "=" ||
      isShortcutPayload(event.payload, "equals") ||
      isShortcutPayload(event.key.payload, "equals"))
  );
}

function isShortcutPayload(payload: unknown, shortcut: string): boolean {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "shortcut" in payload &&
    payload.shortcut === shortcut
  );
}

function isCompleteCalculableExpression(expression: string): boolean {
  return hasAccountingExpressionOperator(expression) && endsWithCompleteNumber(expression);
}

export function hasAccountingExpressionOperator(expression: string): boolean {
  let previousNonSpace = "";

  for (let index = 0; index < expression.length; index += 1) {
    const char = expression[index];

    if (char === " ") continue;
    if (char === "+" || char === "*" || char === "/" || char === "×" || char === "÷") {
      return true;
    }
    if (
      char === "-" &&
      previousNonSpace !== "" &&
      previousNonSpace !== "*" &&
      previousNonSpace !== "/" &&
      previousNonSpace !== "×" &&
      previousNonSpace !== "÷"
    ) {
      return true;
    }

    previousNonSpace = char;
  }

  return false;
}

function endsWithCompleteNumber(expression: string): boolean {
  return /\d\.?$/.test(expression.trim());
}

function normalizeCommittedInput(value: string): string {
  return value.includes(".")
    ? value.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "")
    : value;
}
