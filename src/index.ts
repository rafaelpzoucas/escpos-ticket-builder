// Main builder
export { receipt, helpers } from "./builder";
export type { ReceiptBuilder } from "./builder";

// Types
export type {
  PrinterProfile,
  PrinterCapabilities,
  PrinterQuirks,
  TableColumn,
  RowData,
} from "./types";
export { Align, TextSize } from "./types";

// Profiles
export {
  getDefaultProfile,
  profiles,
  genericProfile,
  elginI9Profile,
  bematechMP4200Profile,
  darumaDR800Profile,
  printer58mmProfile,
} from "./profiles";

// Utilities
export {
  removeAccents,
  wrapText,
  createRow,
  createProductLine,
} from "./utils/text";
export { Commands, ESC, GS } from "./utils/commands";
