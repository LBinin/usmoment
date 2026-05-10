import React from "react";
import { isZh, type Locale } from "../i18n";
import { typeAnchor } from "./anchors";
import type { ApiRow } from "./types";

export function row(
  name: string,
  type: string,
  required: boolean,
  description: string,
  defaultValue?: string,
): ApiRow {
  return { name, type, required, description, defaultValue };
}

export function ApiTable(props: {
  linkedTypes?: Set<string>;
  locale: Locale;
  rows: ApiRow[];
  typeLinks?: Record<string, string>;
}) {
  return (
    <div className="api-table" role="table">
      <div className="api-table__row api-table__row--head" role="row">
        <span>{isZh(props.locale) ? "字段" : "Name"}</span>
        <span>{isZh(props.locale) ? "类型" : "Type"}</span>
        <span>{isZh(props.locale) ? "说明" : "Description"}</span>
        <span>{isZh(props.locale) ? "必填" : "Required"}</span>
        <span>{isZh(props.locale) ? "默认值" : "Default"}</span>
      </div>
      {props.rows.map((row) => (
        <div className="api-table__row" key={row.name} role="row">
          <span className="api-table__cell">
            <code className="inline-code">{row.name}</code>
          </span>
          <TypeCode
            linkedTypes={props.linkedTypes}
            typeLinks={props.typeLinks}
            value={row.type}
          />
          <span>{row.description}</span>
          <span className="api-table__cell">
            <RequiredValue locale={props.locale} required={row.required} />
          </span>
          <span className="api-table__cell">
            {row.defaultValue ? (
              <code className="inline-code">{row.defaultValue}</code>
            ) : (
              "—"
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

function RequiredValue(props: { locale: Locale; required?: boolean }) {
  if (props.required === undefined) return <>—</>;

  if (!props.required) {
    return (
      <span className="required-text">{isZh(props.locale) ? "否" : "No"}</span>
    );
  }

  return (
    <span className="required-badge">
      {isZh(props.locale) ? "是" : "Yes"}
    </span>
  );
}

function TypeCode(props: {
  linkedTypes?: Set<string>;
  typeLinks?: Record<string, string>;
  value: string;
}) {
  const linkedTypes = props.linkedTypes ?? new Set<string>();
  const externalTypeNames = Object.keys(props.typeLinks ?? {});
  const typeNames = [...linkedTypes, ...externalTypeNames].sort(
    (a, b) => b.length - a.length,
  );
  const parts: Array<{ text: string; typeName?: string }> = [];
  let index = 0;

  while (index < props.value.length) {
    const match = typeNames.find((typeName) =>
      props.value.startsWith(typeName, index),
    );

    if (match) {
      parts.push({ text: match, typeName: match });
      index += match.length;
      continue;
    }

    const nextMatchIndex = findNextTypeMatchIndex(
      props.value,
      typeNames,
      index + 1,
    );
    const nextIndex = nextMatchIndex === -1 ? props.value.length : nextMatchIndex;
    parts.push({ text: props.value.slice(index, nextIndex) });
    index = nextIndex;
  }

  return (
    <span className="api-table__cell">
      <code className="inline-code type-code">
        {parts.map((part, partIndex) =>
          part.typeName ? (
            <a
              href={props.typeLinks?.[part.typeName] ?? `#${typeAnchor(part.typeName)}`}
              key={`${part.text}-${partIndex}`}
            >
              {part.text}
            </a>
          ) : (
            <React.Fragment key={`${part.text}-${partIndex}`}>
              {part.text}
            </React.Fragment>
          ),
        )}
      </code>
    </span>
  );
}

function findNextTypeMatchIndex(
  value: string,
  typeNames: string[],
  startIndex: number,
) {
  for (let nextIndex = startIndex; nextIndex < value.length; nextIndex += 1) {
    if (typeNames.some((typeName) => value.startsWith(typeName, nextIndex))) {
      return nextIndex;
    }
  }

  return -1;
}
