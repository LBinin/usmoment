// @vitest-environment jsdom

import React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { NoteAction, type NoteActionProps } from "../note-action";

type TextareaProps = {
  adjustPosition?: boolean;
  autoHeight?: boolean;
  children?: React.ReactNode;
  className?: string;
  confirmHold?: boolean;
  confirmType?: string;
  cursorSpacing?: number;
  disableDefaultPadding?: boolean;
  focus?: boolean;
  maxlength?: number;
  onBlur?: () => void;
  onConfirm?: (event: { detail: { value: string } }) => void;
  onFocus?: () => void;
  onInput?: (event: { detail: { value: string } }) => void;
  onLineChange?: unknown;
  placeholder?: string;
  showConfirmBar?: boolean;
  value?: string;
};

const textareaState = vi.hoisted(() => ({
  props: undefined as TextareaProps | undefined,
}));

vi.mock("@tarojs/components", () => ({
  ScrollView: ({
    enhanced: _enhanced,
    scrollY: _scrollY,
    showScrollbar: _showScrollbar,
    ...props
  }: Record<string, unknown>) => React.createElement("div", props),
  Textarea: (props: TextareaProps) => {
    textareaState.props = props;

    return React.createElement("textarea", {
      className: props.className,
      placeholder: props.placeholder,
      readOnly: true,
      value: props.value,
    });
  },
  View: "div",
}));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

describe("NoteAction", () => {
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
    textareaState.props = undefined;
  });

  it("renders an auto-height textarea inside a scrollable editing surface", () => {
    const markup = renderToStaticMarkup(
      <NoteAction placeholder="输入账单备注" value="已有备注" />,
    );

    expect(markup).toContain("usm-accounting-calculator-note-action");
    expect(markup).toContain("usm-accounting-calculator-note-action__surface");
    expect(markup).toContain("usm-accounting-calculator-note-action__scroller");
    expect(markup).toContain("usm-accounting-calculator-note-action__content");
    expect(markup).toContain("usm-accounting-calculator-note-action__textarea");
    expect(textareaState.props).toMatchObject({
      adjustPosition: true,
      autoHeight: true,
      confirmHold: false,
      confirmType: "done",
      cursorSpacing: 24,
      disableDefaultPadding: true,
      focus: false,
      maxlength: -1,
      placeholder: "输入账单备注",
      showConfirmBar: true,
      value: "已有备注",
    });
    expect(textareaState.props?.onLineChange).toBeUndefined();
  });

  it("focuses the textarea when clicking the white editing surface", () => {
    act(() => {
      root.render(<NoteAction value="" />);
    });

    expect(textareaState.props?.focus).toBe(false);

    act(() => {
      (
        container.querySelector(
          ".usm-accounting-calculator-note-action__surface",
        ) as HTMLDivElement
      ).click();
    });

    expect(textareaState.props?.focus).toBe(true);
  });

  it("emits note value changes and keeps confirm separate from panel closing", () => {
    const onChange = vi.fn<NonNullable<NoteActionProps["onChange"]>>();
    const onConfirm = vi.fn<NonNullable<NoteActionProps["onConfirm"]>>();
    renderToStaticMarkup(
      <NoteAction onChange={onChange} onConfirm={onConfirm} value="" />,
    );

    textareaState.props?.onInput?.({ detail: { value: "今天吃了汉堡" } });
    textareaState.props?.onConfirm?.({ detail: { value: "今天吃了汉堡" } });

    expect(onChange).toHaveBeenCalledWith("今天吃了汉堡");
    expect(onConfirm).toHaveBeenCalledWith("今天吃了汉堡");
  });
});
