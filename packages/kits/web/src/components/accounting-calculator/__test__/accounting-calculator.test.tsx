// @vitest-environment jsdom

import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  AccountingCalculator,
  type BusinessKeyboardProps,
} from "..";
import { AccountingDisplay } from "../../accounting-display";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

describe("AccountingCalculator", () => {
  let container: HTMLDivElement;
  let root: Root;
  let originalNavigatorVibrate: Navigator["vibrate"];

  beforeEach(() => {
    originalNavigatorVibrate = navigator.vibrate;
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    vi.useRealTimers();
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      value: originalNavigatorVibrate,
    });
    container.remove();
  });

  it("exports the single web accounting calculator kit component", () => {
    expect(typeof AccountingCalculator).toBe("function");
  });

  it("passes business keyboard props through to the internal keyboard", () => {
    let keyboardProps: BusinessKeyboardProps | undefined;

    renderToStaticMarkup(
      <AccountingCalculator
        ariaLabel="Amount keypad"
        className="custom-keyboard"
        disabled
        keyHeight={72}
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
      "keyHeight": 72,
      "vibrate": "light",
    });
    expect(keyboardProps?.className).toContain("usm-accounting-calculator__keyboard");
    expect(keyboardProps?.className).toContain("custom-keyboard");
    expect(typeof keyboardProps?.onKeyPress).toBe("function");
  });

  it("uses Mini Program-aligned keyboard defaults", () => {
    let keyboardProps: BusinessKeyboardProps | undefined;

    renderToStaticMarkup(
      <AccountingCalculator
        renderKeyboard={(props) => {
          keyboardProps = props;
          return null;
        }}
      />,
    );

    expect(keyboardProps).toMatchObject({
      "columnGap": "-2px",
      "keyHeight": "57px",
      "rowGap": "-2px",
    });
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
          { id: "payer", label: "更改付款人", avatar: <span>人</span> },
          { id: "note", label: "备注", icon: <span>备</span> },
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
        topAccessory={<strong className="custom-top-accessory">Custom</strong>}
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

    expect(getElementProps(item).disabled).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("supports custom rendering for top accessory items", () => {
    const markup = renderToStaticMarkup(
      <AccountingCalculator
        renderTopAccessoryItem={({ isActive, item, open }) => (
          <span
            className="custom-accessory-item"
            data-active={String(isActive)}
            onClick={open}
          >
            {item.label}
          </span>
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

  it("opens a rendered top accessory panel in the keyboard body overlay", () => {
    vi.useFakeTimers();
    const vibrate = vi.fn();
    Object.defineProperty(navigator, "vibrate", {
      configurable: true,
      value: vibrate,
    });

    act(() => {
      root.render(
        <AccountingCalculator
          renderTopAccessoryActionPanel={({ close, item }) => (
            <section className="custom-accessory-panel">
              <span>{item.label}</span>
              <button onClick={close} type="button">close</button>
            </section>
          )}
          topAccessoryItems={[
            { id: "note", label: "备注" },
            { id: "category", label: "分类" },
          ]}
          vibrate="heavy"
        />,
      );
    });

    const item = container.querySelector(
      ".usm-accounting-calculator__top-accessory-item",
    ) as HTMLButtonElement;

    act(() => {
      item.click();
    });

    expect(
      container.querySelector(".usm-accounting-calculator__keyboard")?.className,
    ).toContain("usm-accounting-calculator__keyboard--operation-open");
    expect(item.className).toContain(
      "usm-accounting-calculator__top-accessory-item--active",
    );
    expect(
      container.querySelector(".usm-business-keyboard__body-overlay")
        ?.textContent,
    ).toContain("备注");
    expect(
      container.querySelector(".usm-accounting-calculator__operation-panel")
        ?.className,
    ).toContain("usm-accounting-calculator__operation-panel--entering");
    const operationPanel = container.querySelector(
      ".usm-accounting-calculator__operation-panel",
    );

    act(() => {
      (
        container.querySelectorAll(
          ".usm-accounting-calculator__top-accessory-item",
        )[1] as HTMLButtonElement
      ).click();
    });

    expect(
      container.querySelector(".usm-accounting-calculator__operation-panel"),
    ).toBe(operationPanel);
    expect(
      container.querySelector(".usm-business-keyboard__body-overlay")
        ?.textContent,
    ).toContain("分类");

    act(() => {
      (
        container.querySelector(
          ".custom-accessory-panel button",
        ) as HTMLButtonElement
      ).click();
    });

    expect(
      container.querySelector(".usm-accounting-calculator__keyboard")?.className,
    ).not.toContain("usm-accounting-calculator__keyboard--operation-open");
    expect(
      container.querySelector(".usm-accounting-calculator__operation-panel")
        ?.className,
    ).toContain("usm-accounting-calculator__operation-panel--closing");
    expect(vibrate).toHaveBeenCalledWith(30);
    expect(
      container.querySelector(".usm-business-keyboard__body-overlay")
        ?.textContent,
    ).toContain("分类");

    act(() => {
      vi.advanceTimersByTime(240);
    });

    expect(container.querySelector(".custom-accessory-panel")).toBeNull();
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
  disabled?: boolean;
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
