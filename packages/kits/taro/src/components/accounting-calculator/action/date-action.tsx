import React, { useState } from "react";
import { Picker, Text, View } from "@tarojs/components";
import clsx from "clsx";
import {
  createDateActionValue,
  formatDateActionDisplayValue,
  resolveDateActionValue,
} from "./date-time-values";
import { pickerHitAreaStyle } from "./date-time-action-styles";
import "./date-time-action.css";

export type DateActionChangeInput = {
  value: string;
  displayValue: string;
};

export type DateActionProps = {
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (input: DateActionChangeInput) => void;
};

type DateActionChangeEvent = {
  detail: {
    value: string;
  };
};

export function DateAction(props: DateActionProps) {
  const [fallbackValue] = useState(() => createDateActionValue());
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    resolveDateActionValue(props.defaultValue, fallbackValue),
  );
  const currentValue =
    props.value !== undefined
      ? resolveDateActionValue(props.value, fallbackValue)
      : uncontrolledValue;
  const [yearValue, monthValue, dayValue] = currentValue.split("-");

  function handleChange(event: DateActionChangeEvent) {
    if (props.disabled) return;

    const nextValue = resolveDateActionValue(event.detail.value, currentValue);
    const nextDisplayValue = formatDateActionDisplayValue(nextValue);

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
        "usm-accounting-calculator-date-time-action--date",
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
        <View className="usm-accounting-calculator-date-time-action__value usm-accounting-calculator-date-time-action__value--date">
          <Text className="usm-accounting-calculator-date-time-action__number">
            {yearValue}
          </Text>
          <Text className="usm-accounting-calculator-date-time-action__date-unit">
            年
          </Text>
          <Text className="usm-accounting-calculator-date-time-action__number">
            {monthValue}
          </Text>
          <Text className="usm-accounting-calculator-date-time-action__date-unit">
            月
          </Text>
          <Text className="usm-accounting-calculator-date-time-action__number">
            {dayValue}
          </Text>
          <Text className="usm-accounting-calculator-date-time-action__date-unit">
            日
          </Text>
        </View>
        <Text className="usm-accounting-calculator-date-time-action__hint">
          点击更改日期
        </Text>
      </View>
      <Picker
        className="usm-accounting-calculator-date-time-action__picker"
        disabled={props.disabled}
        mode="date"
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
