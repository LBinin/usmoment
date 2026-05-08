import React from "react";
import {
  ComponentExplorer,
  getKitComponentDocs,
} from "../../shared/component-explorer";
import { isZh, type Locale } from "../../shared/i18n";

type KitsPageProps = {
  locale: Locale;
};

export function KitsPage(props: KitsPageProps) {
  return (
    <ComponentExplorer
      description={
        isZh(props.locale)
          ? "面向具体业务场景的组合组件。默认可以直接使用，也允许替换展示区、键盘和回调逻辑。"
          : "Composed components for real product flows. They work out of the box while letting you replace display, keyboard, and callbacks when needed."
      }
      docs={getKitComponentDocs(props.locale)}
      eyebrow="Kits"
      locale={props.locale}
      routePath="/kits"
      title={isZh(props.locale) ? "开放式产品流程" : "Open-box product flows"}
    />
  );
}
