import React from "react";
import { isZh, type Locale } from "../../shared/i18n";

type HomePageProps = {
  locale: Locale;
};

export function HomePage(props: HomePageProps) {
  return (
    <section className="page-section hero">
      <p className="eyebrow">{isZh(props.locale) ? "首页" : "Home"}</p>
      <h2>
        {isZh(props.locale)
          ? "关系型产品的能力组件系统"
          : "Capability components for relationship-centered products"}
      </h2>
      <p className="intro">
        {isZh(props.locale)
          ? "这里保留给产品定位、设计原则和系统级说明。组件展示会放在对应分类页，首页不展示组件。"
          : "This page is reserved for product positioning, design principles, and system-level guidance. Component showcases intentionally stay out of the homepage."}
      </p>
    </section>
  );
}
