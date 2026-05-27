import type React from "react";
import {
  BackspaceIcon,
  DateIcon,
  ImageIcon,
  NoteIcon,
  PlusIcon,
  TimeIcon,
  YenCircleIcon,
  iconMetadata,
  type IconCategory,
} from "@usmoment/icon";

export type IconEntry = {
  category: IconCategory;
  component: React.ComponentType<{
    className?: string;
    color?: string;
    renderMode?: "svg" | "mask";
    size?: number;
    title?: string;
  }>;
  componentName: string;
  jsxCode: string;
  name: string;
  tags: string[];
};

export const iconEntries: IconEntry[] = [
  {
    category: iconMetadata.backspace.category,
    component: BackspaceIcon,
    componentName: iconMetadata.backspace.componentName,
    jsxCode: `<BackspaceIcon size={25} title="Backspace" />`,
    name: iconMetadata.backspace.name,
    tags: iconMetadata.backspace.tags,
  },
  {
    category: iconMetadata.plus.category,
    component: PlusIcon,
    componentName: iconMetadata.plus.componentName,
    jsxCode: `<PlusIcon size={24} title="Plus" />`,
    name: iconMetadata.plus.name,
    tags: iconMetadata.plus.tags,
  },
  {
    category: iconMetadata.yenCircle.category,
    component: YenCircleIcon,
    componentName: iconMetadata.yenCircle.componentName,
    jsxCode: `<YenCircleIcon size={24} title="Yen" />`,
    name: iconMetadata.yenCircle.name,
    tags: iconMetadata.yenCircle.tags,
  },
  {
    category: iconMetadata.note.category,
    component: NoteIcon,
    componentName: iconMetadata.note.componentName,
    jsxCode: `<NoteIcon size={24} title="Note" />`,
    name: iconMetadata.note.name,
    tags: iconMetadata.note.tags,
  },
  {
    category: iconMetadata.image.category,
    component: ImageIcon,
    componentName: iconMetadata.image.componentName,
    jsxCode: `<ImageIcon size={24} title="Image" />`,
    name: iconMetadata.image.name,
    tags: iconMetadata.image.tags,
  },
  {
    category: iconMetadata.date.category,
    component: DateIcon,
    componentName: iconMetadata.date.componentName,
    jsxCode: `<DateIcon size={24} title="Date" />`,
    name: iconMetadata.date.name,
    tags: iconMetadata.date.tags,
  },
  {
    category: iconMetadata.time.category,
    component: TimeIcon,
    componentName: iconMetadata.time.componentName,
    jsxCode: `<TimeIcon size={24} title="Time" />`,
    name: iconMetadata.time.name,
    tags: iconMetadata.time.tags,
  },
];

const categoryOrder: IconCategory[] = [
  "navigation",
  "action",
  "feedback",
  "data",
  "commerce",
  "moment",
  "device",
  "date-time",
];

export const availableCategories = categoryOrder.filter((categoryKey) =>
  iconEntries.some((icon) => icon.category === categoryKey),
);

export const categoryCopy: Record<
  IconCategory,
  { en: string; zh: string; summaryEn: string; summaryZh: string }
> = {
  action: {
    en: "Action",
    summaryEn: "Direct user commands.",
    summaryZh: "用户直接触发的操作命令。",
    zh: "操作",
  },
  commerce: {
    en: "Commerce",
    summaryEn: "Money, bills, and transaction flows.",
    summaryZh: "金额、账单、支付与交易流程。",
    zh: "财务",
  },
  data: {
    en: "Data",
    summaryEn: "Lists, filtering, charts, and structured content.",
    summaryZh: "列表、筛选、图表与结构化内容。",
    zh: "数据",
  },
  "date-time": {
    en: "Date & Time",
    summaryEn: "Calendar, duration, and time concepts.",
    summaryZh: "日期、日程、时长与时间概念。",
    zh: "日期时间",
  },
  device: {
    en: "Device",
    summaryEn: "Platform, hardware, and environment icons.",
    summaryZh: "平台、硬件与运行环境。",
    zh: "设备",
  },
  feedback: {
    en: "Feedback",
    summaryEn: "Status, validation, loading, and messages.",
    summaryZh: "状态、校验、加载与系统反馈。",
    zh: "反馈",
  },
  moment: {
    en: "Moment",
    summaryEn: "Relationship-centered and warm product moments.",
    summaryZh: "关系、记忆、家庭与温暖产品语义。",
    zh: "时刻",
  },
  navigation: {
    en: "Navigation",
    summaryEn: "Moving through UI or changing hierarchy.",
    summaryZh: "页面移动、层级切换与方向导航。",
    zh: "导航",
  },
};

export const installCode = "pnpm add @usmoment/icon";

export const usageCode = `import { BackspaceIcon } from "@usmoment/icon";

<BackspaceIcon size={25} title="Backspace" />`;
