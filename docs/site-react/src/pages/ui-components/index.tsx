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
  const zh = isZh(props.locale);

  return (
    <ComponentExplorer
      description={
        zh
          ? "UI Components 是跨平台视觉基础层，负责中性的结构、外观和交互状态；业务语义、场景皮肤与流程编排保留给 Kits 或调用方。"
          : "UI Components are the neutral cross-platform visual layer. They own structure, appearance, and interaction states while leaving business semantics, scenario skins, and flow orchestration to Kits or callers."
      }
      docs={getUiComponentDocs(props.locale)}
      eyebrow="UI Components"
      grouped
      locale={props.locale}
      overview={{
        cards: [
          {
            description: zh ? "业务键盘" : "Business keyboard",
            docId: "business-keyboard",
            imageAlt: zh ? "BusinessKeyboard 抽象键盘插图" : "Abstract BusinessKeyboard illustration",
            imageSrc: "/assets/component-overview/business-keyboard.svg",
          },
          {
            description: zh ? "全屏选项列表" : "Fullscreen option list",
            docId: "fullscreen-option-list",
            imageAlt: zh
              ? "FullscreenOptionList 抽象选项网格插图"
              : "Abstract FullscreenOptionList illustration",
            imageSrc: "/assets/component-overview/fullscreen-option-list.svg",
          },
          {
            description: zh ? "计算显示" : "Calculation display",
            docId: "calc-display",
            imageAlt: zh ? "CalcDisplay 抽象显示面板插图" : "Abstract CalcDisplay illustration",
            imageSrc: "/assets/component-overview/calc-display.svg",
          },
          {
            description: zh ? "弹出层" : "Popup layer",
            docId: "popup",
            imageAlt: zh ? "Popup 抽象弹层插图" : "Abstract Popup illustration",
            imageSrc: "/assets/component-overview/popup.svg",
          },
        ],
        id: "overview",
      }}
      routePath="/ui-components"
      title={zh ? "组件工作台" : "Component workbench"}
    />
  );
}
