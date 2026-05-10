import { describe, expect, it } from "vitest";
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

  it("uses AccountingDisplay as the default display surface", () => {
    const markup = renderToStaticMarkup(<AccountingCalculator />);

    expect(markup).toContain("usm-accounting-display");
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
