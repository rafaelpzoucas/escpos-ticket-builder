/**
 * Printer capabilities supported by ESC/POS standard
 */
export interface PrinterCapabilities {
  /** Support for text alignment (left, center, right) */
  align: boolean;
  /** Support for bold text */
  bold: boolean;
  /** Support for underlined text */
  underline: boolean;
  /** Support for double width text */
  doubleWidth: boolean;
  /** Support for double height text */
  doubleHeight: boolean;
  /** Support for paper cutting */
  cut: boolean;
  /** Support for partial paper cutting */
  partialCut: boolean;
  /** Support for QR code printing */
  qrCode: boolean;
  /** Support for beep/buzzer */
  beep: boolean;
}

/**
 * Printer-specific quirks and workarounds
 */
export interface PrinterQuirks {
  /** Maximum characters per line (may differ from cols) */
  maxLineLength?: number;
  /** Requires CRLF instead of LF for line breaks */
  elginNeedsCRLF?: boolean;
  /** Bold command is broken, should be avoided */
  brokenBoldCommand?: boolean;
  /** Requires initialization before every print job */
  needsInitBeforeEveryPrint?: boolean;
  /** Number of extra feed lines needed before cutting */
  needsExtraFeedBeforeCut?: number;
  /** Alternative cut command (overrides default) */
  alternativeCutCommand?: string;
}

/**
 * Complete printer profile configuration
 */
export interface PrinterProfile {
  /** Profile name/identifier */
  name: string;
  /** Number of columns (characters per line) */
  cols: number;
  /** Supported capabilities */
  capabilities: PrinterCapabilities;
  /** Printer-specific quirks */
  quirks: PrinterQuirks;
}

/**
 * Text alignment options
 */
export enum Align {
  LEFT = 0,
  CENTER = 1,
  RIGHT = 2,
}

/**
 * Text size options for headers
 */
export enum TextSize {
  NORMAL = 0x00,
  DOUBLE_WIDTH = 0x10,
  LARGE = 0x11,
  EXTRA_LARGE = 0x22,
}

/**
 * Table column configuration
 */
export interface TableColumn {
  /** Column header title */
  title: string;
  /** Fixed width in characters (optional) */
  width?: number;
  /** Flex ratio for dynamic width (optional) */
  flex?: number;
  /** Text alignment within column */
  align?: "left" | "right" | "center";
}

/**
 * Row data structure for key-value pairs
 */
export interface RowData {
  label: string;
  value: string;
}
