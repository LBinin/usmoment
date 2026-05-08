import { useEffect, useState } from "react";
import { isZh, type Locale } from "../i18n";
import { typeAnchor } from "./anchors";
import type { ComponentDoc } from "./types";

export type TocItem = {
  id: string;
  label: string;
  level: 1 | 2;
};

export function componentTocItems(doc: ComponentDoc, locale: Locale): TocItem[] {
  const zh = isZh(locale);
  const items = [
    doc.playground
      ? {
          id: "section-playground",
          label: zh ? "调试器" : "Playground",
          level: 1,
        }
      : null,
    { id: "section-import", label: zh ? "导入" : "Import", level: 1 },
    { id: "section-api", label: doc.apiTitle, level: 1 },
    ...(doc.typeSections?.map((section) => ({
      id: typeAnchor(section.title),
      label: section.title,
      level: 2,
    })) ?? []),
    doc.usage
      ? { id: "section-notes", label: zh ? "说明" : "Notes", level: 1 }
      : null,
  ];

  return items.filter((item): item is TocItem => Boolean(item));
}

export function useActiveTocId(items: TocItem[]) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return undefined;

    const itemIds = new Set(items.map((item) => item.id));
    const updateFromHash = () => {
      const hashId = window.location.hash.slice(1);

      if (itemIds.has(hashId)) {
        setActiveId(hashId);
      }
    };
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top),
          )[0];

        if (visibleEntry?.target.id) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-120px 0px -65% 0px",
        threshold: [0, 1],
      },
    );

    for (const item of items) {
      const element = document.getElementById(item.id);

      if (element) {
        observer.observe(element);
      }
    }

    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);

    return () => {
      window.removeEventListener("hashchange", updateFromHash);
      observer.disconnect();
    };
  }, [items]);

  useEffect(() => {
    setActiveId((current) =>
      items.some((item) => item.id === current) ? current : (items[0]?.id ?? ""),
    );
  }, [items]);

  return activeId;
}
