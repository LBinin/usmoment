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

  return {
    expression: engine.expression(),
    result: engine.evaluate(),
  };
}
