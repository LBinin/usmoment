import React from "react";
import { View } from "@tarojs/components";
import clsx from "clsx";
import { toClassToken } from "../../shared/class-names";
import { resolvePropValue, type ResolvableProp } from "../../shared/props";
import { normalizeOptionColumns } from "./columns";
import "./style.css";

export type FullscreenOptionListRenderable =
  React.ComponentProps<typeof View>["children"];

export type FullscreenOptionListOption<T = unknown> = {
  key: string;
  disabled?: boolean;
  data?: T;
};

export type FullscreenOptionListOptionInput<T = unknown> = {
  option: FullscreenOptionListOption<T>;
  selected: boolean;
  disabled: boolean;
  index: number;
};

export type FullscreenOptionListChangeEvent<T = unknown> = {
  key: string;
  option: FullscreenOptionListOption<T>;
  nativeEvent: unknown;
};

export type FullscreenOptionListOptionClickEvent<T = unknown> =
  FullscreenOptionListChangeEvent<T> & {
    selected: boolean;
  };

export type FullscreenOptionListProps<T = unknown> = {
  options: Array<FullscreenOptionListOption<T>>;
  selectedKey?: string;
  columns?: number;
  className?: string;
  style?: React.CSSProperties;
  optionClassName?: ResolvableProp<
    FullscreenOptionListOptionInput<T>,
    string
  >;
  optionStyle?: ResolvableProp<
    FullscreenOptionListOptionInput<T>,
    React.CSSProperties
  >;
  renderOption?: (
    input: FullscreenOptionListOptionInput<T>,
  ) => FullscreenOptionListRenderable;
  onChange?: (event: FullscreenOptionListChangeEvent<T>) => void;
  onOptionClick?: (event: FullscreenOptionListOptionClickEvent<T>) => void;
};

export function FullscreenOptionList<T = unknown>(
  props: FullscreenOptionListProps<T>,
) {
  const columns = normalizeOptionColumns(props.columns);

  return (
    <View
      className={clsx("usm-fullscreen-option-list", props.className)}
      style={{
        "--usm-fullscreen-option-list-columns": columns,
        ...props.style,
      } as React.CSSProperties}
    >
      <View
        className="usm-fullscreen-option-list__grid"
        style={{
          gridTemplateColumns:
            "repeat(var(--usm-fullscreen-option-list-columns, 4), minmax(0, 1fr))",
        }}
      >
        {props.options.map((option, index) => {
          const selected = option.key === props.selectedKey;
          const disabled = option.disabled === true;
          const input = { option, selected, disabled, index };

          return (
            <View
              aria-disabled={disabled}
              className={clsx(
                "usm-fullscreen-option-list__option",
                selected && "usm-fullscreen-option-list__option--selected",
                disabled && "usm-fullscreen-option-list__option--disabled",
                `usm-fullscreen-option-list__option--key-${toClassToken(option.key)}`,
                resolvePropValue(props.optionClassName, input),
              )}
              data-option-key={option.key}
              key={option.key}
              onClick={(nativeEvent) => {
                if (disabled) return;

                props.onOptionClick?.({
                  key: option.key,
                  option,
                  selected,
                  nativeEvent,
                });

                if (!selected) {
                  props.onChange?.({
                    key: option.key,
                    option,
                    nativeEvent,
                  });
                }
              }}
              style={resolvePropValue(props.optionStyle, input)}
            >
              {props.renderOption ? props.renderOption(input) : option.key}
            </View>
          );
        })}
      </View>
    </View>
  );
}
