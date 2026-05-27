import { useEffect, useState } from "react";
import { createExpressionEngine } from "@usmoment/headless";
import { AccountingCategorySelector } from "@usmoment/kit-web";
import { AccountingCalculator, AccountingDisplay } from "@usmoment/taro/kit";
import { isZh } from "../i18n";
import {
  accountingCategorySelectorPlaygroundCode,
  accountingDisplayPlaygroundCode,
} from "./playground-code";
import { accountingCategoryMockCategories } from "./playground-data";
import {
  PlaygroundFrame,
  SelectControl,
  TextControl,
  ToggleControl,
} from "./playground-frame";
import type { PlaygroundLocaleProps } from "./playground-types";
import {
  formatJson,
  hasJsxProp,
  readNumberProp,
  readStringProp,
  readVibrateProp,
} from "./playground-utils";

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

export function AccountingDisplayPlayground(props: PlaygroundLocaleProps) {
  const zh = isZh(props.locale ?? "en");
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [expression, setExpression] = useState("12+8");
  const [billName, setBillName] = useState("");
  const [result, setResult] = useState("20.00");

  return (
    <PlaygroundFrame
      code={accountingDisplayPlaygroundCode({
        currencySymbol,
        expression,
        billName,
        result,
      })}
      onCodeChange={(code) => {
        const nextCurrencySymbol = readStringProp(code, "currencySymbol");
        const nextExpression = readStringProp(code, "expression");
        const nextBillName = readStringProp(code, "nameValue");
        const nextResult = readStringProp(code, "result");

        if (nextCurrencySymbol !== null) setCurrencySymbol(nextCurrencySymbol);
        if (nextCurrencySymbol === null && !hasJsxProp(code, "currencySymbol")) {
          setCurrencySymbol("");
        }
        if (nextExpression !== null) setExpression(nextExpression);
        if (nextBillName !== null) setBillName(nextBillName);
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
            label={zh ? "账单名称" : "bill name"}
            onChange={setBillName}
            value={billName}
          />
        </>
      }
    >
      <div className="kit-preview">
        <AccountingDisplay
          currencySymbol={currencySymbol === "" ? undefined : currencySymbol}
          expression={expression}
          namePlaceholder={zh ? "给账单起个名字吧" : "Give this bill a name"}
          nameValue={billName}
          onNameChange={setBillName}
          result={result}
        />
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

export function AccountingCategorySelectorPlayground(
  props: PlaygroundLocaleProps,
) {
  const zh = isZh(props.locale ?? "en");
  const [columns, setColumns] = useState("4");
  const [selectedKey, setSelectedKey] = useState("Food");
  const [lastEvent, setLastEvent] = useState(
    zh ? "选择一个分类" : "Select a category",
  );

  return (
    <PlaygroundFrame
      code={accountingCategorySelectorPlaygroundCode({
        columns,
        selectedKey,
      })}
      onCodeChange={(code) => {
        const nextColumns = readNumberProp(code, "columns");
        const nextSelectedKey = readStringProp(code, "selectedKey");

        if (nextColumns !== null) setColumns(String(nextColumns));
        if (nextSelectedKey !== null) setSelectedKey(nextSelectedKey);
      }}
      locale={props.locale}
      controls={
        <>
          <SelectControl
            label="selectedKey"
            onChange={setSelectedKey}
            options={accountingCategoryMockCategories.map(
              (category) => category.key,
            )}
            value={selectedKey}
          />
          <SelectControl
            label="columns"
            onChange={setColumns}
            options={["3", "4", "5"]}
            value={columns}
          />
        </>
      }
      eventText={lastEvent}
    >
      <div className="kit-preview kit-preview--accounting-category-selector">
        <AccountingCategorySelector
          categories={accountingCategoryMockCategories}
          columns={Number(columns) || 4}
          onCategoryClick={(event) => {
            setLastEvent(
              formatJson({
                type: "categoryClick",
                key: event.key,
                selected: event.selected,
              }),
            );
          }}
          onChange={(event) => {
            setSelectedKey(event.key);
            setLastEvent(
              formatJson({
                type: "change",
                key: event.key,
                name: event.category.name,
              }),
            );
          }}
          selectedKey={selectedKey}
        />
      </div>
    </PlaygroundFrame>
  );
}
