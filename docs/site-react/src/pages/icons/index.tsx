import React from "react";
import {
  BackspaceIcon,
  DateIcon,
  ImageIcon,
  NoteIcon,
  PlusIcon,
  TimeIcon,
  YenCircleIcon,
  iconMetadata,
  type IconCategory,
} from "@usmoment/icon";
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
    renderMode?: "svg" | "mask";
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
  {
    category: iconMetadata.plus.category,
    component: PlusIcon,
    componentName: iconMetadata.plus.componentName,
    jsxCode: `<PlusIcon size={24} title="Plus" />`,
    name: iconMetadata.plus.name,
    tags: iconMetadata.plus.tags,
  },
  {
    category: iconMetadata.yenCircle.category,
    component: YenCircleIcon,
    componentName: iconMetadata.yenCircle.componentName,
    jsxCode: `<YenCircleIcon size={24} title="Yen" />`,
    name: iconMetadata.yenCircle.name,
    tags: iconMetadata.yenCircle.tags,
  },
  {
    category: iconMetadata.note.category,
    component: NoteIcon,
    componentName: iconMetadata.note.componentName,
    jsxCode: `<NoteIcon size={24} title="Note" />`,
    name: iconMetadata.note.name,
    tags: iconMetadata.note.tags,
  },
  {
    category: iconMetadata.image.category,
    component: ImageIcon,
    componentName: iconMetadata.image.componentName,
    jsxCode: `<ImageIcon size={24} title="Image" />`,
    name: iconMetadata.image.name,
    tags: iconMetadata.image.tags,
  },
  {
    category: iconMetadata.date.category,
    component: DateIcon,
    componentName: iconMetadata.date.componentName,
    jsxCode: `<DateIcon size={24} title="Date" />`,
    name: iconMetadata.date.name,
    tags: iconMetadata.date.tags,
  },
  {
    category: iconMetadata.time.category,
    component: TimeIcon,
    componentName: iconMetadata.time.componentName,
    jsxCode: `<TimeIcon size={24} title="Time" />`,
    name: iconMetadata.time.name,
    tags: iconMetadata.time.tags,
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
      "Overrides the normal SVG/image color. In mask mode, use background or CSS classes for visible paint.",
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
    row(
      "renderMode",
      "\"svg\" | \"mask\"",
      false,
      "Renders the icon normally or as a CSS mask host for custom business paint such as gradients.",
      "\"svg\"",
    ),
    row("title", "string", false, "Adds an accessible title and switches the SVG to role=\"img\"."),
    row("className", "string", false, "Adds a class to the icon root."),
    row("style", "CSSProperties", false, "Adds inline styles to the icon root."),
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
      "覆盖默认 SVG/image 图标颜色。mask 模式下请使用 background 或 CSS 类控制可见颜色。",
      "currentColor",
    ),
    row("width", "number | string", false, "覆盖 SVG 渲染宽度。", "-"),
    row("height", "number | string", false, "覆盖 SVG 渲染高度。", "-"),
    row(
      "renderMode",
      "\"svg\" | \"mask\"",
      false,
      "以默认图标节点或 CSS mask 承载节点渲染，便于业务用背景色或渐变为图标上色。",
      "\"svg\"",
    ),
    row("title", "string", false, "添加可访问标题，并让 SVG 以 role=\"img\" 暴露。"),
    row("className", "string", false, "添加到图标根节点的类名。"),
    row("style", "CSSProperties", false, "添加到图标根节点的内联样式。"),
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
          <span>
            <strong>API</strong>
            {zh ? "稳定" : "Stable"}
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

      <section
        className="icons-doc-block icons-catalog"
        aria-labelledby="icons-browser-title"
      >
        <aside className="icons-catalog__sidebar">
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

            <div className="icons-category-bar" aria-label={zh ? "图标分类" : "Icon categories"}>
              <button
                className={category === "all" ? "is-active" : undefined}
                onClick={() => setCategory("all")}
                type="button"
              >
                <span>{zh ? "全部" : "All"}</span>
                <small>{iconEntries.length}</small>
              </button>
              {availableCategories.map((categoryKey) => (
                <button
                  className={category === categoryKey ? "is-active" : undefined}
                  key={categoryKey}
                  onClick={() => setCategory(categoryKey)}
                  type="button"
                >
                  <span>{zh ? categoryCopy[categoryKey].zh : categoryCopy[categoryKey].en}</span>
                  <small>
                    {iconEntries.filter((icon) => icon.category === categoryKey).length}
                  </small>
                </button>
              ))}
            </div>
        </aside>

        <div className="icons-catalog__main">
          <div className="icons-block-heading">
            <p className="component-kicker">Browser</p>
            <h3 id="icons-browser-title">{zh ? "图标浏览" : "Icon Browser"}</h3>
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
              ? "Icônes、Iconify 和 iconfont 可以作为发现或导入来源，但每枚进入包的图标都必须记录原始集合、图标名和协议。当前图标来自维护者提供的 SVG 文件或 SVG data URL，后续第三方图标会进入 THIRD_PARTY_NOTICES。"
              : "Icônes, Iconify, and iconfont can be discovery or import sources, but every packaged icon must record its original collection, icon name, and license. Current icons come from maintainer-provided SVGs or SVG data URLs; future third-party icons will be tracked in THIRD_PARTY_NOTICES."}
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
