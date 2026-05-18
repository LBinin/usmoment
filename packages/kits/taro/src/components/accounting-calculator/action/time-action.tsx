import React, { useState } from "react";
import { Picker, Text, View } from "@tarojs/components";
import clsx from "clsx";
import {
  createTimeActionValue,
  formatTimeActionDisplayValue,
  resolveTimeActionValue,
} from "./date-time-values";
import { pickerHitAreaStyle } from "./date-time-action-styles";
import "./date-time-action.css";

export type TimeActionChangeInput = {
  value: string;
  displayValue: string;
};

export type TimeActionProps = {
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (input: TimeActionChangeInput) => void;
};

type TimeActionChangeEvent = {
  detail: {
    value: string;
  };
};

export function TimeAction(props: TimeActionProps) {
  const [fallbackValue] = useState(() => createTimeActionValue());
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    resolveTimeActionValue(props.defaultValue, fallbackValue),
  );
  const currentValue =
    props.value !== undefined
      ? resolveTimeActionValue(props.value, fallbackValue)
      : uncontrolledValue;
  const displayValue = formatTimeActionDisplayValue(currentValue);

  function handleChange(event: TimeActionChangeEvent) {
    if (props.disabled) return;

    const nextValue = resolveTimeActionValue(event.detail.value, currentValue);
    const nextDisplayValue = formatTimeActionDisplayValue(nextValue);

    if (props.value === undefined) {
      setUncontrolledValue(nextValue);
    }

    props.onChange?.({
      displayValue: nextDisplayValue,
      value: nextValue,
    });
  }

  return (
    <View
      className={clsx(
        "usm-accounting-calculator-date-time-action",
        "usm-accounting-calculator-date-time-action--time",
        props.disabled &&
          "usm-accounting-calculator-date-time-action--disabled",
        props.className,
      )}
    >
      <View
        aria-disabled={props.disabled}
        className="usm-accounting-calculator-date-time-action__surface"
        role="button"
      >
        <View className="usm-accounting-calculator-date-time-action__value usm-accounting-calculator-date-time-action__value--time">
          <Text className="usm-accounting-calculator-date-time-action__number">
            {displayValue}
          </Text>
        </View>
        <Text className="usm-accounting-calculator-date-time-action__hint">
          点击更改时间
        </Text>
      </View>
      <Picker
        className="usm-accounting-calculator-date-time-action__picker"
        disabled={props.disabled}
        mode="time"
        onChange={handleChange}
        value={currentValue}
      >
        <View
          className="usm-accounting-calculator-date-time-action__picker-hit-area"
          style={pickerHitAreaStyle}
        />
      </Picker>
    </View>
  );
}
