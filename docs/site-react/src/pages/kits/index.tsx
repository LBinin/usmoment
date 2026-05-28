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
  const zh = isZh(props.locale);

  return (
    <ComponentExplorer
      description={
        zh
          ? "Kits 是面向具体产品场景的组合层，负责业务语义、默认皮肤和流程入口，同时保留 Headless 与 UI 的替换空间。"
          : "Kits are scenario-ready composition layers. They own business semantics, default skins, and flow entry points while preserving room to replace Headless logic and UI surfaces."
      }
      docs={getKitComponentDocs(props.locale)}
      eyebrow="Kits"
      grouped
      locale={props.locale}
      overview={{
        cards: [
          {
            description: zh ? "金额显示" : "Amount display",
            docId: "accounting-display",
            imageAlt: zh
              ? "AccountingDisplay 金额显示插图"
              : "AccountingDisplay amount display illustration",
            imageSrc: "/assets/component-overview/accounting-display.svg",
          },
          {
            description: zh ? "金额计算器" : "Amount calculator",
            docId: "accounting-calculator",
            imageAlt: zh
              ? "AccountingCalculator 金额计算器插图"
              : "AccountingCalculator amount calculator illustration",
            imageSrc: "/assets/component-overview/accounting-calculator.svg",
          },
          {
            description: zh ? "计算器弹层" : "Calculator popup",
            docId: "accounting-calculator-popup",
            imageAlt: zh
              ? "AccountingCalculatorPopup 计算器弹层插图"
              : "AccountingCalculatorPopup calculator popup illustration",
            imageSrc: "/assets/component-overview/accounting-calculator-popup.svg",
          },
          {
            description: zh ? "分类选择器" : "Category selector",
            docId: "accounting-category-selector",
            imageAlt: zh
              ? "AccountingCategorySelector 分类选择器插图"
              : "AccountingCategorySelector category selector illustration",
            imageSrc: "/assets/component-overview/accounting-category-selector.svg",
          },
        ],
        id: "overview",
      }}
      routePath="/kits"
      title={zh ? "开放式产品流程" : "Open-box product flows"}
    />
  );
}
