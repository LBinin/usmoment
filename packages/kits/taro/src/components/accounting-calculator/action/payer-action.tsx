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
  onChange?: (input: AccountingCalculatorPayerActionChangeInput) => void;
};

type PickerViewChangeEvent = {
  detail?: {
    value?: number[];
  };
};

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
        indicatorClass="usm-accounting-calculator-payer-action__indicator"
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
