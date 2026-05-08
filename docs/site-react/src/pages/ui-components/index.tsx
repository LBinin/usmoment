import React from "react";
import {
  ComponentExplorer,
  getUiComponentDocs,
} from "../../shared/component-explorer";
import { isZh, type Locale } from "../../shared/i18n";

type UiComponentsPageProps = {
  locale: Locale;
};

export function UiComponentsPage(props: UiComponentsPageProps) {
  return (
    <ComponentExplorer
      description={
        isZh(props.locale)
          ? "官方 Taro 视觉组件。这里展示组件外观、Props 和常见交互状态，方便在接入前快速确认效果。"
          : "Official Taro visual components. Review appearance, props, and common interaction states before integrating them."
      }
      docs={getUiComponentDocs(props.locale)}
      eyebrow="UI Components"
      grouped
      locale={props.locale}
      routePath="/ui-components"
      title={isZh(props.locale) ? "组件工作台" : "Component workbench"}
    />
  );
}
