import { useState } from "react";
import {
  createAccountingCalcKeyboardConfig,
  createBusinessKeyboardConfig,
  createBusinessKeyboardEvent,
  createExpressionEngine,
  createSelectionState,
  resolveBusinessKeyboardConfig,
  type BusinessKeyboardKey,
  type BusinessKeyboardLayout,
} from "@usmoment/headless";
import { isZh } from "../i18n";
import {
  CodeEditorControl,
  PlaygroundFrame,
  SelectControl,
  TextControl,
} from "./playground-frame";
import type { PlaygroundLocaleProps } from "./playground-types";
import {
  formatJson,
  parseJson,
  parseJsonError,
  readObjectLiteralValue,
  readObjectNumberProp,
  readObjectStringProp,
  readTokenArray,
  readToggleValues,
} from "./playground-utils";

export function ExpressionEnginePlayground(props: PlaygroundLocaleProps) {
  const zh = isZh(props.locale ?? "en");
  const [scale, setScale] = useState("2");
  const [tokens, setTokens] = useState("12+8");
  const engine = createExpressionEngine({ scale: Number(scale) });
  const tokenList = tokens.split("");

  for (const token of tokenList) {
    engine.input(token);
  }

  const output = {
    inputTokens: tokenList,
    expression: engine.expression(),
    result: engine.evaluate(),
  };

  return (
    <PlaygroundFrame
      code={`const engine = createExpressionEngine({ scale: ${Number(scale) || 0} })

for (const token of ${JSON.stringify(tokenList)}) {
  engine.input(token)
}

const output = {
  expression: engine.expression(),
  result: engine.evaluate(),
}`}
      onCodeChange={(code) => {
        const nextScale = readObjectNumberProp(code, "scale");
        const nextTokens = readTokenArray(code);

        if (nextScale !== null) setScale(String(nextScale));
        if (nextTokens !== null) setTokens(nextTokens.join(""));
      }}
      locale={props.locale}
      variant="headless"
      controls={
        <>
          <TextControl label="tokens" onChange={setTokens} value={tokens} />
          <SelectControl
            label="scale"
            onChange={setScale}
            options={["0", "1", "2", "3", "4"]}
            value={scale}
          />
          <button
            className="debug-action"
            onClick={() => setTokens((value) => value.slice(0, -1))}
            type="button"
          >
            {zh ? "退格" : "Backspace"}
          </button>
          <button
            className="debug-action"
            onClick={() => setTokens("")}
            type="button"
          >
            {zh ? "清空" : "Clear"}
          </button>
        </>
      }
    >
      <div className="headless-debugger">
        <div>
          <h5>{zh ? "当前状态" : "Current State"}</h5>
          <pre className="json-preview">{formatJson(output)}</pre>
        </div>
        <div>
          <h5>{zh ? "试一试" : "Try"}</h5>
          <div className="token-pad">
            {[
              "7",
              "8",
              "9",
              "+",
              "4",
              "5",
              "6",
              "-",
              "1",
              "2",
              "3",
              "×",
              "0",
              ".",
              "÷",
            ].map((token) => (
              <button
                key={token}
                onClick={() => setTokens((value) => `${value}${token}`)}
                type="button"
              >
                {token}
              </button>
            ))}
          </div>
        </div>
      </div>
    </PlaygroundFrame>
  );
}

