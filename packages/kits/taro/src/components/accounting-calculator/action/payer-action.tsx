import React, { useMemo } from "react";
import {
  Image,
  PickerView,
  PickerViewColumn,
  Text,
  View,
} from "@tarojs/components";
import clsx from "clsx";
import "./payer-action.css";

export type AccountingCalculatorPayerOption = {
  id: string;
  name: string;
  avatarSrc: string;
  disabled?: boolean;
};

export type AccountingCalculatorPayerActionChangeInput = {
  option: AccountingCalculatorPayerOption;
  index: number;
};

export type AccountingCalculatorPayerActionProps = {
  options: AccountingCalculatorPayerOption[];
  value?: string;
  className?: string;
  indicatorClassName?: string;
  indicatorStyle?: string;
  onChange?: (input: AccountingCalculatorPayerActionChangeInput) => void;
};

type PickerViewChangeEvent = {
  detail?: {
    value?: number[];
  };
};

const payerIndicatorStyle = [
  "height: 96rpx",
  "border: 0 none transparent",
  "border-width: 0",
  "border-top: 0 none transparent",
  "border-bottom: 0 none transparent",
  "background: transparent",
  "background-color: transparent",
  "box-shadow: none",
  "opacity: 0",
].join("; ");

export function AccountingCalculatorPayerAction(
  props: AccountingCalculatorPayerActionProps,
) {
  const selectedIndex = useMemo(
    () => resolveSelectedIndex(props.options, props.value),
    [props.options, props.value],
  );

  function handleChange(event: PickerViewChangeEvent) {
    const nextIndex = event.detail?.value?.[0] ?? 0;
    const option = props.options[nextIndex];

    if (!option || option.disabled) return;

    props.onChange?.({
      index: nextIndex,
      option,
    });
  }

  return (
    <View
      className={clsx(
        "usm-accounting-calculator-payer-action",
        props.className,
      )}
    >
      <PickerView
        className="usm-accounting-calculator-payer-action__picker"
        immediateChange
        indicatorClass={clsx(
          "usm-accounting-calculator-payer-action__indicator",
          props.indicatorClassName,
        )}
        indicatorStyle={resolveIndicatorStyle(props.indicatorStyle)}
        onChange={handleChange}
        value={[selectedIndex]}
      >
        <PickerViewColumn>
          {props.options.map((option) => (
            <View
              className={clsx(
                "usm-accounting-calculator-payer-action__option",
                option.disabled &&
                  "usm-accounting-calculator-payer-action__option--disabled",
              )}
              key={option.id}
            >
              <View className="usm-accounting-calculator-payer-action__avatar-frame">
                <Image
                  className="usm-accounting-calculator-payer-action__avatar"
                  mode="aspectFill"
                  src={option.avatarSrc}
                />
              </View>
              <Text className="usm-accounting-calculator-payer-action__name">
                {option.name}
              </Text>
            </View>
          ))}
        </PickerViewColumn>
      </PickerView>
      <View
        aria-hidden
        className="usm-accounting-calculator-payer-action__indicator-guide"
      >
        <View className="usm-accounting-calculator-payer-action__indicator-guide-line usm-accounting-calculator-payer-action__indicator-guide-line--top" />
        <View className="usm-accounting-calculator-payer-action__indicator-guide-line usm-accounting-calculator-payer-action__indicator-guide-line--bottom" />
      </View>
    </View>
  );
}

function resolveSelectedIndex(
  options: AccountingCalculatorPayerOption[],
  value: string | undefined,
): number {
  const index = value
    ? options.findIndex((option) => option.id === value)
    : -1;

  return index >= 0 ? index : 0;
}

function resolveIndicatorStyle(indicatorStyle: string | undefined): string {
  return indicatorStyle
    ? `${payerIndicatorStyle}; ${indicatorStyle}`
    : payerIndicatorStyle;
}
