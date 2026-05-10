import { useEffect, useMemo, useState } from "react";
import {
  createAccountingCalcKeyboardConfig,
  createBusinessKeyboardConfig,
  createBusinessKeyboardEvent,
  createExpressionEngine,
  createSelectionState,
  resolveBusinessKeyboardConfig,
  type BusinessKeyboardConfig,
  type BusinessKeyboardKey,
  type BusinessKeyboardLayout,
} from "@usmoment/taro/headless";
import { BusinessKeyboard, CalcDisplay } from "@usmoment/taro/ui";
import { AccountingCalculator, AccountingDisplay } from "@usmoment/taro/kit";
import { isZh, type Locale } from "../i18n";
import {
  CodeEditorControl,
  PlaygroundFrame,
  SelectControl,
  TextControl,
  ToggleControl,
} from "./playground-frame";

type PlaygroundLocaleProps = {
  locale?: Locale;
};

export function BusinessKeyboardPlayground(props: PlaygroundLocaleProps) {
  const zh = isZh(props.locale ?? "en");
  const [submitLabel, setSubmitLabel] = useState("完成");
  const [gap, setGap] = useState("0");
  const [rowGap, setRowGap] = useState("0");
  const [columnGap, setColumnGap] = useState("0");
  const [keyHeight, setKeyHeight] = useState("60");
  const [keyFontFamily, setKeyFontFamily] = useState(
    '"Montserrat", "Avenir Next", sans-serif',
  );
  const [rightColumnWidth, setRightColumnWidth] = useState("1.2875");
  const [vibrate, setVibrate] = useState<false | "light" | "medium" | "heavy">(
    false,
  );
  const [disabled, setDisabled] = useState(false);
  const [lastEvent, setLastEvent] = useState(zh ? "点击一个按键" : "Press a key");
  const config = createAccountingCalcKeyboardConfig({ submitLabel });
  const layout = [
    ["7", "8", "9", "+"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "="],
    [".", "0", "backspace", "submit"],
  ];

  return (
    <PlaygroundFrame
      code={businessKeyboardPlaygroundCode({
        columnGap,
        gap,
        keyFontFamily,
        keyHeight,
        rightColumnWidth,
        rowGap,
        submitLabel,
        vibrate,
      })}
      onCodeChange={(code) => {
        const nextSubmitLabel = readObjectStringProp(code, "submitLabel");
        const nextGap = readJsxPropValue(code, "gap");
        const nextRowGap = readJsxPropValue(code, "rowGap");
        const nextColumnGap = readJsxPropValue(code, "columnGap");
        const nextKeyHeight = readJsxPropValue(code, "keyHeight");
        const nextKeyFontFamily = readStringProp(code, "keyFontFamily");
        const nextRightColumnWidth = readColumnWidthsLastValue(code);
        const nextVibrate = readVibrateProp(code);

        if (nextSubmitLabel !== null) setSubmitLabel(nextSubmitLabel);
        if (nextGap !== null) setGap(nextGap);
        if (nextRowGap !== null) setRowGap(nextRowGap);
        if (nextColumnGap !== null) setColumnGap(nextColumnGap);
        if (nextKeyHeight !== null) setKeyHeight(nextKeyHeight);
        if (nextKeyFontFamily !== null) setKeyFontFamily(nextKeyFontFamily);
        if (nextRightColumnWidth !== null) {
          setRightColumnWidth(nextRightColumnWidth);
        }
        if (nextVibrate !== null) setVibrate(nextVibrate);
      }}
      locale={props.locale}
      controls={
        <>
          <TextControl
            label="submitLabel"
            onChange={setSubmitLabel}
            value={submitLabel}
          />
          <TextControl label="gap" onChange={setGap} value={gap} />
          <TextControl label="rowGap" onChange={setRowGap} value={rowGap} />
          <TextControl
            label="columnGap"
            onChange={setColumnGap}
            value={columnGap}
          />
          <TextControl
            label="keyHeight"
            onChange={setKeyHeight}
            value={keyHeight}
          />
          <TextControl
            label="keyFontFamily"
            onChange={setKeyFontFamily}
            value={keyFontFamily}
          />
          <TextControl
            label={zh ? "右列宽度" : "right column"}
            onChange={setRightColumnWidth}
            value={rightColumnWidth}
          />
          <SelectControl
            label="vibrate"
            onChange={(value) =>
              setVibrate(
                value === "false"
                  ? false
                  : (value as "light" | "medium" | "heavy"),
              )
            }
            options={["false", "light", "medium", "heavy"]}
            value={String(vibrate)}
          />
          <ToggleControl
            checked={disabled}
            label={zh ? "禁用键盘" : "Disable keyboard"}
            onChange={setDisabled}
          />
        </>
      }
      eventText={lastEvent}
    >
      <div className="keyboard-demo-frame">
        <BusinessKeyboard
          ariaLabel={zh ? "金额业务键盘" : "Amount business keyboard"}
          columnGap={toPlaygroundSize(columnGap)}
          columnWidths={[1, 1, 1, Number(rightColumnWidth) || 1.2875]}
          config={config}
          disabled={disabled}
          gap={toPlaygroundSize(gap)}
          keyFontFamily={keyFontFamily}
          keyHeight={toPlaygroundSize(keyHeight)}
          keys={[
            {
              id: "=",
              label: "=",
              action: "custom",
              payload: { shortcut: "equals" },
              variant: "operator",
            },
          ]}
          layout={layout}
          onKeyPress={(event) => {
            setLastEvent(JSON.stringify(event, null, 2));
          }}
          rowGap={toPlaygroundSize(rowGap)}
          vibrate={vibrate}
        />
      </div>
    </PlaygroundFrame>
  );
}

