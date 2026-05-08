import React from "react";
import { isZh, type Locale } from "../../shared/i18n";

type IconsPageProps = {
  locale: Locale;
};

export function IconsPage(props: IconsPageProps) {
  return (
    <section className="page-section">
      <p className="eyebrow">Icons</p>
      <div className="card">
        <p>
          {isZh(props.locale)
            ? "预留给后续图标资产与使用规范。"
            : "Reserved for future icon assets and usage guidance."}
        </p>
      </div>
    </section>
  );
}
