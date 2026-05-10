export type IconCategory =
  | "action"
  | "commerce"
  | "data"
  | "date-time"
  | "device"
  | "feedback"
  | "moment"
  | "navigation";

export type IconMetadata = {
  category: IconCategory;
  componentName: string;
  license: {
    note: string;
    title: string;
  };
  name: string;
  source: {
    provider: "custom" | "iconify" | "iconfont";
    note: string;
  };
  tags: string[];
};

export const iconMetadata = {
  backspace: {
    category: "action",
    componentName: "BackspaceIcon",
    license: {
      note: "Provided by the project maintainer from an inline SVG data URL.",
      title: "project-provided",
    },
    name: "backspace",
    source: {
      note: "Decoded from the SVG data URL provided during the icon-library planning work.",
      provider: "custom",
    },
    tags: ["backspace", "delete", "keyboard", "remove"],
  },
} satisfies Record<string, IconMetadata>;
