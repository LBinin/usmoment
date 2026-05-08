import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import type { EditorLanguage } from "./types";

export function CodeEditor(props: {
  value: string;
  language: EditorLanguage;
  onChange: (value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <CodeMirror
      basicSetup={{
        foldGutter: false,
        highlightActiveLine: false,
        lineNumbers: false,
      }}
      extensions={editorExtensions(props.language)}
      editable={!props.readOnly}
      onChange={(nextValue) => {
        if (!props.readOnly) {
          props.onChange(nextValue);
        }
      }}
      readOnly={props.readOnly}
      theme="light"
      value={props.value}
    />
  );
}

function editorExtensions(language: EditorLanguage) {
  return language === "json" ? [json()] : [javascript({ jsx: true, typescript: true })];
}
