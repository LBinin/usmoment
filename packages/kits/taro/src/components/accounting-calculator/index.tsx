import React, { useMemo, useState } from "react";
import { View } from "@tarojs/components";
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
} from "@usmoment/ui-taro";
import clsx from "clsx";
import { renderAccountingDisplay } from "./display";
import { accountingKeyboardPresetProps } from "./keyboard-preset";
import "./keyboard-assets.css";
import "./style.css";

export type { AccountingCalculatorState };
export type { BusinessKeyboardProps };

export type TaroRenderable = React.ComponentProps<typeof View>["children"];

type AccountingCalculatorKeyboardProps = Omit<
  BusinessKeyboardProps,
  "config" | "onKeyPress"
>;

export type AccountingCalculatorDisplay =
  | false
  | "none"
  | TaroRenderable
  | ((expression: string, result: string) => TaroRenderable | false | "none");

export type AccountingCalculatorProps = AccountingCalculatorKeyboardProps & {
  display?: AccountingCalculatorDisplay;
  keyboardConfig?: BusinessKeyboardConfig;
  onChange?: (state: AccountingCalculatorState) => void;
  onSubmit?: (state: AccountingCalculatorState) => void;
  renderKeyboard?: (props: BusinessKeyboardProps) => TaroRenderable;
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

      setExpression(nextState.expression);
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
    <View className="usm-accounting-calculator">
      {displayNode}
      {renderKeyboard ? (
        renderKeyboard(keyboardProps)
      ) : (
        <BusinessKeyboard {...keyboardProps} />
      )}
    </View>
  );
}
