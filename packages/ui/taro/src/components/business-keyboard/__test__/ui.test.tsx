import React from "react";
import { describe, expect, it, vi } from "vitest";
import { createAccountingCalcKeyboardConfig } from "@usmoment/headless";
import { BusinessKeyboard } from "..";

vi.mock("@tarojs/components", () => ({
  Text: "span",
  View: "div",
}));

describe("BusinessKeyboard", () => {
  it("renders rows from a keyboard config", () => {
    const element = BusinessKeyboard({
      config: createAccountingCalcKeyboardConfig(),
      onKeyPress: vi.fn(),
    });
    const rows = findElementsByClassName(element, "usm-business-keyboard__row");

    expect(rows).toHaveLength(4);
    expect(getText(rows[0])).toBe("789⌫");
    expect(getElementProps(rows[0]).style).toMatchObject({
      display: "flex",
    });
    expect(getText(rows[3])).toBe("C0.完成");
  });

  it("stretches each key across its flex track for mini program layout", () => {
    const element = BusinessKeyboard({
      config: createAccountingCalcKeyboardConfig(),
    });
    const buttons = findElementsByClassName(element, "usm-business-keyboard__key");

    expect(getElementProps(buttons[0]).style).toMatchObject({
      flex: "1 1 0%",
      height: "60rpx",
      width: 0,
    });
  });

  it("dispatches a semantic key event when a key is pressed", () => {
    const onKeyPress = vi.fn();
    const element = BusinessKeyboard({
      config: createAccountingCalcKeyboardConfig(),
      onKeyPress,
    });
    const buttons = findElementsByClassName(element, "usm-business-keyboard__key");

    getElementProps(buttons[0]).onClick?.();

    expect(onKeyPress).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "input",
        value: "7",
        key: expect.objectContaining({ id: "7" }),
      }),
    );
  });

  it("supports renderKey for custom key rendering", () => {
    const element = BusinessKeyboard({
      config: createAccountingCalcKeyboardConfig(),
      renderKey: ({ key, defaultNode }) =>
        key.id === "submit" ? <strong>{key.label}</strong> : defaultNode,
    });
    const strong = findElementsByType(element, "strong");

    expect(strong).toHaveLength(1);
    expect(getText(strong[0])).toBe("完成");
  });

  it("renders a top accessory before keyboard rows", () => {
    const element = BusinessKeyboard({
      config: createAccountingCalcKeyboardConfig(),
      topAccessory: <strong>Accessory</strong>,
    });
    const children = React.Children.toArray(getElementProps(element).children);
    const accessory = findElementsByClassName(
      element,
      "usm-business-keyboard__top-accessory",
    )[0];

    expect(getElementProps(children[0] as React.ReactElement).className).toBe(
      "usm-business-keyboard__top-accessory",
    );
    expect(getElementProps(children[1] as React.ReactElement).className).toBe(
      "usm-business-keyboard__body",
    );
    expect(getText(accessory)).toBe("Accessory");
    expect(
      findElementsByClassName(element, "usm-business-keyboard__row"),
    ).toHaveLength(4);
  });

  it("renders a neutral body overlay with top accessory and rows", () => {
    const element = BusinessKeyboard({
      bodyOverlay: <div data-testid="keyboard-overlay">Overlay</div>,
      config: createAccountingCalcKeyboardConfig(),
      topAccessory: <strong>Accessory</strong>,
    });
    const body = findElementsByClassName(
      element,
      "usm-business-keyboard__body",
    )[0];
    const rows = findElementsByClassName(
      element,
      "usm-business-keyboard__rows",
    )[0];
    const overlay = findElementsByClassName(
      element,
      "usm-business-keyboard__body-overlay",
    )[0];

    expect(getText(body)).toContain("789⌫");
    expect(getText(rows)).toContain("C0.完成");
    expect(getText(overlay)).toBe("Overlay");
    expect(
      findElementsByClassName(element, "usm-business-keyboard__top-accessory"),
    ).toHaveLength(1);
    expect(
      findElementsByClassName(element, "usm-business-keyboard__row"),
    ).toHaveLength(4);
  });

  it("writes visual CSS variables", () => {
    const element = BusinessKeyboard({
      config: createAccountingCalcKeyboardConfig(),
      columnGap: "10px",
      gap: 6,
      keyFontFamily: '"Montserrat", sans-serif',
      keyHeight: "56px",
      rowGap: 12,
    });

    expect(getElementProps(element).style).toMatchObject({
      "--usm-keyboard-column-gap": "10px",
      "--usm-keyboard-gap": "6rpx",
      "--usm-keyboard-key-font-family": '"Montserrat", sans-serif',
      "--usm-keyboard-key-height": "56px",
      "--usm-keyboard-row-gap": "12rpx",
    });
  });

  it("supports custom column widths", () => {
    type ColumnWidths = React.ComponentProps<typeof BusinessKeyboard>["columnWidths"];
    const numericColumnWidths = [1, 1, 1, 1.25] satisfies ColumnWidths;
    const element = BusinessKeyboard({
      columnWidths: numericColumnWidths,
      config: createAccountingCalcKeyboardConfig(),
    });
    const rows = findElementsByClassName(element, "usm-business-keyboard__row");
    const buttons = findElementsByClassName(element, "usm-business-keyboard__key");

    expect(getElementProps(rows[0]).style).toMatchObject({
      display: "flex",
    });
    expect(getElementProps(rows[1]).style).toMatchObject({
      marginTop: "8rpx",
    });
    expect(getElementProps(buttons[3]).style).toMatchObject({
      flex: "1.25 1.25 0%",
    });
  });

  it("adds key data attributes for styling hooks", () => {
    const element = BusinessKeyboard({
      config: createAccountingCalcKeyboardConfig(),
    });
    const buttons = findElementsByClassName(element, "usm-business-keyboard__key");

    expect(getElementProps(buttons[0])["data-key-id"]).toBe("7");
    expect(getElementProps(buttons[0])["data-key-label"]).toBe("7");
    expect(getElementProps(buttons[0])["data-key-action"]).toBe("input");
    expect(getElementProps(buttons[0])["data-key-variant"]).toBe("number");
  });

  it("adds key class names for mini program styling hooks", () => {
    const element = BusinessKeyboard({
      config: createAccountingCalcKeyboardConfig(),
    });
    const buttons = findElementsByClassName(element, "usm-business-keyboard__key");

    expect(getElementProps(buttons[0]).className).toContain(
      "usm-business-keyboard__key--id-7",
    );
    expect(getElementProps(buttons[0]).className).toContain(
      "usm-business-keyboard__key--action-input",
    );
    expect(getElementProps(buttons[0]).className).toContain(
      "usm-business-keyboard__key--variant-number",
    );
    expect(getElementProps(buttons[7]).className).toContain(
      "usm-business-keyboard__key--id-plus",
    );
    expect(getElementProps(buttons[11]).className).toContain(
      "usm-business-keyboard__key--id-minus",
    );
    expect(getElementProps(buttons.at(-1)!).className).toContain(
      "usm-business-keyboard__key--id-submit",
    );
    expect(getElementProps(buttons.at(-1)!).className).toContain(
      "usm-business-keyboard__key--action-submit",
    );

    const customElement = BusinessKeyboard({
      config: createAccountingCalcKeyboardConfig(),
      keys: [{ id: "=", label: "=", action: "custom", variant: "operator" }],
      layout: [["="]],
    });
    const customButtons = findElementsByClassName(
      customElement,
      "usm-business-keyboard__key",
    );

    expect(getElementProps(customButtons[0]).className).toContain(
      "usm-business-keyboard__key--id-equals",
    );
  });

  it("triggers best-effort vibration when enabled", () => {
    const vibrateShort = vi.fn();
    const previousWx = (globalThis as TestVibrationHost).wx;
    (globalThis as TestVibrationHost).wx = { vibrateShort };
    const element = BusinessKeyboard({
      config: createAccountingCalcKeyboardConfig(),
      vibrate: "medium",
    });
    const buttons = findElementsByClassName(element, "usm-business-keyboard__key");

    getElementProps(buttons[0]).onClick?.();

    expect(vibrateShort).toHaveBeenCalledWith({ type: "medium" });
    (globalThis as TestVibrationHost).wx = previousWx;
  });

  it("does not dispatch events when the keyboard is disabled", () => {
    const onKeyPress = vi.fn();
    const element = BusinessKeyboard({
      config: createAccountingCalcKeyboardConfig(),
      disabled: true,
      onKeyPress,
    });
    const buttons = findElementsByClassName(element, "usm-business-keyboard__key");

    getElementProps(buttons[0]).onClick?.();

    expect(getElementProps(element).className).toContain(
      "usm-business-keyboard--disabled",
    );
    expect(getElementProps(buttons[0])["aria-disabled"]).toBe(true);
    expect(onKeyPress).not.toHaveBeenCalled();
  });

  it("does not dispatch events when a single key is disabled", () => {
    const onKeyPress = vi.fn();
    const element = BusinessKeyboard({
      config: createAccountingCalcKeyboardConfig(),
      keys: [{ id: "7", label: "7", disabled: true }],
      onKeyPress,
    });
    const buttons = findElementsByClassName(element, "usm-business-keyboard__key");

    getElementProps(buttons[0]).onClick?.();

    expect(getElementProps(buttons[0])["aria-disabled"]).toBe(true);
    expect(onKeyPress).not.toHaveBeenCalled();
  });

  it("sets an accessible group label", () => {
    const element = BusinessKeyboard({
      ariaLabel: "Amount keyboard",
      config: createAccountingCalcKeyboardConfig(),
    });

    expect(getElementProps(element).role).toBe("group");
    expect(getElementProps(element)["aria-label"]).toBe("Amount keyboard");
  });
});

