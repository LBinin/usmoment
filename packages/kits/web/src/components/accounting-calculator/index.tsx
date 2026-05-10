import React, { useMemo, useState } from "react";
import { createAccountingCalcKeyboardConfig, type BusinessKeyboardConfig } from "@usmoment/headless";
import {
  applyAccountingCalculatorKeyboardEvent,
  createAccountingCalculatorState,
  type AccountingCalculatorState,
} from "@usmoment/kit-core";
import {
  BusinessKeyboard,
  CalcDisplay,
  type BusinessKeyboardProps,
} from "@usmoment/ui-web";
import "./keyboard-assets.css";
import "./style.css";

export type { AccountingCalculatorState };
export type { BusinessKeyboardProps };

type AccountingCalculatorKeyboardProps = Omit<
  BusinessKeyboardProps,
  "config" | "onKeyPress"
>;

export type AccountingCalculatorProps = AccountingCalculatorKeyboardProps & {
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
  const {
    className,
    display,
    keyboardConfig: customKeyboardConfig,
    onChange,
    onSubmit,
    renderDisplay,
    renderKeyboard,
    scale: scaleProp,
    submitLabel,
    ...keyboardOptions
  } = props;
  const scale = scaleProp ?? 2;
  const [expression, setExpression] = useState("");
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
    className: joinClassNames(
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

      setExpression(nextState.expression);
      onChange?.(nextState);

      if (event.action === "submit") {
        onSubmit?.(nextState);
      }
    },
  };

  return (
    <div className="usm-accounting-calculator">
      {display !== "none" &&
        (renderDisplay ? (
          renderDisplay(state)
        ) : (
          <CalcDisplay expression={state.expression} result={state.result} />
        ))}
      {renderKeyboard ? (
        renderKeyboard(keyboardProps)
      ) : (
        <BusinessKeyboard {...keyboardProps} />
      )}
    </div>
  );
}

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
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
