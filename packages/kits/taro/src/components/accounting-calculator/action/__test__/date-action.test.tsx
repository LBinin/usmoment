// @vitest-environment jsdom

import React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DateAction, type DateActionProps } from "../date-action";

type PickerProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  mode?: string;
  onCancel?: () => void;
  onChange?: (event: { detail: { value: string } }) => void;
  start?: string;
  end?: string;
  value?: string;
};

const pickerState = vi.hoisted(() => ({
  props: undefined as PickerProps | undefined,
}));

vi.mock("@tarojs/components", () => ({
  Picker: (props: PickerProps) => {
    pickerState.props = props;

    return React.createElement(
      "picker",
      {
        "data-mode": props.mode,
        "data-value": props.value,
      },
      props.children,
    );
  },
  Text: "span",
  View: "div",
}));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

describe("DateAction", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    pickerState.props = undefined;
    vi.useRealTimers();
  });

  it("renders a date picker trigger with a fixed display format", () => {
    const markup = renderToStaticMarkup(
      <DateAction defaultValue="2024-03-15" />,
    );

    expect(markup).toContain("usm-accounting-calculator-date-time-action");
    expect(toVisibleText(markup)).toContain("2024年03月15日");
    expect(pickerState.props).toMatchObject({
      mode: "date",
      value: "2024-03-15",
    });
    expect(pickerState.props?.start).toBeUndefined();
    expect(pickerState.props?.end).toBeUndefined();
  });

  it("uses the controlled value before the default value", () => {
    renderToStaticMarkup(
      <DateAction defaultValue="2023-01-01" value="2024-12-05" />,
    );

    expect(pickerState.props?.value).toBe("2024-12-05");
  });

  it("falls back to the current date for invalid standard values", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 19, 11, 22, 0));

    const markup = renderToStaticMarkup(
      <DateAction defaultValue="2023-01-01" value="2024-02-30" />,
    );

    expect(toVisibleText(markup)).toContain("2026年05月19日");
    expect(pickerState.props?.value).toBe("2026-05-19");
  });

  it("takes the current date only once for the uncontrolled default", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 19, 11, 22, 0));

    act(() => {
      root.render(<DateAction />);
    });

    expect(container.textContent).toContain("2026年05月19日");

    vi.setSystemTime(new Date(2026, 4, 20, 11, 22, 0));

    act(() => {
      root.render(<DateAction className="rerendered-date-action" />);
    });

    expect(container.textContent).toContain("2026年05月19日");
  });

  it("emits the confirmed date and updates uncontrolled display", () => {
    const onChange = vi.fn<NonNullable<DateActionProps["onChange"]>>();

    act(() => {
      root.render(<DateAction defaultValue="2024-03-15" onChange={onChange} />);
    });

    act(() => {
      pickerState.props?.onChange?.({ detail: { value: "2024-04-02" } });
    });

    expect(onChange).toHaveBeenCalledWith({
      displayValue: "2024年04月02日",
      value: "2024-04-02",
    });
    expect(container.textContent).toContain("2024年04月02日");
  });

  it("does not update when picker cancellation fires", () => {
    const onChange = vi.fn<NonNullable<DateActionProps["onChange"]>>();

    act(() => {
      root.render(<DateAction defaultValue="2024-03-15" onChange={onChange} />);
    });

    act(() => {
      pickerState.props?.onCancel?.();
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(container.textContent).toContain("2024年03月15日");
  });

  it("does not emit picker changes while disabled", () => {
    const onChange = vi.fn<NonNullable<DateActionProps["onChange"]>>();

    act(() => {
      root.render(
        <DateAction defaultValue="2024-03-15" disabled onChange={onChange} />,
      );
    });

    act(() => {
      pickerState.props?.onChange?.({ detail: { value: "2024-04-02" } });
    });

    expect(pickerState.props?.disabled).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
    expect(container.textContent).toContain("2024年03月15日");
  });
});

function toVisibleText(markup: string): string {
  return markup.replace(/<[^>]*>/g, "");
}
