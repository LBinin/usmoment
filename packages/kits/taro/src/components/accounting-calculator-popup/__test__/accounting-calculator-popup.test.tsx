import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AccountingCalculatorPopup } from "..";

type PopupProps = Record<string, unknown> & {
  children?: React.ReactNode;
  contentClassName?: string;
};

const popupCalls: PopupProps[] = [];

vi.mock("@tarojs/components", () => ({
  Text: "span",
  View: "div",
}));

vi.mock("@usmoment/ui-taro", () => ({
  Popup: (props: PopupProps) => {
    popupCalls.push(props);
    return React.createElement("div", null, props.children);
  },
}));

describe("AccountingCalculatorPopup", () => {
  it("exports the accounting calculator popup kit component", () => {
    expect(typeof AccountingCalculatorPopup).toBe("function");
  });

  it("renders Popup with kit defaults", () => {
    renderPopup(<span>content</span>);

    expect(getLastPopupProps()).toMatchObject({
      animated: true,
      overlay: { visible: true, closeOnClick: true },
      placement: "bottom",
      portal: true,
      reserveSpace: true,
      safeAreaInsetBottom: true,
    });
  });

  it("passes children through as the content entry without creating a calculator", () => {
    const children = <span className="custom-child">custom entry</span>;

    renderPopup(children);

    expect(getLastPopupProps().contentClassName).toBe(
      "usm-accounting-calculator-popup__content",
    );
    const child = getOnlyChildElement(getLastPopupProps().children);
    const childProps = child.props as {
      children?: React.ReactNode;
      className?: string;
    };

    expect(childProps.className).toBe("custom-child");
    expect(childProps.children).toBe("custom entry");
    expect(String(childProps.className)).not.toContain(
      "usm-accounting-calculator",
    );
  });

  it("lets explicit Popup props override defaults and merge content classes", () => {
    renderPopup(<span>content</span>, {
      contentClassName: "caller-content",
      overlay: { visible: false, closeOnClick: false },
      reserveSpace: false,
      safeAreaInsetBottom: false,
    });

    expect(getLastPopupProps()).toMatchObject({
      overlay: { visible: false, closeOnClick: false },
      reserveSpace: false,
      safeAreaInsetBottom: false,
    });
    expect(getLastPopupProps().contentClassName).toBe(
      "usm-accounting-calculator-popup__content caller-content",
    );
  });
});

function renderPopup(
  children: React.ComponentProps<typeof AccountingCalculatorPopup>["children"],
  props: Partial<
    Omit<React.ComponentProps<typeof AccountingCalculatorPopup>, "children">
  > = {},
) {
  popupCalls.length = 0;
  renderToStaticMarkup(
    <AccountingCalculatorPopup open {...props}>
      {children}
    </AccountingCalculatorPopup>,
  );
}

function getLastPopupProps(): PopupProps {
  const props = popupCalls.at(-1);

  if (!props) {
    throw new Error("Popup was not rendered");
  }

  return props;
}

function getOnlyChildElement(node: React.ReactNode): React.ReactElement {
  const children = React.Children.toArray(node);

  if (children.length !== 1 || !React.isValidElement(children[0])) {
    throw new Error("Expected a single React element child");
  }

  return children[0];
}
