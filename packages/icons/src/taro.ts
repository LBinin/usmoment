import { backspaceDefinition } from "./definitions/backspace.js";
import { dateDefinition } from "./definitions/date.js";
import { imageDefinition } from "./definitions/image.js";
import { noteDefinition } from "./definitions/note.js";
import { plusDefinition } from "./definitions/plus.js";
import { timeDefinition } from "./definitions/time.js";
import { yenCircleDefinition } from "./definitions/yen-circle.js";
import { createTaroIcon } from "./shared/create-taro-icon.js";

export const BackspaceIcon = createTaroIcon(backspaceDefinition);
export const DateIcon = createTaroIcon(dateDefinition);
export const ImageIcon = createTaroIcon(imageDefinition);
export const NoteIcon = createTaroIcon(noteDefinition);
export const PlusIcon = createTaroIcon(plusDefinition);
export const TimeIcon = createTaroIcon(timeDefinition);
export const YenCircleIcon = createTaroIcon(yenCircleDefinition);
