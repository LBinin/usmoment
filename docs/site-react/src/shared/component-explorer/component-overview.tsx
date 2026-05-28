import type {
  ComponentDoc,
  ComponentOverview,
  ComponentOverviewCard,
} from "./types";
import { isZh, type Locale } from "../i18n";

type OverviewGroup = {
  docs: ComponentDoc[];
  id: string;
  title: string;
};

type ComponentOverviewPanelProps = {
  docs: ComponentDoc[];
  groups: OverviewGroup[];
  locale: Locale;
  onSelectDoc: (docId: string) => void;
  overview: ComponentOverview;
};

function overviewGroupTitle(title: string, locale: Locale) {
  const zh = isZh(locale);
  const labels: Record<string, string> = zh
    ? {
        记账类: "记账类 Kits",
        输入: "输入型组件",
        展示: "展示型组件",
      }
    : {
        Accounting: "Accounting Kits",
        Display: "Display surfaces",
        Input: "Input surfaces",
      };

  return labels[title] ?? title;
}

function fallbackOverviewCard(
  doc: ComponentDoc,
  locale: Locale,
): ComponentOverviewCard {
  const zh = isZh(locale);

  return {
    description: doc.category ?? doc.layer,
    docId: doc.id,
    imageAlt: zh
      ? `${doc.name} 概览插图`
      : `${doc.name} overview illustration`,
    imageSrc: "/assets/component-overview/overview-placeholder.svg",
  };
}

export function ComponentOverviewPanel(props: ComponentOverviewPanelProps) {
  const cardsByDocId = new Map(
    props.overview.cards.map((card) => [card.docId, card]),
  );

  return (
    <article className="component-overview">
      <div className="component-overview__sections">
        {props.groups.map((group) => (
          <section className="component-overview__section" id={group.id} key={group.id}>
            <h4>{overviewGroupTitle(group.title, props.locale)}</h4>
            <div className="component-overview__grid">
              {group.docs.map((doc) => {
                const card =
                  cardsByDocId.get(doc.id) ?? fallbackOverviewCard(doc, props.locale);

                return (
                  <button
                    className="component-overview-card"
                    key={doc.id}
                    onClick={() => props.onSelectDoc(doc.id)}
                    type="button"
                  >
                    <span className="component-overview-card__image">
                      <img alt={card.imageAlt} src={card.imageSrc} />
                    </span>
                    <span className="component-overview-card__body">
                      <strong>{doc.menuLabel ?? doc.name}</strong>
                      <span className="component-overview-card__description">
                        {card.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
