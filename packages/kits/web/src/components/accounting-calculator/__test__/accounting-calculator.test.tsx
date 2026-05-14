import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  AccountingCalculator,
  type BusinessKeyboardProps,
} from "..";
import { AccountingDisplay } from "../../accounting-display";

describe("AccountingCalculator", () => {
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
