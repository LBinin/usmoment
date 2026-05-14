import React from "react";
import { View } from "@tarojs/components";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  AccountingCalculator,
  type BusinessKeyboardProps,
} from "..";
import { AccountingDisplay } from "../../accounting-display";

vi.mock("@tarojs/components", () => ({
  Button: "button",
  Input: ({ placeholderStyle: _placeholderStyle, ...props }: Record<string, unknown>) =>
    React.createElement("input", props),
  ScrollView: ({
    enhanced: _enhanced,
    scrollX: _scrollX,
    scrollY: _scrollY,
    showScrollbar: _showScrollbar,
    ...props
  }: Record<string, unknown>) => React.createElement("div", props),
  Text: "span",
  View: "div",
}));

describe("AccountingCalculator", () => {
  it("exports the single accounting calculator kit component", () => {
    expect(typeof AccountingCalculator).toBe("function");
  });

  it("passes business keyboard props through to the internal keyboard", () => {
    let keyboardProps: BusinessKeyboardProps | undefined;

    renderToStaticMarkup(
      <AccountingCalculator
        ariaLabel="Amount keypad"
        className="custom-keyboard"
        disabled
        keyHeight="96rpx"
        renderKeyboard={(props) => {
          keyboardProps = props;
          return null;
        }}
        vibrate="light"
      />,
    );

    expect(keyboardProps).toMatchObject({
      "ariaLabel": "Amount keypad",
      "disabled": true,
      "keyHeight": "96rpx",
      "vibrate": "light",
    });
    expect(keyboardProps?.className).toContain("usm-accounting-calculator__keyboard");
    expect(keyboardProps?.className).toContain("custom-keyboard");
    expect(typeof keyboardProps?.onKeyPress).toBe("function");
  });

  it("uses AccountingDisplay as the default display surface", () => {
    const markup = renderToStaticMarkup(<AccountingCalculator />);

    expect(markup).toContain("usm-accounting-display");
  });

  it("uses defaultExpression as the uncontrolled initial expression", () => {
    const markup = renderToStaticMarkup(
      <AccountingCalculator
        defaultExpression="1+2"
        display={(expression, result) => (
          <section className="custom-display">
            {expression}:{result}
          </section>
        )}
      />,
    );

    expect(markup).toContain("1+2:3.00");
  });

  it("keeps AccountingDisplay as the default display when seeded", () => {
    const markup = renderToStaticMarkup(
      <AccountingCalculator defaultExpression="1+2" />,
    );

    expect(markup).toContain("usm-accounting-display");
    expect(markup).toContain("1+2");
    expect(markup).toContain("3.00");
  });

  it("uses expression as the controlled display expression", () => {
    const markup = renderToStaticMarkup(
      <AccountingCalculator
        expression="4+5"
        display={(expression, result) => (
          <section className="custom-display">
            {expression}:{result}
          </section>
        )}
      />,
    );

    expect(markup).toContain("4+5:9.00");
  });

  it("emits controlled expression updates without owning the expression", () => {
    const onChange = vi.fn();
    const onExpressionChange = vi.fn();
    const onSubmit = vi.fn();
    let keyboardProps: BusinessKeyboardProps | undefined;

    renderToStaticMarkup(
      <AccountingCalculator
        expression="12"
        onChange={onChange}
        onExpressionChange={onExpressionChange}
        onSubmit={onSubmit}
        renderKeyboard={(props) => {
          keyboardProps = props;
          return null;
        }}
      />,
    );

    keyboardProps?.onKeyPress?.(inputEvent("3"));
    keyboardProps?.onKeyPress?.(submitEvent());

    expect(onExpressionChange).toHaveBeenCalledWith("123", {
      expression: "123",
      result: "123.00",
    });
    expect(onChange).toHaveBeenCalledWith({
      expression: "123",
      result: "123.00",
    });
    expect(onSubmit).toHaveBeenCalledWith({
      expression: "12",
      result: "12.00",
    });
  });

  it("uses the kit mask hook for the default backspace key", () => {
    const markup = renderToStaticMarkup(<AccountingCalculator />);

    expect(markup).toContain("usm-accounting-calculator__backspace-icon");
    expect(markup).toContain("usm-icon-backspace");
    expect(markup).toContain("usm-icon--mask");
  });

  it("does not render a top accessory by default", () => {
    let keyboardProps: BusinessKeyboardProps | undefined;

    renderToStaticMarkup(
      <AccountingCalculator
        renderKeyboard={(props) => {
          keyboardProps = props;
          return null;
        }}
      />,
    );

    expect(keyboardProps?.topAccessory).toBeUndefined();
  });

  it("renders top accessory items from kit data", () => {
    const markup = renderToStaticMarkup(
      <AccountingCalculator
        topAccessoryItems={[
          { id: "payer", label: "更改付款人", avatar: <View>人</View> },
          { id: "note", label: "备注", icon: <View>备</View> },
        ]}
      />,
    );

    expect(markup).toContain("usm-business-keyboard__top-accessory");
    expect(markup).toContain("usm-accounting-calculator__top-accessory-item");
    expect(markup).toContain("更改付款人");
    expect(markup).toContain("备注");
  });

  it("lets an explicit top accessory override kit top accessory items", () => {
    const markup = renderToStaticMarkup(
      <AccountingCalculator
        topAccessory={<View className="custom-top-accessory">Custom</View>}
        topAccessoryItems={[
          { id: "payer", label: "更改付款人" },
        ]}
      />,
    );

    expect(markup).toContain("custom-top-accessory");
    expect(markup).toContain("Custom");
    expect(markup).not.toContain("更改付款人");
  });

  it("dispatches top accessory item clicks with the item payload", () => {
    const onClick = vi.fn();
    let keyboardProps: BusinessKeyboardProps | undefined;

    renderToStaticMarkup(
      <AccountingCalculator
        renderKeyboard={(props) => {
          keyboardProps = props;
          return null;
        }}
        topAccessoryItems={[
          { id: "note", label: "备注", onClick },
        ]}
      />,
    );
    const item = findElementsByClassName(
      keyboardProps?.topAccessory,
      "usm-accounting-calculator__top-accessory-item",
    )[0];

    getElementProps(item).onClick?.();

    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: "note", label: "备注" }),
    );
  });

  it("does not dispatch disabled top accessory item clicks", () => {
    const onClick = vi.fn();
    let keyboardProps: BusinessKeyboardProps | undefined;

    renderToStaticMarkup(
      <AccountingCalculator
        renderKeyboard={(props) => {
          keyboardProps = props;
          return null;
        }}
        topAccessoryItems={[
          { disabled: true, id: "image", label: "图片", onClick },
        ]}
      />,
    );
    const item = findElementsByClassName(
      keyboardProps?.topAccessory,
      "usm-accounting-calculator__top-accessory-item",
    )[0];

    getElementProps(item).onClick?.();

    expect(getElementProps(item)["aria-disabled"]).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("supports custom rendering for top accessory items", () => {
    const markup = renderToStaticMarkup(
      <AccountingCalculator
        renderTopAccessoryItem={({ item }) => (
          <View className="custom-accessory-item">{item.label}</View>
        )}
        topAccessoryItems={[
          { id: "category", label: "分类" },
        ]}
      />,
    );

    expect(markup).toContain("custom-accessory-item");
    expect(markup).toContain("分类");
    expect(markup).not.toContain("usm-accounting-calculator__top-accessory-item");
  });

  it("accepts an AccountingDisplay element for display customization", () => {
    const markup = renderToStaticMarkup(
      <AccountingCalculator display={<AccountingDisplay currencySymbol="$" />} />,
    );

    expect(markup).toContain("$");
    expect(markup).toContain("usm-accounting-display");
  });

  it("renders a caller-owned display node without injecting state", () => {
    const markup = renderToStaticMarkup(
      <AccountingCalculator display={<section className="custom-display">static</section>} />,
    );

    expect(markup).toContain("custom-display");
    expect(markup).toContain("static");
  });

  it("accepts a display function for expression and result state", () => {
    const markup = renderToStaticMarkup(
      <AccountingCalculator
        display={(expression, result) => (
          <section className="custom-display">
            {expression || "empty"}:{result}
          </section>
        )}
      />,
    );

    expect(markup).toContain("custom-display");
    expect(markup).toContain("empty:0");
  });

  it("can hide the display with false", () => {
    const markup = renderToStaticMarkup(<AccountingCalculator display={false} />);

    expect(markup).not.toContain("usm-accounting-display");
  });
});

type KeyboardEvent = Parameters<NonNullable<BusinessKeyboardProps["onKeyPress"]>>[0];

type TestElementProps = {
  [key: string]: unknown;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

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

function getElementProps(element: React.ReactElement): TestElementProps {
  return element.props as TestElementProps;
}

function inputEvent(value: string): KeyboardEvent {
  return {
    action: "input",
    value,
    key: {
      action: "input",
      id: value,
      label: value,
      span: 1,
      value,
      variant: "number",
    },
  };
}

function submitEvent(): KeyboardEvent {
  return {
    action: "submit",
    key: {
      action: "submit",
      id: "submit",
      label: "Submit",
      span: 1,
      variant: "primary",
    },
  };
}
