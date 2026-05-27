import { useState } from "react";
import { createAccountingCalcKeyboardConfig } from "@usmoment/headless";
import {
  BusinessKeyboard,
  CalcDisplay,
  FullscreenOptionList,
} from "@usmoment/ui-web";
import { isZh } from "../i18n";
import {
  businessKeyboardPlaygroundCode,
  fullscreenOptionListPlaygroundCode,
} from "./playground-code";
import {
  optionListPlaygroundOptions,
  type OptionListPlaygroundData,
} from "./playground-data";
import {
  CodeEditorControl,
  PlaygroundFrame,
  SelectControl,
  TextControl,
  ToggleControl,
} from "./playground-frame";
import type { PlaygroundLocaleProps } from "./playground-types";
import {
  formatJson,
  readColumnWidthsLastValue,
  readJsxPropValue,
  readNumberProp,
  readStringProp,
  readVibrateProp,
  readObjectStringProp,
  toPlaygroundSize,
} from "./playground-utils";

export function BusinessKeyboardPlayground(props: PlaygroundLocaleProps) {
  const zh = isZh(props.locale ?? "en");
  const [submitLabel, setSubmitLabel] = useState("完成");
  const [gap, setGap] = useState("0");
  const [rowGap, setRowGap] = useState("0");
  const [columnGap, setColumnGap] = useState("0");
  const [keyHeight, setKeyHeight] = useState("60");
  const [keyFontFamily, setKeyFontFamily] = useState("");
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
          keyFontFamily={keyFontFamily.trim() ? keyFontFamily : undefined}
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

export function FullscreenOptionListPlayground(props: PlaygroundLocaleProps) {
  const zh = isZh(props.locale ?? "en");
  const [selectedKey, setSelectedKey] = useState("food");
  const [columns, setColumns] = useState("3");
  const [compact, setCompact] = useState(false);
  const [lastEvent, setLastEvent] = useState(
    zh ? "点击一个 option" : "Click an option",
  );
  const selectedOption = optionListPlaygroundOptions.find(
    (option) => option.key === selectedKey,
  );

  return (
    <PlaygroundFrame
      code={fullscreenOptionListPlaygroundCode({
        columns,
        compact,
        selectedKey,
      })}
      onCodeChange={(code) => {
        const nextSelectedKey = readStringProp(code, "selectedKey");
        const nextColumns = readNumberProp(code, "columns");

        if (nextSelectedKey !== null) setSelectedKey(nextSelectedKey);
        if (nextColumns !== null) setColumns(String(nextColumns));
        if (code.includes("compact-option")) {
          setCompact(true);
        } else if (code.includes("option-card")) {
          setCompact(false);
        }
      }}
      locale={props.locale}
      controls={
        <>
          <SelectControl
            label="selectedKey"
            onChange={setSelectedKey}
            options={optionListPlaygroundOptions.map((option) => option.key)}
            value={selectedKey}
          />
          <SelectControl
            label="columns"
            onChange={setColumns}
            options={["2", "3", "4"]}
            value={columns}
          />
          <ToggleControl
            checked={compact}
            label={zh ? "紧凑渲染" : "Compact render"}
            onChange={setCompact}
          />
        </>
      }
      eventText={lastEvent}
    >
      <div className="option-list-demo-frame">
        <div className="option-list-demo-meta">
          <span>{zh ? "当前选中" : "Selected"}</span>
          <strong>{selectedOption?.data.label ?? selectedKey}</strong>
        </div>
        <FullscreenOptionList<OptionListPlaygroundData>
          columns={Number(columns) || 3}
          onChange={(event) => {
            setSelectedKey(event.key);
            setLastEvent(formatJson({ type: "change", key: event.key }));
          }}
          onOptionClick={(event) => {
            setLastEvent(
              formatJson({
                type: "optionClick",
                key: event.key,
                selected: event.selected,
              }),
            );
          }}
          optionClassName={({ selected }) =>
            selected ? "option-list-demo-selected" : undefined
          }
          options={optionListPlaygroundOptions}
          renderOption={({ option, selected }) =>
            compact ? (
              <span className="compact-option">
                {option.data?.label ?? option.key}
                {selected ? " · selected" : ""}
              </span>
            ) : (
              <span className="option-card">
                <span>{option.data?.label ?? option.key}</span>
                <small>{option.data?.hint ?? option.key}</small>
              </span>
            )
          }
          selectedKey={selectedKey}
        />
      </div>
    </PlaygroundFrame>
  );
}
