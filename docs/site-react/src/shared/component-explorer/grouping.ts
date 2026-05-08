import { isZh, type Locale } from "../i18n";
import type { ComponentDoc } from "./types";

export function groupDocs(docs: ComponentDoc[], grouped = false, locale: Locale) {
  if (!grouped) return [{ title: isZh(locale) ? "全部" : "All", docs }];

  const groups = new Map<string, ComponentDoc[]>();

  for (const doc of docs) {
    const title = doc.category ?? doc.layer;
    groups.set(title, [...(groups.get(title) ?? []), doc]);
  }

  return [...groups.entries()].map(([title, groupedDocs]) => ({
    title,
    docs: groupedDocs,
  }));
}
