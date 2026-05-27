import React from "react";
import type { IconCategory } from "@usmoment/icon";
import { copyText } from "../../shared/component-explorer/code-block";
import { isZh, type Locale } from "../../shared/i18n";
import { CodePanel } from "./code-panel";
import { IconCatalog } from "./icon-catalog";
import { availableCategories, iconEntries, installCode, usageCode } from "./icon-data";
import { InfoTable } from "./info-table";
import { propRows, variableRows } from "./table-data";

type IconsPageProps = {
  locale: Locale;
};

export function IconsPage(props: IconsPageProps) {
  const zh = isZh(props.locale);
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<IconCategory | "all">("all");
  const [copied, setCopied] = React.useState<string | null>(null);

  const filteredIcons = iconEntries.filter((icon) => {
    const queryValue = query.trim().toLowerCase();
    const matchesCategory = category === "all" || icon.category === category;
    const matchesQuery =
      queryValue.length === 0 ||
      [icon.name, icon.componentName, icon.category, ...icon.tags]
        .join(" ")
        .toLowerCase()
        .includes(queryValue);

    return matchesCategory && matchesQuery;
  });

  async function copyCode(label: string, code: string) {
    const didCopy = await copyText(code);

    if (didCopy) {
      setCopied(label);
      window.setTimeout(() => setCopied(null), 1600);
    }
  }

  return (
    <section className="icons-page">
      <div className="component-page__intro icons-hero">
        <p className="eyebrow">Icons</p>
        <h2>{zh ? "UsMoment 图标库" : "UsMoment Icon Library"}</h2>
        <p>
          {zh
            ? "@usmoment/icon 收纳经过筛选、可追踪来源和协议的 SVG 图标，提供稳定的 React 组件导出、分类浏览和复制代码能力。"
            : "@usmoment/icon collects selected SVG icons with traceable sources and licenses, with stable React exports, category browsing, and copy-ready examples."}
        </p>
        <div
          aria-label={zh ? "图标库统计" : "Icon library stats"}
          className="icons-hero__stats"
        >
          <span>
            <strong>{iconEntries.length}</strong>
            {zh ? "枚图标" : "Icons"}
          </span>
          <span>
            <strong>{availableCategories.length}</strong>
            {zh ? "个分类" : "Categories"}
          </span>
        </div>
      </div>

      <div className="icons-quickstart">
        <CodePanel
          code={installCode}
          copiedLabel={zh ? "已复制" : "Copied"}
          copyLabel={zh ? "复制" : "Copy"}
          label={zh ? "安装" : "Install"}
        />
        <CodePanel
          code={usageCode}
          copiedLabel={zh ? "已复制" : "Copied"}
          copyLabel={zh ? "复制" : "Copy"}
          label={zh ? "基础用法" : "Basic Usage"}
        />
      </div>

      <IconCatalog
        category={category}
        copied={copied}
        filteredIcons={filteredIcons}
        onCategoryChange={setCategory}
        onCopy={copyCode}
        onQueryChange={setQuery}
        query={query}
        zh={zh}
      />

      <section className="icons-doc-block icons-reference">
        <InfoTable
          description={
            zh
              ? "所有图标共享一组轻量 props，后续 Taro 支持也会尽量保持同名能力。"
              : "Icons share a small prop contract. Future Taro support should keep the same names where possible."
          }
          locale={props.locale}
          rows={zh ? propRows.zh : propRows.en}
          title="API"
        />
      </section>
      <section className="icons-doc-block icons-reference">
        <InfoTable
          description={
            zh
              ? "变量保持中性，业务色彩和场景皮肤仍然交给 Kits 或使用方。"
              : "Variables stay neutral; business colors and scenario skins belong in Kits or consuming apps."
          }
          locale={props.locale}
          rows={zh ? variableRows.zh : variableRows.en}
          title={zh ? "主题变量" : "Theme Variables"}
        />
      </section>

      <section className="icons-doc-block icons-license">
        <div className="icons-block-heading">
          <p className="component-kicker">Source & License</p>
          <h3>{zh ? "来源与协议" : "Source & License"}</h3>
        </div>
        <div className="icons-section">
          <p>
            {zh
              ? "Icônes、Iconify 和 iconfont 可以作为发现或导入来源，但每枚进入包的图标都必须记录原始集合、图标名和协议。当前图标来自维护者提供的 SVG 文件或 SVG data URL，后续第三方图标会进入 THIRD_PARTY_NOTICES。"
              : "Icônes, Iconify, and iconfont can be discovery or import sources, but every packaged icon must record its original collection, icon name, and license. Current icons come from maintainer-provided SVGs or SVG data URLs; future third-party icons will be tracked in THIRD_PARTY_NOTICES."}
          </p>
        </div>
      </section>
    </section>
  );
}