export function CalcDisplayPlayground(_props: PlaygroundLocaleProps) {
  const [expression, setExpression] = useState("12+8");
  const [prefix, setPrefix] = useState("¥");
  const [result, setResult] = useState("20.00");
  const [showExpression, setShowExpression] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  return (
    <PlaygroundFrame
      code={`<CalcDisplay
  expression="${expression}"
  prefix="${prefix}"
  result="${result}"
  expressionVisible={${showExpression}}
  footer={${showFooter ? '"Helper text"' : "undefined"}}
/>`}
      onCodeChange={(code) => {
        const nextExpression = readStringProp(code, "expression");
        const nextPrefix = readStringProp(code, "prefix");
        const nextResult = readStringProp(code, "result");

        if (nextExpression !== null) setExpression(nextExpression);
        if (nextPrefix !== null) setPrefix(nextPrefix);
        if (nextResult !== null) setResult(nextResult);
        if (code.includes("expressionVisible={false}")) {
          setShowExpression(false);
        } else if (code.includes("expressionVisible={true}")) {
          setShowExpression(true);
        }
      }}
      locale={_props.locale}
      controls={
        <>
          <TextControl
            label="expression"
            onChange={setExpression}
            value={expression}
          />
          <TextControl label="prefix" onChange={setPrefix} value={prefix} />
          <TextControl label="result" onChange={setResult} value={result} />
          <ToggleControl
            checked={showExpression}
            label="expressionVisible"
            onChange={setShowExpression}
          />
          <ToggleControl
            checked={showFooter}
            label="footer"
            onChange={setShowFooter}
          />
        </>
      }
    >
      <div className="display-preview">
        <CalcDisplay
          expression={expression}
          expressionVisible={showExpression}
          footer={showFooter ? "Helper text" : undefined}
          prefix={prefix}
          result={result}
        />
      </div>
    </PlaygroundFrame>
  );
}

