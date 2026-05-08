import React from "react";
import { isZh, type Locale } from "../../shared/i18n";

type HomePageProps = {
  locale: Locale;
  onGetStarted: () => void;
};

export function HomePage(props: HomePageProps) {
  const zh = isZh(props.locale);

  return (
    <section className="page-section hero" aria-labelledby="home-title">
      <div className="hero__stage">
        <p className="hero__version">v{__USMOMENT_VERSION__}</p>
        <h2 id="home-title">
          <span className="hero__word hero__word--brand">
            <span>US</span>
            <span>Moment</span>
          </span>
          <span className="hero__word hero__word--component">COMPONENT</span>
          <span className="hero__word hero__word--design">DESIGN</span>
        </h2>
        <button className="hero__start" onClick={props.onGetStarted} type="button">
          <span>{zh ? "开始使用" : "Get Start"}</span>
        </button>
      </div>
      <div className="hero__field" aria-hidden="true">
        <div className="hero__orbit hero__orbit--one" />
        <div className="hero__orbit hero__orbit--two" />
        <div className="hero__spark hero__spark--one" />
        <div className="hero__spark hero__spark--two" />
      </div>
    </section>
  );
}
