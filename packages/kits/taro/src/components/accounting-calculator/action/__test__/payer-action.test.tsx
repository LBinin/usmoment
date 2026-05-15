import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import {
  AccountingCalculatorPayerAction,
  type AccountingCalculatorPayerActionProps,
} from "../payer-action";

type PickerViewProps = {
  children?: React.ReactNode;
  onChange?: (event: { detail: { value: number[] } }) => void;
};

const pickerState = vi.hoisted(() => ({
  props: undefined as PickerViewProps | undefined,
}));

vi.mock("@tarojs/components", () => ({
  Image: "image",
  PickerView: ({
    immediateChange: _immediateChange,
    indicatorClass: _indicatorClass,
    ...props
  }: PickerViewProps & Record<string, unknown>) => {
    pickerState.props = props;

    return React.createElement("picker-view", props);
  },
  PickerViewColumn: "picker-view-column",
  Text: "span",
  View: "div",
}));

describe("AccountingCalculatorPayerAction", () => {
  const options: AccountingCalculatorPayerActionProps["options"] = [
    { avatarSrc: "/payer-a.png", id: "me", name: "我" },
    { avatarSrc: "/payer-b.png", id: "friend", name: "朋友" },
  ];

  it("renders payer options with avatars and names", () => {
    const markup = renderToStaticMarkup(
      <AccountingCalculatorPayerAction options={options} value="friend" />,
    );

    expect(markup).toContain("usm-accounting-calculator-payer-action");
    expect(markup).toContain("/payer-a.png");
    expect(markup).toContain("/payer-b.png");
    expect(markup).toContain("朋友");
  });

  it("emits the selected payer when picker value changes", () => {
    const onChange = vi.fn();
    renderToStaticMarkup(
      <AccountingCalculatorPayerAction
        onChange={onChange}
        options={options}
        value="me"
      />,
    );

    pickerState.props?.onChange?.({ detail: { value: [1] } });

    expect(onChange).toHaveBeenCalledWith({
      index: 1,
      option: options[1],
    });
  });
});
