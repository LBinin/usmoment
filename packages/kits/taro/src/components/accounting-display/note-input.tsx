import React from "react";
import { Input, Text, View } from "@tarojs/components";
import type { InputProps } from "@tarojs/components/types/Input";
import type { CalcDisplayProps } from "@usmoment/ui-taro";
import clsx from "clsx";

const DEFAULT_NOTE_INPUT_CURSOR_SPACING = 24;

export function createNoteInput(options: {
  className?: string;
  cursorSpacing?: InputProps["cursorSpacing"];
  label?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  value?: string;
}): CalcDisplayProps["footer"] {
  const inputProps = {
    className: clsx(
      "usm-accounting-display__note-input",
      options.className,
    ),
    cursorSpacing:
      options.cursorSpacing ?? DEFAULT_NOTE_INPUT_CURSOR_SPACING,
    onInput: options.onChange
      ? (event: { detail: { value: string } }) =>
          options.onChange?.(event.detail.value)
      : undefined,
    placeholder: options.placeholder ?? "点击输入账单备注",
    placeholderStyle: "color: #AFAFAF",
    style: options.style,
    ...(options.value !== undefined ? { value: options.value } : {}),
  };

  return (
    <View className="usm-accounting-display__note">
      <Text className="usm-accounting-display__note-label">
        {options.label ?? "账单描述"}
      </Text>
      <Input {...inputProps} />
    </View>
  );
}