export function AccountingDisplayPlayground(props: PlaygroundLocaleProps) {
  const zh = isZh(props.locale ?? "en");
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [expression, setExpression] = useState("12+8");
  const [note, setNote] = useState("");
  const [result, setResult] = useState("20.00");

  return (
    <PlaygroundFrame
      code={accountingDisplayPlaygroundCode({
        currencySymbol,
        expression,
        note,
        result,
      })}
      onCodeChange={(code) => {
        const nextCurrencySymbol = readStringProp(code, "currencySymbol");
        const nextExpression = readStringProp(code, "expression");
        const nextNote = readStringProp(code, "noteValue");
        const nextResult = readStringProp(code, "result");

        if (nextCurrencySymbol !== null) setCurrencySymbol(nextCurrencySymbol);
        if (nextCurrencySymbol === null && !hasJsxProp(code, "currencySymbol")) {
          setCurrencySymbol("");
        }
        if (nextExpression !== null) setExpression(nextExpression);
        if (nextNote !== null) setNote(nextNote);
        if (nextResult !== null) setResult(nextResult);
      }}
      locale={props.locale}
      controls={
        <>
          <TextControl
            label="currencySymbol"
            onChange={setCurrencySymbol}
            value={currencySymbol}
          />
          <TextControl
            label="expression"
            onChange={setExpression}
            value={expression}
          />
          <TextControl label="result" onChange={setResult} value={result} />
          <TextControl
            label={zh ? "备注" : "note"}
            onChange={setNote}
            value={note}
          />
        </>
      }
    >
      <div className="kit-preview">
        <AccountingDisplay
          currencySymbol={currencySymbol === "" ? undefined : currencySymbol}
          expression={expression}
          notePlaceholder={zh ? "点击输入账单备注" : "Add a bill note"}
          noteValue={note}
          onNoteChange={setNote}
          result={result}
        />
      </div>
    </PlaygroundFrame>
  );
}

function accountingDisplayPlaygroundCode(options: {
  currencySymbol: string;
  expression: string;
  note: string;
  result: string;
}) {
  const currencySymbolLine =
    options.currencySymbol === ""
      ? ""
      : `  currencySymbol=${JSON.stringify(options.currencySymbol)}\n`;

  return `<AccountingDisplay
${currencySymbolLine}  expression=${JSON.stringify(options.expression)}
  noteValue=${JSON.stringify(options.note)}
  result=${JSON.stringify(options.result)}
  onNoteChange={(value) => setNote(value)}
/>`;
}

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

export function AccountingCalculatorPlayground(props: PlaygroundLocaleProps) {
  const [showDisplay, setShowDisplay] = useState(true);
  const [scale, setScale] = useState(2);
  const [submitLabel, setSubmitLabel] = useState("完成");
  const [vibrate, setVibrate] = useState<false | "light" | "medium" | "heavy">(
    false,
  );
  const [previewState, setPreviewState] = useState<AccountingPreviewState>(() =>
    createAccountingPreviewState("", 2),
  );

  useEffect(() => {
    setPreviewState((currentState) =>
      createAccountingPreviewState(currentState.expression, scale),
    );
  }, [scale]);

  return (
    <PlaygroundFrame
      code={`<AccountingCalculator
  display={${showDisplay ? "(expression, result) => <AccountingDisplay currencySymbol=\"¥\" expression={expression} result={result} />" : "false"}}
  scale={${scale}}
  submitLabel="${submitLabel}"
  vibrate={${vibrate ? `"${vibrate}"` : "false"}}
  onChange={(state) => console.log(state)}
  onSubmit={(state) => console.log(state)}
/>`}
      onCodeChange={(code) => {
        const nextScale = readNumberProp(code, "scale");
        const nextSubmitLabel = readStringProp(code, "submitLabel");
        const nextVibrate = readVibrateProp(code);

        if (code.includes("display={false}")) {
          setShowDisplay(false);
        } else if (code.includes("<AccountingDisplay")) {
          setShowDisplay(true);
        }
        if (nextScale !== null) setScale(nextScale);
        if (nextSubmitLabel !== null) setSubmitLabel(nextSubmitLabel);
        if (nextVibrate !== null) setVibrate(nextVibrate);
      }}
      locale={props.locale}
      controls={
        <>
          <ToggleControl
            checked={showDisplay}
            label="AccountingDisplay"
            onChange={setShowDisplay}
          />
          <SelectControl
            label="scale"
            onChange={(value) => setScale(Number(value))}
            options={["0", "1", "2", "3"]}
            value={String(scale)}
          />
          <TextControl
            label="submitLabel"
            onChange={setSubmitLabel}
            value={submitLabel}
          />
          <SelectControl
            label="vibrate"
            onChange={(value) =>
              setVibrate(
                value === "false"
                  ? false
                  : (value as "light" | "medium" | "heavy"),
              )
            }
            options={["false", "light", "medium", "heavy"]}
            value={String(vibrate)}
          />
        </>
      }
      eventText={formatJson(previewState)}
    >
      <div className="kit-preview">
        <AccountingCalculator
          display={
            showDisplay
              ? (expression, result) => (
                  <AccountingDisplay
                    currencySymbol="¥"
                    expression={expression}
                    result={result}
                  />
                )
              : false
          }
          onChange={setPreviewState}
          onSubmit={setPreviewState}
          scale={scale}
          submitLabel={submitLabel}
          vibrate={vibrate}
        />
      </div>
    </PlaygroundFrame>
  );
}

