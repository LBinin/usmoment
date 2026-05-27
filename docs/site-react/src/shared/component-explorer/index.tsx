import { useEffect, useMemo, useState } from "react";
import { isZh, type Locale } from "../i18n";
import { typeAnchor } from "./anchors";
import { ApiTable } from "./api-table";
import { StaticCodeBlock } from "./code-block";
import {
  readSelectedDocId,
  replaceSelectedDocRoute,
  writeSelectedDocToUrl,
} from "./routing";
import { componentTocItems, useActiveTocId } from "./toc";
import type { ComponentDoc } from "./types";
import { groupDocs } from "./grouping";

function ComponentMetadataStrip(props: {
  doc: ComponentDoc;
  locale: Locale;
}) {
  const metadata = props.doc.metadata;

  if (!metadata) return null;

  const labels = isZh(props.locale)
    ? { llms: "LLMs", source: "源码" }
    : {
        llms: "LLMs",
        source: "Source",
      };
  const items = [
    metadata.source
      ? {
          href: metadata.source.href,
          label: labels.source,
          value: metadata.source.label,
        }
      : null,
    metadata.llms
      ? {
          href: metadata.llms.href,
          label: labels.llms,
          value: metadata.llms.label,
        }
      : null,
  ].filter(Boolean) as Array<{ href?: string; label: string; value: string }>;

  if (items.length === 0) return null;

  return (
    <dl
      aria-label={isZh(props.locale) ? "组件信息" : "Component metadata"}
      className="component-metadata"
    >
      {items.map((item) => (
        <div className="component-metadata__item" key={`${item.label}-${item.value}`}>
          <dt>{item.label}</dt>
          <dd>
            {item.href ? (
              <a href={item.href}>{item.value}</a>
            ) : (
              <code>{item.value}</code>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

type ComponentExplorerProps = {
  eyebrow: string;
  title: string;
  description: string;
  docs: ComponentDoc[];
  grouped?: boolean;
  locale: Locale;
  routePath: string;
};

export function ComponentExplorer(props: ComponentExplorerProps) {
  const [selectedId, setSelectedId] = useState(() =>
    readSelectedDocId(props.docs),
  );
  const selected = props.docs.find((doc) => doc.id === selectedId) ?? props.docs[0];
  const groups = useMemo(
    () => groupDocs(props.docs, props.grouped, props.locale),
    [props],
  );
  const linkedTypes = useMemo(
    () => new Set(selected?.typeSections?.map((section) => section.title) ?? []),
    [selected],
  );

  if (!selected) return null;

  const tocItems = useMemo(
    () => componentTocItems(selected, props.locale),
    [props.locale, selected],
  );
  const activeTocId = useActiveTocId(tocItems);

  useEffect(() => {
    const nextSelectedId = readSelectedDocId(props.docs);

    setSelectedId((current) =>
      props.docs.some((doc) => doc.id === current) ? current : nextSelectedId,
    );
  }, [props.docs]);

  useEffect(() => {
    const handlePopState = () => setSelectedId(readSelectedDocId(props.docs));

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [props.docs]);

  useEffect(() => {
    const hashId = window.location.hash.slice(1);

    if (!hashId) return;

    window.requestAnimationFrame(() => {
      document.getElementById(hashId)?.scrollIntoView({ block: "start" });
    });
  }, [selected.id]);

  useEffect(() => {
    replaceSelectedDocRoute(props.routePath, selected.id);
  }, [props.routePath, selected.id]);

  function selectDoc(docId: string) {
    setSelectedId(docId);
    writeSelectedDocToUrl(props.routePath, docId);
  }

  return (
    <section className="component-page">
      <div className="component-browser">
        <aside className="component-sidebar" aria-label={`${props.title} list`}>
          {groups.map((group) => (
            <div className="component-group" key={group.title}>
              <h3>{group.title}</h3>
              <div className="component-link-list">
                {group.docs.map((doc) => (
                  <button
                    className={
                      doc.id === selected.id
                        ? "component-link component-link--active"
                        : "component-link"
                    }
                    key={doc.id}
                    onClick={() => selectDoc(doc.id)}
                    type="button"
                  >
                    <span>{doc.name}</span>
                    <small>{doc.layer}</small>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <div className="component-main">
          <div className="component-page__intro">
            <p className="eyebrow">{props.eyebrow}</p>
            <h2>{props.title}</h2>
            <p>{props.description}</p>
          </div>

          <article className="component-detail">
            <div className="component-detail__header">
              <div>
                <p className="component-kicker">{selected.layer}</p>
                <h3>{selected.name}</h3>
              </div>
              {selected.category ? (
                <span className="component-pill">{selected.category}</span>
              ) : null}
            </div>

            <p className="component-summary">{selected.summary}</p>

            <ComponentMetadataStrip doc={selected} locale={props.locale} />

            {selected.playground ? (
              <section
                className="doc-block doc-block--playground"
                id="section-playground"
              >
                {selected.playground}
              </section>
            ) : null}

            <section className="doc-block" id="section-import">
              <h4>{isZh(props.locale) ? "导入" : "Import"}</h4>
              <StaticCodeBlock
                copyLabel={isZh(props.locale) ? "复制" : "Copy"}
                copiedLabel={isZh(props.locale) ? "已复制" : "Copied"}
                key={selected.id}
                value={selected.importSnippet}
              />
            </section>

            <section className="doc-block" id="section-api">
              <h4>{selected.apiTitle}</h4>
              <ApiTable
                linkedTypes={linkedTypes}
                locale={props.locale}
                rows={selected.apiRows}
                typeLinks={selected.typeLinks}
              />
            </section>

            {selected.typeSections?.map((section) => (
              <section className="doc-block" key={section.title}>
                <h4 id={typeAnchor(section.title)}>
                  <a className="type-heading-link" href={`#${typeAnchor(section.title)}`}>
                    {section.title}
                  </a>
                </h4>
                <ApiTable
                  linkedTypes={linkedTypes}
                  locale={props.locale}
                  rows={section.rows}
                  typeLinks={selected.typeLinks}
                />
              </section>
            ))}

            {selected.usage ? (
              <section className="doc-block" id="section-notes">
                <h4>{isZh(props.locale) ? "说明" : "Notes"}</h4>
                <ul className="doc-notes">
                  {selected.usage.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </article>
        </div>

        <aside className="component-toc" aria-label="On this page">
          <h3>{isZh(props.locale) ? "当前页面" : "On this page"}</h3>
          <nav>
            {tocItems.map((item) => (
              <a
                className={
                  item.id === activeTocId
                    ? `component-toc__link component-toc__link--level-${item.level} component-toc__link--active`
                    : `component-toc__link component-toc__link--level-${item.level}`
                }
                href={`#${item.id}`}
                key={item.id}
                title={item.label}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </section>
  );
}
export { getHeadlessComponentDocs, getKitComponentDocs, getUiComponentDocs } from "./component-docs";
export type { ApiRow, ComponentDoc, TypeSection } from "./types";
