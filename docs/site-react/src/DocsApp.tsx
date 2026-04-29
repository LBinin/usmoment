import React, { useState } from "react";
import { AiLlmsPage } from "./pages/ai-llms";
import { HeadlessPage } from "./pages/headless";
import { HomePage } from "./pages/home";
import { IconsPage } from "./pages/icons";
import { KitsPage } from "./pages/kits";
import { UiComponentsPage } from "./pages/ui-components";
import { Header, type TabKey } from "./shared/header";

function renderPage(tab: TabKey) {
  switch (tab) {
    case "ui-components":
      return <UiComponentsPage />;
    case "kits":
      return <KitsPage />;
    case "headless":
      return <HeadlessPage />;
    case "icons":
      return <IconsPage />;
    case "ai-llms":
      return <AiLlmsPage />;
    case "home":
    default:
      return <HomePage />;
  }
}

export function DocsApp() {
  const [activeTab, setActiveTab] = useState<TabKey>("home");

  return (
    <main className="page">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      {renderPage(activeTab)}
    </main>
  );
}
