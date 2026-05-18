import React, { useState } from "react";
import { ScrollView, Textarea, View } from "@tarojs/components";
import type { TextareaProps } from "@tarojs/components/types/Textarea";
import clsx from "clsx";
import "./note-action.css";

const DEFAULT_NOTE_ACTION_CURSOR_SPACING = 24;
const DEFAULT_NOTE_ACTION_PLACEHOLDER = "点击输入账单备注";

type NoteActionInputEvent = {
  detail: {
    value: string;
  };
};

export type NoteActionProps = {
  adjustPosition?: TextareaProps["adjustPosition"];
  className?: string;
  confirmType?: TextareaProps["confirmType"];
  confirmHold?: TextareaProps["confirmHold"];
  cursorSpacing?: TextareaProps["cursorSpacing"];
  defaultValue?: string;
  disabled?: boolean;
  maxLength?: TextareaProps["maxlength"];
  placeholder?: string;
  showConfirmBar?: TextareaProps["showConfirmBar"];
  textareaClassName?: string;
  value?: string;
  onChange?: (value: string) => void;
  onConfirm?: (value: string) => void;
};

export function NoteAction(props: NoteActionProps) {
  const [isTextareaFocused, setIsTextareaFocused] = useState(false);
  const focusTextarea = () => {
    if (!props.disabled) {
      setIsTextareaFocused(true);
    }
  };
  const textareaProps = {
    adjustPosition: props.adjustPosition ?? true,
    autoHeight: true,
    className: clsx(
      "usm-accounting-calculator-note-action__textarea",
      props.textareaClassName,
    ),
    confirmHold: props.confirmHold ?? false,
    confirmType: props.confirmType ?? "done",
    cursorSpacing:
      props.cursorSpacing ?? DEFAULT_NOTE_ACTION_CURSOR_SPACING,
    disableDefaultPadding: true,
    disabled: props.disabled,
    focus: isTextareaFocused,
    maxlength: props.maxLength ?? -1,
    onBlur: () => setIsTextareaFocused(false),
    onConfirm: props.onConfirm
      ? (event: NoteActionInputEvent) => props.onConfirm?.(event.detail.value)
      : undefined,
    onFocus: () => setIsTextareaFocused(true),
    onInput: props.onChange
      ? (event: NoteActionInputEvent) => props.onChange?.(event.detail.value)
      : undefined,
    placeholder: props.placeholder ?? DEFAULT_NOTE_ACTION_PLACEHOLDER,
    showConfirmBar: props.showConfirmBar ?? true,
    ...(props.defaultValue !== undefined
      ? { defaultValue: props.defaultValue }
      : {}),
    ...(props.value !== undefined ? { value: props.value } : {}),
  } satisfies TextareaProps;

  return (
    <View
      className={clsx(
        "usm-accounting-calculator-note-action",
        props.className,
      )}
    >
      <View
        className="usm-accounting-calculator-note-action__surface"
        onClick={focusTextarea}
      >
        <ScrollView
          className="usm-accounting-calculator-note-action__scroller"
          enhanced
          scrollY
          showScrollbar={false}
        >
          <View
            className="usm-accounting-calculator-note-action__content"
            onClick={focusTextarea}
          >
            <Textarea {...textareaProps} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
