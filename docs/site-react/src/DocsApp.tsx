import React, { useState } from "react";
import { AiLlmsPage } from "./pages/ai-llms";
import { HeadlessPage } from "./pages/headless";
import { HomePage } from "./pages/home";
import { IconsPage } from "./pages/icons";
import { KitsPage } from "./pages/kits";
import { UiComponentsPage } from "./pages/ui-components";
import { Header, type TabKey } from "./shared/header";
import type { Locale } from "./shared/i18n";

const tabKeys: TabKey[] = [
  "home",
  "kits",
  "ui-components",
  "headless",
  "icons",
  "ai-llms",
];

function renderPage(tab: TabKey, locale: Locale) {
  switch (tab) {
    case "ui-components":
      return <UiComponentsPage locale={locale} />;
    case "kits":
      return <KitsPage locale={locale} />;
    case "headless":
      return <HeadlessPage locale={locale} />;
    case "icons":
      return <IconsPage locale={locale} />;
    case "ai-llms":
      return <AiLlmsPage locale={locale} />;
    case "home":
    default:
      return <HomePage locale={locale} />;
  }
}

export function DocsApp() {
  const [activeTab, setActiveTab] = useState<TabKey>(() => readTabFromUrl());
  const [locale, setLocale] = useState<Locale>("zh");

  React.useEffect(() => {
    const handlePopState = () => setActiveTab(readTabFromUrl());

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function handleTabChange(tab: TabKey) {
    setActiveTab(tab);
    writeTabToUrl(tab);
    window.scrollTo({ behavior: "smooth", top: 0 });
  }

  return (
    <main className="page">
      <Header
        activeTab={activeTab}
        locale={locale}
        onLocaleChange={setLocale}
        onTabChange={handleTabChange}
      />
      {renderPage(activeTab, locale)}
    </main>
  );
}

function readTabFromUrl(): TabKey {
  const pathTab = window.location.pathname.split("/").filter(Boolean)[0];

  if (tabKeys.includes(pathTab as TabKey)) {
    return pathTab as TabKey;
  }

  const tab = new URLSearchParams(window.location.search).get("tab");

  return tabKeys.includes(tab as TabKey) ? (tab as TabKey) : "home";
}

function writeTabToUrl(tab: TabKey) {
  const pathname = tab === "home" ? "/" : `/${tab}`;

  window.history.pushState(null, "", pathname);
}
