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
  date: {
    category: "date-time",
    componentName: "DateIcon",
    license: {
      note: "Provided by the project maintainer from a local SVG file.",
      title: "project-provided",
    },
    name: "date",
    source: {
      note: "Rebuilt from a local SVG file provided during icon-library expansion.",
      provider: "custom",
    },
    tags: ["calendar", "date", "day", "schedule"],
  },
  image: {
    category: "data",
    componentName: "ImageIcon",
    license: {
      note: "Provided by the project maintainer from a local SVG file.",
      title: "project-provided",
    },
    name: "image",
    source: {
      note: "Rebuilt from a local SVG file provided during icon-library expansion.",
      provider: "custom",
    },
    tags: ["image", "media", "photo", "picture"],
  },
  note: {
    category: "data",
    componentName: "NoteIcon",
    license: {
      note: "Provided by the project maintainer from a local SVG file.",
      title: "project-provided",
    },
    name: "note",
    source: {
      note: "Rebuilt from a local SVG file provided during icon-library expansion.",
      provider: "custom",
    },
    tags: ["document", "memo", "note", "text"],
  },
  plus: {
    category: "action",
    componentName: "PlusIcon",
    license: {
      note: "Provided by the project maintainer from a local SVG file.",
      title: "project-provided",
    },
    name: "plus",
    source: {
      note: "Rebuilt from a local SVG file provided during icon-library expansion.",
      provider: "custom",
    },
    tags: ["add", "create", "new", "plus"],
  },
  time: {
    category: "date-time",
    componentName: "TimeIcon",
    license: {
      note: "Provided by the project maintainer from a local SVG file.",
      title: "project-provided",
    },
    name: "time",
    source: {
      note: "Rebuilt from a local SVG file provided during icon-library expansion.",
      provider: "custom",
    },
    tags: ["clock", "duration", "time"],
  },
  yenCircle: {
    category: "commerce",
    componentName: "YenCircleIcon",
    license: {
      note: "Provided by the project maintainer from an inline SVG data URL.",
      title: "project-provided",
    },
    name: "yen-circle",
    source: {
      note: "Decoded from the SVG data URL provided during icon-library expansion.",
      provider: "custom",
    },
    tags: ["currency", "money", "payment", "yen"],
  },
} satisfies Record<string, IconMetadata>;