export function SelectionStateCorePlayground(props: PlaygroundLocaleProps) {
  const zh = isZh(props.locale ?? "en");
  const [mode, setMode] = useState<"single" | "multi">("single");
  const [selected, setSelected] = useState<string[]>([]);
  const options = ["food", "rent", "travel", "gift"];

  function toggle(key: string) {
    const state = createSelectionState({ mode });

    for (const value of selected) {
      state.toggle(value);
    }

    state.toggle(key);
    setSelected(state.values());
  }

  function changeMode(nextMode: string) {
    setMode(nextMode as "single" | "multi");
    setSelected([]);
  }

  return (
    <PlaygroundFrame
      code={`const state = createSelectionState({ mode: "${mode}" })

${selected.map((value) => `state.toggle("${value}")`).join("\n")}

const selectedValues = state.values()`}
      onCodeChange={(code) => {
        const nextMode = readObjectStringProp(code, "mode");
        const nextSelected = readToggleValues(code);

        if (nextMode === "single" || nextMode === "multi") {
          setMode(nextMode);
        }
        setSelected(nextSelected);
      }}
      locale={props.locale}
      variant="headless"
      controls={
        <>
          <SelectControl
            label="mode"
            onChange={changeMode}
            options={["single", "multi"]}
            value={mode}
          />
          <button
            className="debug-action"
            onClick={() => setSelected([])}
            type="button"
          >
            {zh ? "清空" : "Clear"}
          </button>
        </>
      }
    >
      <div className="selection-debugger">
        <div className="selection-options">
          {options.map((option) => (
            <button
              className={
                selected.includes(option)
                  ? "selection-option selection-option--selected"
                  : "selection-option"
              }
              key={option}
              onClick={() => toggle(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
        <pre className="json-preview">
          {formatJson({ mode, selectedValues: selected })}
        </pre>
      </div>
    </PlaygroundFrame>
  );
}

export function BusinessKeyboardCorePlayground(props: PlaygroundLocaleProps) {
  const zh = isZh(props.locale ?? "en");
  const [submitLabel, setSubmitLabel] = useState("完成");
  const [columns, setColumns] = useState("4");
  const [keysJson, setKeysJson] = useState(
    formatJson([
      {
        id: "memo",
        label: "Memo",
        action: "custom",
        payload: { opens: "memo-sheet" },
      },
      {
        id: "wide",
        label: "Wide",
        span: 9,
      },
    ]),
  );
  const [layoutJson, setLayoutJson] = useState(
    formatJson([
      ["1", "2", "3", "memo"],
      ["wide", "0", ".", "submit"],
      ["missing-key"],
    ]),
  );
  const customKeys = parseJson<BusinessKeyboardKey[]>(keysJson, []);
  const customLayout = parseJson<BusinessKeyboardLayout | undefined>(
    layoutJson,
    undefined,
  );
  const keysJsonError = parseJsonError(keysJson);
  const layoutJsonError = parseJsonError(layoutJson);
  const jsonError =
    keysJsonError ??
    layoutJsonError ??
    (Number.isNaN(Number(columns))
      ? zh
        ? "columns 必须是数字"
        : "columns must be a number"
      : null);
  const config = createBusinessKeyboardConfig(
    createAccountingCalcKeyboardConfig({ submitLabel }),
  );
  const resolved = jsonError
    ? null
    : resolveBusinessKeyboardConfig({
        config,
        keys: customKeys,
        layout: customLayout,
        columns: Number(columns),
      });
  const sampleEvent = resolved?.flatKeys[0]
    ? createBusinessKeyboardEvent(resolved.flatKeys[0])
    : null;

  return (
    <PlaygroundFrame
      code={`const config = createBusinessKeyboardConfig(
  createAccountingCalcKeyboardConfig({ submitLabel: "${submitLabel}" }),
)

const resolved = resolveBusinessKeyboardConfig({
  config,
  keys: ${keysJson},
  layout: ${layoutJson},
  columns: ${Number(columns) || 0},
})`}
      onCodeChange={(code) => {
        const nextSubmitLabel = readObjectStringProp(code, "submitLabel");
        const nextColumns = readObjectNumberProp(code, "columns");
        const nextKeysJson = readObjectLiteralValue(code, "keys");
        const nextLayoutJson = readObjectLiteralValue(code, "layout");

        if (nextSubmitLabel !== null) setSubmitLabel(nextSubmitLabel);
        if (nextColumns !== null) setColumns(String(nextColumns));
        if (nextKeysJson !== null) setKeysJson(nextKeysJson);
        if (nextLayoutJson !== null) setLayoutJson(nextLayoutJson);
      }}
      locale={props.locale}
      variant="headless"
      controls={
        <>
          <TextControl
            label="submitLabel"
            onChange={setSubmitLabel}
            value={submitLabel}
          />
          <TextControl label="columns" onChange={setColumns} value={columns} />
          <CodeEditorControl
            error={keysJsonError}
            label={zh ? "自定义 keys" : "custom keys"}
            onChange={setKeysJson}
            value={keysJson}
          />
          <CodeEditorControl
            error={layoutJsonError}
            label={zh ? "布局 layout" : "layout"}
            onChange={setLayoutJson}
            value={layoutJson}
          />
        </>
      }
    >
      {jsonError ? (
        <div className="debug-error">{jsonError}</div>
      ) : (
        <div className="headless-debugger">
          <div className="headless-debugger__summary">
            <div className="headless-debugger__metric">
              <span>{zh ? "警告" : "Warnings"}</span>
              <strong>{resolved?.warnings.length ?? 0}</strong>
            </div>
            <div className="headless-debugger__metric">
              <span>{zh ? "行" : "Rows"}</span>
              <strong>{resolved?.rows.length ?? 0}</strong>
            </div>
            <div className="headless-debugger__metric">
              <span>{zh ? "按键" : "Keys"}</span>
              <strong>{resolved?.flatKeys.length ?? 0}</strong>
            </div>
          </div>
          <div className="headless-debugger__section">
            <h5>{zh ? "警告" : "Warnings"}</h5>
            <pre className="json-preview">
              {formatJson(resolved?.warnings ?? [])}
            </pre>
          </div>
          <div className="headless-debugger__section headless-debugger__section--primary">
            <h5>{zh ? "解析后的行" : "Resolved Rows"}</h5>
            <pre className="json-preview">
              {formatJson(
                resolved?.rows.map((row) =>
                  row.map((key) => ({
                    id: key.id,
                    label: key.label,
                    span: key.span,
                    action: key.action,
                    variant: key.variant,
                  })),
                ) ?? [],
              )}
            </pre>
          </div>
          <div className="headless-debugger__section">
            <h5>{zh ? "展平 key 顺序" : "Flat Keys"}</h5>
            <pre className="json-preview">
              {formatJson(resolved?.flatKeys.map((key) => key.id) ?? [])}
            </pre>
          </div>
          <div className="headless-debugger__section">
            <h5>{zh ? "示例事件" : "Sample Event"}</h5>
            <pre className="json-preview">{formatJson(sampleEvent)}</pre>
          </div>
        </div>
      )}
    </PlaygroundFrame>
  );
}
