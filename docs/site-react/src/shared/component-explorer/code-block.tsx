import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import type { EditorLanguage } from "./types";

export function EditableCodeBlock(props: {
  value: string;
  language?: EditorLanguage;
  error?: string | null;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}) {
  const [draft, setDraft] = useState(props.value);
  const value = props.onChange || props.readOnly ? props.value : draft;

  return (
    <div className={props.error ? "code-editor code-editor--error" : "code-editor"}>
      <CodeMirror
        basicSetup={{
          foldGutter: false,
          highlightActiveLine: false,
          lineNumbers: false,
        }}
        extensions={editorExtensions(props.language ?? "tsx")}
        editable={!props.readOnly}
        onChange={(nextValue) => {
          if (props.readOnly) return;

          if (props.onChange) {
            props.onChange(nextValue);
          } else {
            setDraft(nextValue);
          }
        }}
        readOnly={props.readOnly}
        theme="light"
        value={value}
      />
      {props.error ? <p className="code-editor__error">{props.error}</p> : null}
    </div>
  );
}

export function StaticCodeBlock(props: {
  value: string;
  copyLabel: string;
  copiedLabel: string;
  language?: EditorLanguage;
}) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    const didCopy = await copyText(props.value);

    setCopied(didCopy);

    if (didCopy) {
      window.setTimeout(() => setCopied(false), 1200);
    }
  }

  return (
    <div className="static-code">
      <EditableCodeBlock
        language={props.language ?? "tsx"}
        readOnly
        value={props.value}
      />
      <button className="copy-code-button" onClick={copyCode} type="button">
        {copied ? props.copiedLabel : props.copyLabel}
      </button>
    </div>
  );
}

function editorExtensions(language: EditorLanguage) {
  return language === "json" ? [json()] : [javascript({ jsx: true, typescript: true })];
}

async function copyText(value: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);

      return true;
    }
  } catch {
    // Fall back to the textarea path below for browsers that block Clipboard API.
  }

  try {
    const textarea = document.createElement("textarea");

    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const didCopy = document.execCommand("copy");

    document.body.removeChild(textarea);

    return didCopy;
  } catch {
    return false;
  }
}
