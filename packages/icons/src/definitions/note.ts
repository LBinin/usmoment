import type { IconDefinition } from "../shared/types.js";

export const noteDefinition = {
  children: [
    {
      attrs: {
        clipRule: "evenodd",
        d: "M4 16H14C16.2091 16 18 14.2091 18 12V4C18 1.79086 16.2091 0 14 0H4C1.79086 0 0 1.79086 0 4V12C0 14.2091 1.79086 16 4 16ZM4.75 4C4.33579 4 4 4.33579 4 4.75C4 5.16421 4.33579 5.5 4.75 5.5H13.25C13.6642 5.5 14 5.16421 14 4.75C14 4.33579 13.6642 4 13.25 4H4.75ZM4 7.75C4 7.33579 4.33579 7 4.75 7H13.25C13.6642 7 14 7.33579 14 7.75C14 8.16421 13.6642 8.5 13.25 8.5H4.75C4.33579 8.5 4 8.16421 4 7.75ZM4.75 10C4.33579 10 4 10.3358 4 10.75C4 11.1642 4.33579 11.5 4.75 11.5H10.25C10.6642 11.5 11 11.1642 11 10.75C11 10.3358 10.6642 10 10.25 10H4.75Z",
        fill: "var(--usm-icon-color, currentColor)",
        fillRule: "evenodd",
      },
      tag: "path",
    },
  ],
  componentName: "NoteIcon",
  height: 16,
  name: "note",
  viewBox: "0 0 18 16",
  width: 18,
} satisfies IconDefinition;