function findElementsByClassName(
  node: React.ReactNode,
  className: string,
): React.ReactElement[] {
  return findElements(node, (element) =>
    String(getElementProps(element).className ?? "")
      .split(" ")
      .includes(className),
  );
}

function findElementsByType(
  node: React.ReactNode,
  type: string,
): React.ReactElement[] {
  return findElements(node, (element) => element.type === type);
}

function findElements(
  node: React.ReactNode,
  predicate: (element: React.ReactElement) => boolean,
): React.ReactElement[] {
  if (!React.isValidElement(node)) return [];

  const matches = predicate(node) ? [node] : [];
  const children = React.Children.toArray(
    getElementProps(node).children,
  ).flatMap((child) => findElements(child, predicate));

  return [...matches, ...children];
}

function getText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (!React.isValidElement(node)) return "";

  return React.Children.toArray(getElementProps(node).children)
    .map(getText)
    .join("");
}

type TestElementProps = {
  "aria-label"?: string;
  "aria-disabled"?: boolean;
  children?: React.ReactNode;
  className?: string;
  "data-key-action"?: string;
  "data-key-id"?: string;
  "data-key-label"?: string;
  "data-key-variant"?: string;
  onClick?: () => void;
  role?: string;
  style?: React.CSSProperties;
};

function getElementProps(element: React.ReactElement): TestElementProps {
  return element.props as TestElementProps;
}

type TestVibrationHost = typeof globalThis & {
  wx?: {
    vibrateShort?: (options?: { type?: "heavy" | "medium" | "light" }) => void;
  };
};
