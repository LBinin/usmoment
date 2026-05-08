import React, { useEffect, useState } from "react";
import { isZh, type Locale } from "../i18n";
import { EditableCodeBlock } from "./code-block";

export function PlaygroundFrame(props: {
  children: React.ReactNode;
  code?: string;
  controls: React.ReactNode;
  eventText?: string;
  locale?: Locale;
  onCodeChange?: (value: string) => void;
}) {
  const [showCode, setShowCode] = useState(false);
  const [codeDraft, setCodeDraft] = useState(props.code ?? "");
  const zh = isZh(props.locale ?? "en");

  useEffect(() => {
    setCodeDraft(props.code ?? "");
  }, [props.code]);

  return (
    <div className="playground-shell">
      <div
        className={
          props.eventText ? "playground playground--with-output" : "playground"
        }
      >
        <div className="playground__controls">{props.controls}</div>
        <div className="playground__stage">{props.children}</div>
        {props.eventText ? (
          <pre className="event-log">{props.eventText}</pre>
        ) : null}
      </div>
      {props.code ? (
        <div className="playground-code-panel">
          <button
            className="show-code-button"
            onClick={() => setShowCode((value) => !value)}
            type="button"
          >
            <span aria-hidden>{showCode ? "⌃" : "⌄"}</span>
            {showCode
              ? zh
                ? "收起代码"
                : "Hide Code"
              : zh
                ? "显示代码"
                : "Show Code"}
          </button>
          {showCode ? (
            <EditableCodeBlock
              language="tsx"
              onChange={(nextValue) => {
                setCodeDraft(nextValue);
                props.onCodeChange?.(nextValue);
              }}
              value={codeDraft}
            />
          ) : null}
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
  return (
    <label className="control control--inline">
      <input
        checked={props.checked}
        onChange={(event) => props.onChange(event.target.checked)}
        type="checkbox"
      />
      <span>{props.label}</span>
    </label>
  );
}

export function SelectControl(props: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="control">
      <span>{props.label}</span>
      <select
        onChange={(event) => props.onChange(event.target.value)}
        value={props.value}
      >
        {props.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
