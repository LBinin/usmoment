import React from "react";
import { isZh, type Locale } from "../../shared/i18n";

type AiLlmsPageProps = {
  locale: Locale;
};

export function AiLlmsPage(props: AiLlmsPageProps) {
  return (
    <section className="page-section">
      <p className="eyebrow">AI LLMs</p>
      <div className="docs-card">
        <p>
          {isZh(props.locale)
            ? "预留给 Agent manifest、recipes 和面向模型的接入指南。"
            : "Reserved for agent manifests, recipes, and model-facing integration guidance."}
        </p>
      </div>
    </section>
  );
}
