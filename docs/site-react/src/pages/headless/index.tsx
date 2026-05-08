import React from "react";
import {
  ComponentExplorer,
  getHeadlessComponentDocs,
} from "../../shared/component-explorer";
import { isZh, type Locale } from "../../shared/i18n";

type HeadlessPageProps = {
  locale: Locale;
};

export function HeadlessPage(props: HeadlessPageProps) {
  return (
    <ComponentExplorer
      description={
        isZh(props.locale)
          ? "不包含 UI 的能力层。它沉淀状态、配置、事件和计算规则，供不同平台的 UI 与 Kits 复用。"
          : "The non-visual capability layer. It captures state, config, events, and calculation rules for UI and Kits across platforms."
      }
      docs={getHeadlessComponentDocs(props.locale)}
      eyebrow="Headless"
      locale={props.locale}
      routePath="/headless"
      title={isZh(props.locale) ? "能力原语" : "Capability primitives"}
    />
  );
}
