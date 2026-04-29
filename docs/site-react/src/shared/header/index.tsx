import React from "react";

export type TabKey =
  | "home"
  | "ui-components"
  | "kits"
  | "headless"
  | "icons"
  | "ai-llms";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "home", label: "Home" },
  { key: "ui-components", label: "UI Components" },
  { key: "kits", label: "Kits" },
  { key: "headless", label: "Headless" },
  { key: "icons", label: "Icons" },
  { key: "ai-llms", label: "AI LLMs" },
];

type HeaderProps = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
};

export function Header(props: HeaderProps) {
  return (
    <header className="site-header">
      <div>
        <p className="eyebrow">usmoment</p>
        <h1 className="brand">Design system for relationship-centered products.</h1>
      </div>
      <nav className="tab-nav" aria-label="Documentation sections">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={tab.key === props.activeTab ? "tab active" : "tab"}
            onClick={() => props.onTabChange(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