type AccountingPreviewState = {
  expression: string;
  result: string;
};

function createAccountingPreviewState(
  expression: string,
  scale: number,
): AccountingPreviewState {
  const engine = createExpressionEngine({ scale });

  if (expression) {
    engine.input(expression);
  }

  return {
    expression: engine.expression(),
    result: engine.evaluate(),
  };
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
          <div>
            <h5>{zh ? "警告" : "Warnings"}</h5>
            <pre className="json-preview">
              {formatJson(resolved?.warnings ?? [])}
            </pre>
          </div>
          <div>
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
          <div>
            <h5>{zh ? "展平 key 顺序" : "Flat Keys"}</h5>
            <pre className="json-preview">
              {formatJson(resolved?.flatKeys.map((key) => key.id) ?? [])}
            </pre>
          </div>
          <div>
            <h5>{zh ? "示例事件" : "Sample Event"}</h5>
            <pre className="json-preview">{formatJson(sampleEvent)}</pre>
          </div>
        </div>
      )}
    </PlaygroundFrame>
  );
}

function businessKeyboardPlaygroundCode(options: {
  columnGap: string;
  gap: string;
  keyFontFamily: string;
  keyHeight: string;
  rightColumnWidth: string;
  rowGap: string;
  submitLabel: string;
  vibrate: false | "light" | "medium" | "heavy";
}) {
  return `const config = createAccountingCalcKeyboardConfig({
  submitLabel: "${options.submitLabel}",
})

<BusinessKeyboard
  config={config}
  columnGap={${JSON.stringify(options.columnGap)}}
  columnWidths={[1, 1, 1, ${Number(options.rightColumnWidth) || 1.2875}]}
  gap={${JSON.stringify(options.gap)}}
  keyFontFamily={${JSON.stringify(options.keyFontFamily)}}
  keyHeight={${JSON.stringify(options.keyHeight)}}
  rowGap={${JSON.stringify(options.rowGap)}}
  vibrate={${options.vibrate ? `"${options.vibrate}"` : "false"}}
/>`;
}

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function parseJsonError(value: string): string | null {
  try {
    JSON.parse(value);

    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "Invalid JSON";
  }
}

function toPlaygroundSize(value: string): number | string | undefined {
  if (value.trim() === "") return undefined;

  const numeric = Number(value);

  return Number.isNaN(numeric) ? value : numeric;
}

function readStringProp(source: string, prop: string): string | null {
  const propPattern = escapeRegExp(prop);
  const match = source.match(
    new RegExp(`${propPattern}\\s*=\\s*(?:\\{\\s*)?["'\`]([^"'\`]*)["'\`](?:\\s*\\})?`),
  );

  return match?.[1] ?? null;
}

function hasJsxProp(source: string, prop: string): boolean {
  return new RegExp(`${escapeRegExp(prop)}\\s*=`).test(source);
}

