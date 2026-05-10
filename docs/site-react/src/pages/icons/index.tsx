import React from "react";
import { BackspaceIcon, iconMetadata, type IconCategory } from "@usmoment/icon";
import { ApiTable, row } from "../../shared/component-explorer/api-table";
import { copyText, StaticCodeBlock } from "../../shared/component-explorer/code-block";
import { isZh, type Locale } from "../../shared/i18n";

type IconsPageProps = {
  locale: Locale;
};

type IconEntry = {
  category: IconCategory;
  component: React.ComponentType<{
    className?: string;
    color?: string;
    size?: number;
    title?: string;
  }>;
  componentName: string;
  jsxCode: string;
  name: string;
  tags: string[];
};

const iconEntries: IconEntry[] = [
  {
    category: iconMetadata.backspace.category,
    component: BackspaceIcon,
    componentName: iconMetadata.backspace.componentName,
    jsxCode: `<BackspaceIcon size={25} title="Backspace" />`,
    name: iconMetadata.backspace.name,
    tags: iconMetadata.backspace.tags,
  },
];

const categoryOrder: IconCategory[] = [
  "navigation",
  "action",
  "feedback",
  "data",
  "commerce",
  "moment",
  "device",
  "date-time",
];

const availableCategories = categoryOrder.filter((categoryKey) =>
  iconEntries.some((icon) => icon.category === categoryKey),
);

const categoryCopy: Record<
  IconCategory,
  { en: string; zh: string; summaryEn: string; summaryZh: string }
> = {
  action: {
    en: "Action",
    summaryEn: "Direct user commands.",
    summaryZh: "用户直接触发的操作命令。",
    zh: "操作",
  },
  commerce: {
    en: "Commerce",
    summaryEn: "Money, bills, and transaction flows.",
    summaryZh: "金额、账单、支付与交易流程。",
    zh: "财务",
  },
  data: {
    en: "Data",
    summaryEn: "Lists, filtering, charts, and structured content.",
    summaryZh: "列表、筛选、图表与结构化内容。",
    zh: "数据",
  },
  "date-time": {
    en: "Date & Time",
    summaryEn: "Calendar, duration, and time concepts.",
    summaryZh: "日期、日程、时长与时间概念。",
    zh: "日期时间",
  },
  device: {
    en: "Device",
    summaryEn: "Platform, hardware, and environment icons.",
    summaryZh: "平台、硬件与运行环境。",
    zh: "设备",
  },
  feedback: {
    en: "Feedback",
    summaryEn: "Status, validation, loading, and messages.",
    summaryZh: "状态、校验、加载与系统反馈。",
    zh: "反馈",
  },
  moment: {
    en: "Moment",
    summaryEn: "Relationship-centered and warm product moments.",
    summaryZh: "关系、记忆、家庭与温暖产品语义。",
    zh: "时刻",
  },
  navigation: {
    en: "Navigation",
    summaryEn: "Moving through UI or changing hierarchy.",
    summaryZh: "页面移动、层级切换与方向导航。",
    zh: "导航",
  },
};

const propRows = {
  en: [
    row(
      "size",
      "number | string",
      false,
      "Icon width. Non-square icons preserve their original ratio when a number is passed.",
      "1em",
    ),
    row(
      "color",
      "string",
      false,
      "Overrides the SVG fill or stroke color when the icon supports color override.",
      "currentColor",
    ),
    row(
      "width",
      "number | string",
      false,
      "Overrides the rendered SVG width.",
      "-",
    ),
    row(
      "height",
      "number | string",
      false,
      "Overrides the rendered SVG height.",
      "-",
    ),
    row("title", "string", false, "Adds an accessible title and switches the SVG to role=\"img\"."),
    row("className", "string", false, "Adds a class to the SVG root."),
    row("style", "CSSProperties", false, "Adds inline styles to the SVG root."),
  ],
  zh: [
    row(
      "size",
      "number | string",
      false,
      "图标宽度。传入数字时，非正方形图标会按原始比例计算高度。",
      "1em",
    ),
    row(
      "color",
      "string",
      false,
      "覆盖图标颜色；仅在该图标支持颜色覆盖时生效。",
      "currentColor",
    ),
    row("width", "number | string", false, "覆盖 SVG 渲染宽度。", "-"),
    row("height", "number | string", false, "覆盖 SVG 渲染高度。", "-"),
    row("title", "string", false, "添加可访问标题，并让 SVG 以 role=\"img\" 暴露。"),
    row("className", "string", false, "添加到 SVG 根节点的类名。"),
    row("style", "CSSProperties", false, "添加到 SVG 根节点的内联样式。"),
  ],
};

