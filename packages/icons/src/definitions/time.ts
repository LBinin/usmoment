import type { IconDefinition } from "../shared/types.js";

export const timeDefinition = {
  children: [
    {
      attrs: {
        clipRule: "evenodd",
        d: "M9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18ZM9.8 4C9.8 3.55817 9.44183 3.2 9 3.2C8.55817 3.2 8.2 3.55817 8.2 4V9V9.49443L8.64223 9.71554L11.6422 11.2155C12.0374 11.4131 12.518 11.253 12.7155 10.8578C12.9131 10.4626 12.753 9.98205 12.3578 9.78446L9.8 8.50557V4Z",
        fill: "var(--usm-icon-color, currentColor)",
        fillRule: "evenodd",
      },
      tag: "path",
    },
  ],
  componentName: "TimeIcon",
  height: 18,
  name: "time",
  viewBox: "0 0 18 18",
  width: 18,
} satisfies IconDefinition;
