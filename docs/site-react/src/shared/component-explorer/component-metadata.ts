import type { ComponentDoc } from "./types";

export function componentMetadata(input: {
  packageName: string;
  sourcePath: string;
  llmsPath?: string;
}): ComponentDoc["metadata"] {
  return {
    llms: input.llmsPath
      ? {
          href: input.llmsPath,
          label: "llms.md",
        }
      : undefined,
    packageName: input.packageName,
    source: {
      href: `https://github.com/LBinin/usmoment/tree/main/${input.sourcePath}`,
      label: input.sourcePath.split("/").slice(-2).join("/"),
    },
  };
}