const variableRows = {
  en: [
    row("--usm-icon-size", "CSS variable", false, "Default icon size.", "1em"),
    row("--usm-icon-color", "CSS variable", false, "Default icon color behavior.", "currentColor"),
  ],
  zh: [
    row("--usm-icon-size", "CSS 变量", false, "默认图标尺寸。", "1em"),
    row("--usm-icon-color", "CSS 变量", false, "默认图标颜色策略。", "currentColor"),
  ],
};

const installCode = "pnpm add @usmoment/icon";
const usageCode = `import { BackspaceIcon } from "@usmoment/icon";

<BackspaceIcon size={25} title="Backspace" />`;

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

      <section className="icons-doc-block" aria-labelledby="icons-browser-title">
        <div className="icons-block-heading">
          <p className="component-kicker">Browser</p>
          <h3 id="icons-browser-title">{zh ? "图标浏览" : "Icon Browser"}</h3>
        </div>
        <div className="icons-section">
          <div className="icons-section__toolbar">
            <div className="icons-category-bar" aria-label={zh ? "图标分类" : "Icon categories"}>
              <button
                className={category === "all" ? "is-active" : undefined}
                onClick={() => setCategory("all")}
                type="button"
              >
                {zh ? "全部" : "All"}
              </button>
              {availableCategories.map((categoryKey) => (
                <button
                  className={category === categoryKey ? "is-active" : undefined}
                  key={categoryKey}
                  onClick={() => setCategory(categoryKey)}
                  type="button"
                >
                  {zh ? categoryCopy[categoryKey].zh : categoryCopy[categoryKey].en}
                </button>
              ))}
            </div>
            <div className="icons-search">
              <label htmlFor="icon-search">{zh ? "搜索" : "Search"}</label>
              <input
                id="icon-search"
                onChange={(event) => setQuery(event.target.value)}
                placeholder={zh ? "名称、组件、标签" : "Name, component, tag"}
                type="search"
                value={query}
              />
            </div>
          </div>

          <div className="icons-grid">
            {filteredIcons.map((icon) => {
              const Icon = icon.component;

              return (
                <article className="icon-card" key={icon.name}>
                  <button
                    className="icon-card__button"
                    onClick={() => copyCode(icon.name, icon.jsxCode)}
                    type="button"
                  >
                    <Icon className="icon-card__glyph" size={44} title={icon.componentName} />
                    <span>{icon.componentName}</span>
                    <span className="icon-card__copied" aria-live="polite">
                      {copied === icon.name ? (zh ? "已复制" : "Copied") : null}
                    </span>
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

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
              ? "Icônes、Iconify 和 iconfont 可以作为发现或导入来源，但每枚进入包的图标都必须记录原始集合、图标名和协议。当前 BackspaceIcon 来自维护者提供的 SVG data URL，后续第三方图标会进入 THIRD_PARTY_NOTICES。"
              : "Icônes, Iconify, and iconfont can be discovery or import sources, but every packaged icon must record its original collection, icon name, and license. BackspaceIcon currently comes from a maintainer-provided SVG data URL; future third-party icons will be tracked in THIRD_PARTY_NOTICES."}
          </p>
        </div>
      </section>
    </section>
  );
}

function CodePanel(props: {
  code: string;
  copiedLabel: string;
  copyLabel: string;
  label: string;
}) {
  return (
    <section className="icons-code-panel">
      <h3>{props.label}</h3>
      <StaticCodeBlock
        copiedLabel={props.copiedLabel}
        copyLabel={props.copyLabel}
        value={props.code}
      />
    </section>
  );
}

function InfoTable(props: {
  description: string;
  locale: Locale;
  rows: ReturnType<typeof row>[];
  title: string;
}) {
  return (
    <section>
      <div className="icons-block-heading">
        <h3>{props.title}</h3>
        <p>{props.description}</p>
      </div>
      <div className="icons-section icons-info-table">
        <ApiTable locale={props.locale} rows={props.rows} />
      </div>
    </section>
  );
}
