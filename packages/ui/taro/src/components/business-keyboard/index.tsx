import React from "react";
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

export type BusinessKeyboardRenderKeyInput = {
  key: BusinessKeyboardResolvedKey;
  defaultNode: React.ReactNode;
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
  renderKey?: (input: BusinessKeyboardRenderKeyInput) => React.ReactNode;
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
    <div
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
        <div
          className="usm-business-keyboard__row"
          key={rowIndex}
          style={{
            display: "grid",
            gridTemplateColumns: resolveGridTemplateColumns(
              resolved.columns,
              props.columnWidths,
            ),
          }}
        >
          {row.map((key) => {
            const event = createBusinessKeyboardEvent(key);
            const defaultNode = (
              <span className="usm-business-keyboard__key-label">
                {key.label}
              </span>
            );
            const content = props.renderKey
              ? props.renderKey({ key, defaultNode, event })
              : defaultNode;
            const isDisabled = props.disabled || key.disabled;

            return (
              <button
                className={joinClassNames(
                  "usm-business-keyboard__key",
                  `usm-business-keyboard__key--${key.variant}`,
                  resolveKeyClassName(props.keyClassName, key),
                )}
                data-key-action={key.action}
                data-key-id={key.id}
                data-key-label={key.label}
                data-key-variant={key.variant}
                disabled={isDisabled}
                key={key.id}
                onClick={() => {
                  if (!isDisabled) {
                    triggerVibration(props.vibrate);
                    props.onKeyPress?.(event);
                  }
                }}
                style={{
                  gridColumn: `span ${key.span}`,
                  ...resolveKeyStyle(props.keyStyle, key),
                }}
                type="button"
              >
                {content}
              </button>
            );
          })}
        </div>
      ))}
    </div>
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

function resolveGridTemplateColumns(
  columns: number,
  columnWidths: BusinessKeyboardProps["columnWidths"],
): string {
  if (!columnWidths?.length) return `repeat(${columns}, minmax(0, 1fr))`;

  return Array.from({ length: columns }, (_, index) =>
    toGridTrack(columnWidths[index] ?? 1),
  ).join(" ");
}

function toGridTrack(value: number | string): string {
  return typeof value === "number" ? `minmax(0, ${value}fr)` : value;
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
  return typeof value === "number" ? `${value}px` : value;
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