function readJsxPropValue(source: string, prop: string): string | null {
  const propPattern = escapeRegExp(prop);
  const match = source.match(
    new RegExp(
      `${propPattern}\\s*=\\s*\\{?\\s*(?:"([^"]*)"|'([^']*)'|\`([^\`]*)\`|(-?\\d+(?:\\.\\d+)?))\\s*\\}?`,
    ),
  );

  return match?.[1] ?? match?.[2] ?? match?.[3] ?? match?.[4] ?? null;
}

function readNumberProp(source: string, prop: string): number | null {
  const propPattern = escapeRegExp(prop);
  const match = source.match(
    new RegExp(`${propPattern}\\s*=\\s*\\{?\\s*(-?\\d+(?:\\.\\d+)?)\\s*\\}?`),
  );

  return match ? Number(match[1]) : null;
}

function readObjectStringProp(source: string, prop: string): string | null {
  const propPattern = escapeRegExp(prop);
  const match = source.match(
    new RegExp(`${propPattern}\\s*:\\s*["'\`]([^"'\`]*)["'\`]`),
  );

  return match?.[1] ?? null;
}

function readObjectNumberProp(source: string, prop: string): number | null {
  const propPattern = escapeRegExp(prop);
  const match = source.match(
    new RegExp(`${propPattern}\\s*:\\s*(-?\\d+(?:\\.\\d+)?)`),
  );

  return match ? Number(match[1]) : null;
}

function readVibrateProp(
  source: string,
): false | "light" | "medium" | "heavy" | null {
  const value = readJsxPropValue(source, "vibrate");

  if (value === null) return null;
  if (value === "false") return false;
  if (value === "light" || value === "medium" || value === "heavy") {
    return value;
  }

  return null;
}

function readColumnWidthsLastValue(source: string): string | null {
  const match = source.match(/columnWidths\s*=\s*\{\s*\[([^\]]*)\]\s*\}/);

  if (!match) return null;

  const values = match[1].split(",").map((value) => value.trim());
  const lastValue = values.at(-1);

  return lastValue && Number.isFinite(Number(lastValue)) ? lastValue : null;
}

function readTokenArray(source: string): string[] | null {
  const match = source.match(/for\s*\(\s*const token of\s*(\[[\s\S]*?\])\s*\)/);

  if (!match) return null;

  try {
    const value = JSON.parse(match[1]);

    return Array.isArray(value) && value.every((item) => typeof item === "string")
      ? value
      : null;
  } catch {
    return null;
  }
}

function readToggleValues(source: string): string[] {
  const matches = source.matchAll(/state\.toggle\(\s*["'\`]([^"'\`]*)["'\`]\s*\)/g);

  return [...matches].map((match) => match[1]);
}

function readObjectLiteralValue(source: string, prop: string): string | null {
  const propPattern = new RegExp(`${escapeRegExp(prop)}\\s*:`);
  const propMatch = propPattern.exec(source);

  if (!propMatch) return null;

  const valueStart = source.slice(propMatch.index + propMatch[0].length).search(/\S/);

  if (valueStart === -1) return null;

  const startIndex = propMatch.index + propMatch[0].length + valueStart;
  const opener = source[startIndex];
  const closer = opener === "[" ? "]" : opener === "{" ? "}" : null;

  if (!closer) return null;

  const endIndex = findBalancedEndIndex(source, startIndex, opener, closer);

  return endIndex === -1 ? null : source.slice(startIndex, endIndex + 1);
}

function findBalancedEndIndex(
  source: string,
  startIndex: number,
  opener: string,
  closer: string,
) {
  let depth = 0;
  let quote: string | null = null;
  let isEscaped = false;

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (isEscaped) {
        isEscaped = false;
      } else if (char === "\\") {
        isEscaped = true;
      } else if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === opener) {
      depth += 1;
      continue;
    }

    if (char === closer) {
      depth -= 1;

      if (depth === 0) return index;
    }
  }

  return -1;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
