import React from "react";
import { type Locale } from "../i18n";

export type TabKey =
  | "home"
  | "ui-components"
  | "kits"
  | "headless"
  | "icons"
  | "ai-llms";

const tabs: Array<{ key: TabKey; label: Record<Locale, string> }> = [
  { key: "kits", label: { zh: "Kits", en: "Kits" } },
  { key: "ui-components", label: { zh: "UI Components", en: "UI Components" } },
  { key: "headless", label: { zh: "Headless", en: "Headless" } },
  { key: "icons", label: { zh: "Icons", en: "Icons" } },
  { key: "ai-llms", label: { zh: "AI LLMs", en: "AI LLMs" } },
];

type HeaderProps = {
  activeTab: TabKey;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  onTabChange: (tab: TabKey) => void;
};

export function Header(props: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-primary">
        <button
          aria-label="USMoment home"
          className="brand"
          onClick={() => props.onTabChange("home")}
          type="button"
        >
          <img alt="USMoment" src="/assets/usmoment-logo.png" />
        </button>
        <nav className="tab-nav" aria-label="Documentation sections">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={tab.key === props.activeTab ? "tab active" : "tab"}
              onClick={() => props.onTabChange(tab.key)}
              type="button"
            >
              {tab.label[props.locale]}
            </button>
          ))}
        </nav>
      </div>
      <div className="header-actions">
        <label className="locale-select">
          <select
            aria-label="Language switcher"
            onChange={(event) => props.onLocaleChange(event.target.value as Locale)}
            value={props.locale}
          >
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
        </label>
      </div>
    </header>
  );
}
