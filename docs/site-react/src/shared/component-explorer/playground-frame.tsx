import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { isZh, type Locale } from "../i18n";
import { EditableCodeBlock } from "./code-block";

export function PlaygroundFrame(props: {
  children: React.ReactNode;
  code?: string;
  controls: React.ReactNode;
  eventText?: string;
  locale?: Locale;
  onCodeChange?: (value: string) => void;
  variant?: "default" | "headless";
}) {
  const [showCode, setShowCode] = useState(false);
  const [codeDraft, setCodeDraft] = useState(props.code ?? "");
  const zh = isZh(props.locale ?? "en");
  const isHeadless = props.variant === "headless";

  useEffect(() => {
    setCodeDraft(props.code ?? "");
  }, [props.code]);

  return (
    <div
      className={
        isHeadless
          ? "playground-shell playground-shell--headless"
          : "playground-shell"
      }
    >
      <div className="playground-lab__header">
        <strong>{zh ? "交互实验室" : "Interactive Lab"}</strong>
      </div>
      <div
        className={
          [
            "playground",
            props.eventText ? "playground--with-output" : "",
            isHeadless ? "playground--headless" : "",
          ]
            .filter(Boolean)
            .join(" ")
        }
      >
        <div className="playground__stage">
          {isHeadless ? (
            <strong className="playground__region-title">
              {zh ? "解析输出" : "Resolved Output"}
            </strong>
          ) : null}
          {props.children}
        </div>
        <div className="playground__controls">
          {isHeadless ? (
            <strong className="playground__region-title">
              {zh ? "输入配置" : "Input Config"}
            </strong>
          ) : null}
          {props.controls}
        </div>
      </div>
      {props.eventText ? <pre className="event-log">{props.eventText}</pre> : null}
      {props.code ? (
        <div className="playground-code-toggle">
          <button
            className="show-code-button"
            onClick={() => setShowCode((value) => !value)}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="show-code-button__icon"
              viewBox="0 0 16 16"
            >
              <path d={showCode ? "M4 10.5 8 6l4 4.5" : "M4 5.5 8 10l4-4.5"} />
            </svg>
            {showCode
              ? zh
                ? "收起代码"
                : "Hide Code"
              : zh
                ? "显示代码"
                : "Show Code"}
          </button>
        </div>
      ) : null}
      {props.code && showCode ? (
        <div className="playground-code-panel">
          <EditableCodeBlock
            language="tsx"
            onChange={(nextValue) => {
              setCodeDraft(nextValue);
              props.onCodeChange?.(nextValue);
            }}
            value={codeDraft}
          />
        </div>
      ) : null}
    </div>
  );
}

export function TextControl(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="control">
      <span>{props.label}</span>
      <input
        onChange={(event) => props.onChange(event.target.value)}
        value={props.value}
      />
    </label>
  );
}

export function CodeEditorControl(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}) {
  return (
    <label className="control">
      <span>{props.label}</span>
      <EditableCodeBlock
        error={props.error}
        language="json"
        onChange={props.onChange}
        value={props.value}
      />
    </label>
  );
}

export function ToggleControl(props: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  const id = React.useId();

  return (
    <div className="control control--inline">
      <Checkbox
        checked={props.checked}
        id={id}
        onCheckedChange={(checked) => props.onChange(checked === true)}
      />
      <label htmlFor={id}>{props.label}</label>
    </div>
  );
}

export function SelectControl(props: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="control">
      <span>{props.label}</span>
      <Select
        onValueChange={props.onChange}
        value={props.value}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {props.options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
