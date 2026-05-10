import { TaroIconBase } from "./taro-icon-base.js";
import type { IconDefinition, IconProps } from "./types.js";

export function createTaroIcon(definition: IconDefinition) {
  function UsMomentTaroIcon(props: IconProps) {
    return <TaroIconBase definition={definition} {...props} />;
  }

  UsMomentTaroIcon.displayName = definition.componentName;

  return UsMomentTaroIcon;
}
