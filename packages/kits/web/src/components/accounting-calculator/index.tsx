import React, { useMemo, useState } from "react";
import {
  createAccountingCalcKeyboardConfig,
  type BusinessKeyboardConfig,
} from "@usmoment/headless";
import {
  applyAccountingCalculatorKeyboardEvent,
  createAccountingCalculatorState,
  type AccountingCalculatorState,
} from "@usmoment/kit-core";
import {
  BusinessKeyboard,
  type BusinessKeyboardProps,
} from "@usmoment/ui-web";
import clsx from "clsx";
import { renderAccountingDisplay } from "./display";
import { accountingKeyboardPresetProps } from "./keyboard-preset";
import "./keyboard-assets.css";
import "./style.css";

export type { AccountingCalculatorState };
export type { BusinessKeyboardProps };

type AccountingCalculatorKeyboardProps = Omit<
  BusinessKeyboardProps,
  "config" | "onKeyPress"
>;

export type AccountingCalculatorDisplay =
  | false
  | "none"
  | React.ReactNode
  | ((expression: string, result: string) => React.ReactNode | false | "none");

export type AccountingCalculatorProps = AccountingCalculatorKeyboardProps & {
  defaultExpression?: string;
  display?: AccountingCalculatorDisplay;
  expression?: string;
  keyboardConfig?: BusinessKeyboardConfig;
  onChange?: (state: AccountingCalculatorState) => void;
  onExpressionChange?: (
    expression: string,
    state: AccountingCalculatorState,
  ) => void;
  onSubmit?: (state: AccountingCalculatorState) => void;
  renderKeyboard?: (props: BusinessKeyboardProps) => React.ReactNode;
  scale?: number;
  submitLabel?: string;
};

export function AccountingCalculator(props: AccountingCalculatorProps) {
  const {
    className,
    defaultExpression,
    display,
    expression: controlledExpression,
    keyboardConfig: customKeyboardConfig,
    onChange,
    onExpressionChange,
    onSubmit,
    renderKeyboard,
    scale: scaleProp,
    submitLabel,
    ...keyboardOptions
  } = props;
  const scale = scaleProp ?? 2;
  const [uncontrolledExpression, setUncontrolledExpression] = useState(
    () => defaultExpression ?? "",
  );
  const isExpressionControlled = controlledExpression !== undefined;
  const expression = isExpressionControlled
    ? controlledExpression
    : uncontrolledExpression;
  const state = useMemo(
    () => createAccountingCalculatorState(expression, scale),
    [expression, scale],
  );
  const keyboardConfig = useMemo(
    () =>
      customKeyboardConfig ??
      createAccountingCalcKeyboardConfig({ submitLabel }),
    [customKeyboardConfig, submitLabel],
  );

  const keyboardProps: BusinessKeyboardProps = {
    ...(customKeyboardConfig ? {} : accountingKeyboardPresetProps),
    ...keyboardOptions,
    className: clsx(
      "usm-accounting-calculator__keyboard",
      className,
    ),
    config: keyboardConfig,
    onKeyPress: (event) => {
      const nextState = applyAccountingCalculatorKeyboardEvent(
        state.expression,
        scale,
        event,
      );

      if (!isExpressionControlled) {
        setUncontrolledExpression(nextState.expression);
      }

      onExpressionChange?.(nextState.expression, nextState);
      onChange?.(nextState);

      if (event.action === "submit") {
        onSubmit?.(nextState);
      }
    },
  };
  const displayNode =
    display === false || display === "none"
      ? null
      : renderAccountingDisplay(display, state);

  return (
    <div className="usm-accounting-calculator">
      {displayNode}
      {renderKeyboard ? (
        renderKeyboard(keyboardProps)
      ) : (
        <BusinessKeyboard {...keyboardProps} />
      )}
    </div>
  );
}
