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
import "./style.css";

type TaroRenderable = React.ReactElement | string | number | boolean | null | undefined;

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
  columnWidths?: Array<number | string>;
  keyFontFamily?: string;
  vibrate?: BusinessKeyboardVibrate;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
  keyClassName?:
    | string
    | ((key: BusinessKeyboardResolvedKey) => string | undefined);
  keyStyle?:
    | React.CSSProperties
    | ((key: BusinessKeyboardResolvedKey) => React.CSSProperties | undefined);
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

  return (
    <View
      aria-label={props.ariaLabel ?? "Business keyboard"}
      className={joinClassNames(
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
                className={joinClassNames(
                  "usm-business-keyboard__key",
                  `usm-business-keyboard__key--${key.variant}`,
                  resolveKeyClassName(props.keyClassName, key),
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
                  ...resolveKeyStyle(props.keyStyle, key),
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

function resolveRootStyle(
  props: Pick<
    BusinessKeyboardProps,
    "columnGap" | "gap" | "keyFontFamily" | "keyHeight" | "rowGap"
  >,
): React.CSSProperties {
  const style = {} as React.CSSProperties & Record<string, string>;

  if (props.gap !== undefined) {
    style["--usm-keyboard-gap"] = toCssLength(props.gap);
    style["--usm-keyboard-row-gap"] = toCssLength(props.gap);
    style["--usm-keyboard-column-gap"] = toCssLength(props.gap);
  }

  if (props.rowGap !== undefined) {
    style["--usm-keyboard-row-gap"] = toCssLength(props.rowGap);
  }

  if (props.columnGap !== undefined) {
    style["--usm-keyboard-column-gap"] = toCssLength(props.columnGap);
  }

  if (props.keyHeight !== undefined) {
    style["--usm-keyboard-key-height"] = toCssLength(props.keyHeight);
  }

  if (props.keyFontFamily !== undefined) {
    style["--usm-keyboard-key-font-family"] = props.keyFontFamily;
  }

  return style;
}

function resolveRowStyle(
  rowIndex: number,
  props: Pick<BusinessKeyboardProps, "gap" | "rowGap">,
): React.CSSProperties {
  if (rowIndex === 0) return {};

  return {
    marginTop: toCssLength(props.rowGap ?? props.gap ?? 8),
  };
}

function resolveKeyTrackStyle(
  key: BusinessKeyboardResolvedKey,
  keyIndex: number,
  props: Pick<
    BusinessKeyboardProps,
    "columnGap" | "columnWidths" | "gap" | "keyFontFamily" | "keyHeight"
  >,
): React.CSSProperties {
  const weight = resolveKeyTrackWeight(key, keyIndex, props.columnWidths);

  return {
    flex: `${weight} ${weight} 0%`,
    fontFamily: props.keyFontFamily,
    height: toCssLength(props.keyHeight ?? 60),
    marginLeft:
      keyIndex === 0
        ? undefined
        : toCssLength(props.columnGap ?? props.gap ?? 8),
    width: 0,
  };
}

function resolveKeyTrackWeight(
  key: BusinessKeyboardResolvedKey,
  keyIndex: number,
  columnWidths: BusinessKeyboardProps["columnWidths"],
): number {
  const fallbackWeight = Math.max(1, key.span);

  if (!columnWidths?.length) return fallbackWeight;

  const value = columnWidths[keyIndex];

  return typeof value === "number" && Number.isFinite(value)
    ? value
    : fallbackWeight;
}

function resolveKeyClassName(
  keyClassName: BusinessKeyboardProps["keyClassName"],
  key: BusinessKeyboardResolvedKey,
): string | undefined {
  if (typeof keyClassName === "function") return keyClassName(key);

  return keyClassName;
}

function resolveKeyStyle(
  keyStyle: BusinessKeyboardProps["keyStyle"],
  key: BusinessKeyboardResolvedKey,
): React.CSSProperties | undefined {
  if (typeof keyStyle === "function") return keyStyle(key);

  return keyStyle;
}

function joinClassNames(
  ...classNames: Array<string | false | null | undefined>
): string {
  return classNames.filter(Boolean).join(" ");
}

function toCssLength(value: number | string): string {
  return typeof value === "number" ? `${value}rpx` : value;
}

type VibrationHost = {
  Taro?: {
    vibrateShort?: (options: { type?: Exclude<BusinessKeyboardVibrate, false> }) => void;
  };
  wx?: {
    vibrateShort?: (options?: { type?: Exclude<BusinessKeyboardVibrate, false> }) => void;
  };
};

function triggerVibration(vibrate: BusinessKeyboardVibrate | undefined): void {
  if (!vibrate) return;

  const host = globalThis as VibrationHost;

  try {
    if (host.Taro?.vibrateShort) {
      host.Taro.vibrateShort({ type: vibrate });
      return;
    }

    if (host.wx?.vibrateShort) {
      host.wx.vibrateShort({ type: vibrate });
      return;
    }

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(resolveVibrationDuration(vibrate));
    }
  } catch {
    // Haptic feedback is best-effort and should never block keyboard input.
  }
}

function resolveVibrationDuration(
  vibrate: Exclude<BusinessKeyboardVibrate, false>,
): number {
  if (vibrate === "heavy") return 30;
  if (vibrate === "medium") return 20;
  return 10;
}
