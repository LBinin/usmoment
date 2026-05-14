import React from "react";
import { Text, View } from "@tarojs/components";
import {
  createBusinessKeyboardEvent,
  resolveBusinessKeyboardConfig,
  type BusinessKeyboardConfig,
  type BusinessKeyboardEvent,
  type BusinessKeyboardKey,
  type BusinessKeyboardLayout,
  type BusinessKeyboardResolvedKey,
} from "@usmoment/headless";
import clsx from "clsx";
import { toClassToken } from "../../shared/class-names";
import { resolvePropValue, type ResolvableProp } from "../../shared/props";
import {
  resolveKeyTrackStyle,
  resolveRootStyle,
  resolveRowStyle,
} from "./styles";
import { triggerVibration } from "./vibration";
import "./style.css";

type TaroRenderable = React.ComponentProps<typeof View>["children"];

export type BusinessKeyboardRenderKeyInput = {
  key: BusinessKeyboardResolvedKey;
  defaultNode: TaroRenderable;
  event: BusinessKeyboardEvent;
};

export type BusinessKeyboardVibrate = false | "light" | "medium" | "heavy";

export type BusinessKeyboardProps = {
  config: BusinessKeyboardConfig;
  keys?: BusinessKeyboardKey[];
  layout?: BusinessKeyboardLayout;
  columns?: number;
  keyHeight?: number | string;
  gap?: number | string;
  rowGap?: number | string;
  columnGap?: number | string;
  columnWidths?: number[];
  keyFontFamily?: string;
  vibrate?: BusinessKeyboardVibrate;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  topAccessory?: TaroRenderable;
  keyClassName?: ResolvableProp<BusinessKeyboardResolvedKey, string>;
  keyStyle?: ResolvableProp<BusinessKeyboardResolvedKey, React.CSSProperties>;
  renderKey?: (input: BusinessKeyboardRenderKeyInput) => TaroRenderable;
  onKeyPress?: (event: BusinessKeyboardEvent) => void;
};

export function BusinessKeyboard(props: BusinessKeyboardProps) {
  const resolved = resolveBusinessKeyboardConfig({
    config: props.config,
    keys: props.keys,
    layout: props.layout,
    columns: props.columns,
  });
  const hasTopAccessory =
    props.topAccessory !== undefined &&
    props.topAccessory !== null &&
    props.topAccessory !== false;

  return (
    <View
      aria-label={props.ariaLabel ?? "Business keyboard"}
      className={clsx(
        "usm-business-keyboard",
        props.disabled && "usm-business-keyboard--disabled",
        props.className,
      )}
      role="group"
      style={{
        ...resolveRootStyle(props),
        ...props.style,
      }}
    >
      {hasTopAccessory ? (
        <View className="usm-business-keyboard__top-accessory">
          {props.topAccessory}
        </View>
      ) : null}
      {resolved.rows.map((row, rowIndex) => (
        <View
          className="usm-business-keyboard__row"
          key={rowIndex}
          style={{
            display: "flex",
            ...resolveRowStyle(rowIndex, props),
          }}
        >
          {row.map((key, keyIndex) => {
            const event = createBusinessKeyboardEvent(key);
            const defaultNode = (
              <Text className="usm-business-keyboard__key-label">
                {key.label}
              </Text>
            );
            const content = props.renderKey
              ? props.renderKey({ key, defaultNode, event })
              : defaultNode;
            const isDisabled = props.disabled || key.disabled;

            return (
              <View
                aria-disabled={isDisabled}
                className={clsx(
                  "usm-business-keyboard__key",
                  `usm-business-keyboard__key--${key.variant}`,
                  `usm-business-keyboard__key--id-${toClassToken(key.id)}`,
                  `usm-business-keyboard__key--action-${toClassToken(key.action)}`,
                  `usm-business-keyboard__key--variant-${toClassToken(key.variant)}`,
                  resolvePropValue(props.keyClassName, key),
                )}
                data-key-action={key.action}
                data-key-id={key.id}
                data-key-label={key.label}
                data-key-variant={key.variant}
                key={key.id}
                onClick={() => {
                  if (!isDisabled) {
                    triggerVibration(props.vibrate);
                    props.onKeyPress?.(event);
                  }
                }}
                style={{
                  ...resolveKeyTrackStyle(key, keyIndex, props),
                  ...resolvePropValue(props.keyStyle, key),
                }}
              >
                {content}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}
