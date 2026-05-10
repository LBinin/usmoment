import type { ReactNode } from "react";

export type ComponentLayer = "Headless" | "UI" | "Kit";

export type ApiRow = {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: string;
  description: string;
};

export type TypeSection = {
  title: string;
  rows: ApiRow[];
};

export type ComponentDoc = {
  id: string;
  name: string;
  layer: ComponentLayer;
  category?: string;
  summary: string;
  importSnippet: string;
  apiTitle: string;
  apiRows: ApiRow[];
  typeSections?: TypeSection[];
  typeLinks?: Record<string, string>;
  usage?: string[];
  playground?: ReactNode;
};

export type EditorLanguage = "json" | "tsx";
