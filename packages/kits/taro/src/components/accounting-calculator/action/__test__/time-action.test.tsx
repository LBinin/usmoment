// @vitest-environment jsdom

import React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TimeAction, type TimeActionProps } from "../time-action";

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

describe("TimeAction", () => {
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

  it("renders a time picker trigger with a fixed display format", () => {
    const markup = renderToStaticMarkup(<TimeAction defaultValue="00:25" />);

    expect(markup).toContain("usm-accounting-calculator-date-time-action");
    expect(markup).toContain("00:25");
    expect(pickerState.props).toMatchObject({
      mode: "time",
      value: "00:25",
    });
    expect(pickerState.props?.start).toBeUndefined();
    expect(pickerState.props?.end).toBeUndefined();
  });

  it("uses the controlled value before the default value", () => {
    renderToStaticMarkup(
      <TimeAction defaultValue="08:30" value="20:05" />,
    );

    expect(pickerState.props?.value).toBe("20:05");
  });

  it("falls back to the current time for invalid standard values", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 19, 11, 22, 0));

    const markup = renderToStaticMarkup(
      <TimeAction defaultValue="08:30" value="25:61" />,
    );

    expect(markup).toContain("11:22");
    expect(pickerState.props?.value).toBe("11:22");
  });

  it("takes the current time only once for the uncontrolled default", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 19, 11, 22, 0));

    act(() => {
      root.render(<TimeAction />);
    });

    expect(container.textContent).toContain("11:22");

    vi.setSystemTime(new Date(2026, 4, 19, 11, 23, 0));

    act(() => {
      root.render(<TimeAction className="rerendered-time-action" />);
    });

    expect(container.textContent).toContain("11:22");
  });

  it("emits the confirmed time and updates uncontrolled display", () => {
    const onChange = vi.fn<NonNullable<TimeActionProps["onChange"]>>();

    act(() => {
      root.render(<TimeAction defaultValue="00:25" onChange={onChange} />);
    });

    act(() => {
      pickerState.props?.onChange?.({ detail: { value: "15:08" } });
    });

    expect(onChange).toHaveBeenCalledWith({
      displayValue: "15:08",
      value: "15:08",
    });
    expect(container.textContent).toContain("15:08");
  });

  it("does not update when picker cancellation fires", () => {
    const onChange = vi.fn<NonNullable<TimeActionProps["onChange"]>>();

    act(() => {
      root.render(<TimeAction defaultValue="00:25" onChange={onChange} />);
    });

    act(() => {
      pickerState.props?.onCancel?.();
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(container.textContent).toContain("00:25");
  });

  it("does not emit picker changes while disabled", () => {
    const onChange = vi.fn<NonNullable<TimeActionProps["onChange"]>>();

    act(() => {
      root.render(
        <TimeAction defaultValue="00:25" disabled onChange={onChange} />,
      );
    });

    act(() => {
      pickerState.props?.onChange?.({ detail: { value: "15:08" } });
    });

    expect(pickerState.props?.disabled).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
    expect(container.textContent).toContain("00:25");
  });
});
