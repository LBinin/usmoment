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

export type ComponentMetadata = {
  source?: {
    label: string;
    href: string;
  };
  llms?: {
    label: string;
    href: string;
  };
  status?: string;
  packageName?: string;
};

export type ComponentDoc = {
  id: string;
  name: string;
  menuLabel?: string;
  layer: ComponentLayer;
  category?: string;
  summary: string;
  importSnippet: string;
  metadata?: ComponentMetadata;
  apiTitle: string;
  apiRows: ApiRow[];
  typeSections?: TypeSection[];
  typeLinks?: Record<string, string>;
  usage?: string[];
  playground?: ReactNode;
};

export type ComponentOverviewCard = {
  description: string;
  docId: string;
  imageAlt: string;
  imageSrc: string;
};

export type ComponentOverview = {
  id: string;
  cards: ComponentOverviewCard[];
};

export type EditorLanguage = "json" | "tsx";
