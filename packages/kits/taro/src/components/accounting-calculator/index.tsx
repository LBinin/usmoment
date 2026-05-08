import React, { useMemo, useState } from "react";
import {
  createAccountingCalcKeyboardConfig,
  createExpressionEngine,
  type BusinessKeyboardConfig,
  type BusinessKeyboardEvent,
} from "@usmoment/headless";
import {
  BusinessKeyboard,
  CalcDisplay,
  type BusinessKeyboardProps,
} from "@usmoment/ui-taro";
import "./keyboard-assets.css";
import "./style.css";

export type AccountingCalculatorState = {
  expression: string;
  result: string;
};

export type AccountingCalculatorProps = {
  display?: "default" | "none";
  keyboardConfig?: BusinessKeyboardConfig;
  onChange?: (state: AccountingCalculatorState) => void;
  onSubmit?: (state: AccountingCalculatorState) => void;
  renderDisplay?: (state: AccountingCalculatorState) => React.ReactNode;
  renderKeyboard?: (props: BusinessKeyboardProps) => React.ReactNode;
  scale?: number;
  submitLabel?: string;
};

export function AccountingCalculator(props: AccountingCalculatorProps) {
  const scale = props.scale ?? 2;
  const [expression, setExpression] = useState("");
  const state = useMemo(
    () => createAccountingCalculatorState(expression, scale),
    [expression, scale],
  );
  const keyboardConfig = useMemo(
    () =>
      props.keyboardConfig ??
      createAccountingCalcKeyboardConfig({ submitLabel: props.submitLabel }),
    [props.keyboardConfig, props.submitLabel],
  );

  const keyboardProps: BusinessKeyboardProps = {
    className: "usm-accounting-calculator__keyboard",
    ...(props.keyboardConfig ? {} : accountingKeyboardPresetProps),
    config: keyboardConfig,
    onKeyPress: (event) => {
      const nextState = applyKeyboardEvent(state.expression, scale, event);

      setExpression(nextState.expression);
      props.onChange?.(nextState);

      if (event.action === "submit") {
        props.onSubmit?.(nextState);
      }
    },
  };

  return (
    <div className="usm-accounting-calculator">
      {props.display !== "none" &&
        (props.renderDisplay ? (
          props.renderDisplay(state)
        ) : (
          <CalcDisplay expression={state.expression} result={state.result} />
        ))}
      {props.renderKeyboard ? (
        props.renderKeyboard(keyboardProps)
      ) : (
        <BusinessKeyboard {...keyboardProps} />
      )}
    </div>
  );
}

const accountingKeyboardPresetProps: Pick<
  BusinessKeyboardProps,
  "columnGap" | "columnWidths" | "keyFontFamily" | "keyHeight" | "keys" | "layout" | "rowGap"
> = {
  columnGap: 0,
  columnWidths: [1, 1, 1, 1.2875],
  keyFontFamily: '"Montserrat", "Avenir Next", sans-serif',
  keyHeight: 60,
  keys: [
    {
      id: "=",
      label: "=",
      action: "custom",
      payload: { shortcut: "equals" },
      variant: "operator",
    },
  ],
  layout: [
    ["7", "8", "9", "+"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "="],
    [".", "0", "backspace", "submit"],
  ],
  rowGap: 0,
};

function createAccountingCalculatorState(
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

function applyKeyboardEvent(
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
