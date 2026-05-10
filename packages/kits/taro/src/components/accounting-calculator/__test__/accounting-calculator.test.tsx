import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AccountingCalculator, type BusinessKeyboardProps } from "..";

vi.mock("@tarojs/components", () => ({
  Button: "button",
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
});
