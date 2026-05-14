import React from "react";
import clsx from "clsx";
import type { AccountingCategory } from "./index";

export function CategoryOptionContent(props: {
  category: AccountingCategory;
  iconClassName?: string;
  nameClassName?: string;
  subtitleClassName?: string;
}) {
  const {
    category,
    iconClassName,
    nameClassName,
    subtitleClassName,
  } = props;

  return (
    <>
      <div className="usm-accounting-category-selector__title">
        <span
          className={clsx(
            "usm-accounting-category-selector__name",
            nameClassName,
          )}
        >
          {category.name}
        </span>
        {category.subtitle ? (
          <span
            className={clsx(
              "usm-accounting-category-selector__subtitle",
              subtitleClassName,
            )}
          >
            {category.subtitle}
          </span>
        ) : null}
      </div>
      {category.icon ? (
        <span
          className={clsx(
            "usm-accounting-category-selector__icon",
            iconClassName,
          )}
        >
          {category.icon}
        </span>
      ) : null}
    </>
  );
}
