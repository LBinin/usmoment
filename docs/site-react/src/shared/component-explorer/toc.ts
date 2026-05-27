import { useCallback, useEffect, useState } from "react";
import { isZh, type Locale } from "../i18n";
import { typeAnchor } from "./anchors";
import type { ComponentDoc } from "./types";

export type TocItem = {
  id: string;
  label: string;
  level: 1 | 2;
};

const fallbackAnchorOffset = 132;
const headerActivationGap = 24;

function readPixelValue(value: string) {
  const parsed = Number.parseFloat(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function resolveAnchorOffset() {
  const rootStyle = window.getComputedStyle(document.documentElement);
  const scrollPaddingTop = readPixelValue(rootStyle.scrollPaddingTop);

  if (scrollPaddingTop > 0) {
    return scrollPaddingTop;
  }

  const header = document.querySelector<HTMLElement>(".site-header");

  if (header) {
    return header.getBoundingClientRect().height + headerActivationGap;
  }

  return fallbackAnchorOffset;
}

export function componentTocItems(doc: ComponentDoc, locale: Locale): TocItem[] {
  const zh = isZh(locale);
  const items = [
    doc.playground
      ? {
          id: "section-playground",
          label: zh ? "交互实验室" : "Interactive Lab",
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
  const updateActiveId = useCallback(() => {
    if (items.length === 0) return;

    const anchorOffset = resolveAnchorOffset();
    const scrollLine = window.scrollY + anchorOffset;
    let nextActiveId = items[0]?.id ?? "";

    for (const item of items) {
      const element = document.getElementById(item.id);

      if (!element) continue;

      const anchorTop = element.getBoundingClientRect().top + window.scrollY;

      if (anchorTop <= scrollLine) {
        nextActiveId = item.id;
      } else {
        break;
      }
    }

    setActiveId((current) => (current === nextActiveId ? current : nextActiveId));
  }, [items]);

  useEffect(() => {
    if (items.length === 0) return undefined;

    let frame = 0;
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateActiveId);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  }, [items, updateActiveId]);

  useEffect(() => {
    setActiveId((current) =>
      items.some((item) => item.id === current) ? current : (items[0]?.id ?? ""),
    );
    updateActiveId();
  }, [items, updateActiveId]);

  return activeId;
}
