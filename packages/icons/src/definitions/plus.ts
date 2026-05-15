import type { IconDefinition } from "../shared/types.js";

export const plusDefinition = {
  children: [
    {
      attrs: {
        clipRule: "evenodd",
        d: "M40.5 3C40.5 1.34315 39.1569 0 37.5 0C35.8431 0 34.5 1.34315 34.5 3V34.5H3C1.34315 34.5 0 35.8431 0 37.5C0 39.1569 1.34315 40.5 3 40.5H34.5V72C34.5 73.6569 35.8431 75 37.5 75C39.1569 75 40.5 73.6569 40.5 72V40.5H72C73.6569 40.5 75 39.1569 75 37.5C75 35.8431 73.6569 34.5 72 34.5H40.5V3Z",
        fill: "var(--usm-icon-color, currentColor)",
        fillRule: "evenodd",
      },
      tag: "path",
    },
  ],
  componentName: "PlusIcon",
  height: 75,
  name: "plus",
  viewBox: "0 0 75 75",
  width: 75,
} satisfies IconDefinition;
