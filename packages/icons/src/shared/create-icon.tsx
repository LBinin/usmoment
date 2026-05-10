import React from "react";
import { IconBase } from "./icon-base.js";
import type { IconDefinition, IconProps } from "./types.js";

export function createIcon(definition: IconDefinition) {
  function UsMomentIcon(props: IconProps) {
    return <IconBase definition={definition} {...props} />;
  }

  UsMomentIcon.displayName = definition.componentName;

  return UsMomentIcon;
}
