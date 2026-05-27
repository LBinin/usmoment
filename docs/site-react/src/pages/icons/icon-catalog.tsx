import type { Dispatch, SetStateAction } from "react";
import type { IconCategory } from "@usmoment/icon";
import {
  availableCategories,
  categoryCopy,
  iconEntries,
  type IconEntry,
} from "./icon-data";

type IconCatalogProps = {
  category: IconCategory | "all";
  copied: string | null;
  filteredIcons: IconEntry[];
  onCategoryChange: Dispatch<SetStateAction<IconCategory | "all">>;
  onCopy: (label: string, code: string) => void;
  onQueryChange: Dispatch<SetStateAction<string>>;
  query: string;
  zh: boolean;
};

export function IconCatalog(props: IconCatalogProps) {
  return (
    <section
      className="icons-doc-block icons-catalog"
      aria-labelledby="icons-browser-title"
    >
      <aside className="icons-catalog__sidebar">
        <div className="icons-search">
          <label htmlFor="icon-search">{props.zh ? "搜索" : "Search"}</label>
          <input
            id="icon-search"
            onChange={(event) => props.onQueryChange(event.target.value)}
            placeholder={props.zh ? "名称、组件、标签" : "Name, component, tag"}
            type="search"
            value={props.query}
          />
        </div>

        <div
          className="icons-category-bar"
          aria-label={props.zh ? "图标分类" : "Icon categories"}
        >
          <button
            className={props.category === "all" ? "is-active" : undefined}
            onClick={() => props.onCategoryChange("all")}
            type="button"
          >
            <span>{props.zh ? "全部" : "All"}</span>
            <small>{iconEntries.length}</small>
          </button>
          {availableCategories.map((categoryKey) => (
            <button
              className={props.category === categoryKey ? "is-active" : undefined}
              key={categoryKey}
              onClick={() => props.onCategoryChange(categoryKey)}
              type="button"
            >
              <span>
                {props.zh ? categoryCopy[categoryKey].zh : categoryCopy[categoryKey].en}
              </span>
              <small>{iconEntries.filter((icon) => icon.category === categoryKey).length}</small>
            </button>
          ))}
        </div>
      </aside>

      <div className="icons-catalog__main">
        <div className="icons-block-heading">
          <p className="component-kicker">Browser</p>
          <h3 id="icons-browser-title">{props.zh ? "图标浏览" : "Icon Browser"}</h3>
        </div>
        <div className="icons-grid">
          {props.filteredIcons.map((icon) => {
            const Icon = icon.component;

            return (
              <article className="icon-card" key={icon.name}>
                <button
                  className="icon-card__button"
                  onClick={() => props.onCopy(icon.name, icon.jsxCode)}
                  type="button"
                >
                  <Icon className="icon-card__glyph" size={44} title={icon.componentName} />
                  <span>{icon.componentName}</span>
                  <span className="icon-card__copied" aria-live="polite">
                    {props.copied === icon.name ? (props.zh ? "已复制" : "Copied") : null}
                  </span>
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
