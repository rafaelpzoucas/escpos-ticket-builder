import { PrinterProfile, Align, TextSize, TableColumn, RowData } from "./types";
import { getDefaultProfile } from "./profiles";
import {
  removeAccents,
  wrapText,
  createRow,
  createProductLine,
} from "./utils/text";
import { Commands } from "./utils/commands";

/**
 * Apply printer-specific quirks to the text
 */
function applyQuirks(text: string, profile: PrinterProfile): string {
  let result = text;

  // Apply CRLF if necessary
  if (profile.quirks.elginNeedsCRLF) {
    result = result.replace(/\n/g, "\r\n");
  }

  return result;
}

/**
 * Align cell text within a given width
 */
function alignCell(
  text: string,
  width: number,
  align: "left" | "right" | "center" = "left",
): string {
  const cleanText = removeAccents(String(text));
  const truncated = cleanText.slice(0, width);
  const padding = width - truncated.length;

  switch (align) {
    case "right":
      return " ".repeat(padding) + truncated;
    case "center": {
      const left = Math.floor(padding / 2);
      const right = padding - left;
      return " ".repeat(left) + truncated + " ".repeat(right);
    }
    default:
      return truncated + " ".repeat(padding);
  }
}

/**
 * Wrap cell text into multiple lines
 */
function wrapCell(text: string, width: number): string[] {
  return wrapText(removeAccents(String(text)), width).split("\n");
}

/**
 * Receipt builder interface
 */
export interface ReceiptBuilder {
  /** Align text to the left */
  left(): ReceiptBuilder;
  /** Align text to the center */
  center(): ReceiptBuilder;
  /** Align text to the right */
  right(): ReceiptBuilder;
  /** Add large header text (h1) */
  h1(text: string): ReceiptBuilder;
  /** Add medium header text (h2) */
  h2(text: string): ReceiptBuilder;
  /** Add small header text (h3) */
  h3(text: string): ReceiptBuilder;
  /** Add normal text */
  text(text: string): ReceiptBuilder;
  /** Add paragraph text */
  p(text: string): ReceiptBuilder;
  /** Start bold text */
  strong(): ReceiptBuilder;
  /** End bold text */
  endStrong(): ReceiptBuilder;
  /** Add underlined text */
  underline(text: string): ReceiptBuilder;
  /** Add line break(s) */
  br(lines?: number): ReceiptBuilder;
  /** Add horizontal rule */
  hr(width?: number, type?: "dashed" | "solid" | "double"): ReceiptBuilder;
  /** Add table with columns and rows */
  table(
    columns: TableColumn[],
    rows: Array<Array<string | number>>,
  ): ReceiptBuilder;
  /** Add single key-value row */
  row(label: string, value: string, width?: number): ReceiptBuilder;
  /** Add multiple key-value rows */
  rows(items: RowData[], width?: number): ReceiptBuilder;
  /** Add product line with quantity, name, and optional price */
  productLine(
    quantity: number | string,
    name: string,
    price?: number | string,
    width?: number,
  ): ReceiptBuilder;
  /** Add money row with formatted currency */
  money(label: string, value: number, width?: number): ReceiptBuilder;
  /** Initialize printer */
  initialize(): ReceiptBuilder;
  /** Cut paper */
  cut(full?: boolean, feedLines?: number): ReceiptBuilder;
  /** Feed paper */
  feed(lines?: number): ReceiptBuilder;
  /** Trigger beep */
  beep(): ReceiptBuilder;
  /** Add QR code */
  qrCode(data: string, size?: number): ReceiptBuilder;
  /** Build and return the final ESC/POS string */
  build(): string;
}

/**
 * Create a new receipt builder
 * @param profile - Printer profile (defaults to generic ESC/POS)
 * @returns Receipt builder instance
 */
export function receipt(
  profile: PrinterProfile = getDefaultProfile(),
): ReceiptBuilder {
  const buffer: string[] = [];
  const cols = profile.quirks.maxLineLength ?? profile.cols;

  const api: ReceiptBuilder = {
    left() {
      if (profile.capabilities.align) {
        buffer.push(Commands.ALIGN_LEFT(Align.LEFT));
      }
      return api;
    },

    center() {
      if (profile.capabilities.align) {
        buffer.push(Commands.ALIGN_CENTER(Align.CENTER));
      }
      return api;
    },

    right() {
      if (profile.capabilities.align) {
        buffer.push(Commands.ALIGN_RIGHT(Align.RIGHT));
      }
      return api;
    },

    h1(text: string) {
      const wrappedText = wrapText(removeAccents(text), cols);
      if (
        profile.capabilities.doubleWidth &&
        profile.capabilities.doubleHeight
      ) {
        const lines = wrappedText.split("\n");
        const formatted = lines
          .map(
            (line) =>
              `${Commands.SET_SIZE(TextSize.EXTRA_LARGE)}${line}${Commands.RESET_SIZE}`,
          )
          .join("\n");
        buffer.push(formatted);
      } else {
        buffer.push(wrappedText);
      }
      return api;
    },

    h2(text: string) {
      const wrappedText = wrapText(removeAccents(text), cols);
      if (
        profile.capabilities.doubleWidth &&
        profile.capabilities.doubleHeight
      ) {
        const lines = wrappedText.split("\n");
        const formatted = lines
          .map(
            (line) =>
              `${Commands.SET_SIZE(TextSize.LARGE)}${line}${Commands.RESET_SIZE}`,
          )
          .join("\n");
        buffer.push(formatted);
      } else {
        buffer.push(wrappedText);
      }
      return api;
    },

    h3(text: string) {
      const wrappedText = wrapText(removeAccents(text), cols);
      if (profile.capabilities.doubleWidth) {
        const lines = wrappedText.split("\n");
        const formatted = lines
          .map(
            (line) =>
              `${Commands.SET_SIZE(TextSize.DOUBLE_WIDTH)}${line}${Commands.RESET_SIZE}`,
          )
          .join("\n");
        buffer.push(formatted);
      } else {
        buffer.push(wrappedText);
      }
      return api;
    },

    text(text: string) {
      const wrappedText = wrapText(removeAccents(text), cols);
      buffer.push(wrappedText);
      return api;
    },

    p(text: string) {
      const wrappedText = wrapText(removeAccents(text), cols);
      buffer.push(wrappedText);
      return api;
    },

    strong() {
      if (profile.capabilities.bold && !profile.quirks.brokenBoldCommand) {
        buffer.push(Commands.BOLD_ON);
      }
      return api;
    },

    endStrong() {
      if (profile.capabilities.bold && !profile.quirks.brokenBoldCommand) {
        buffer.push(Commands.BOLD_OFF);
      }
      return api;
    },

    underline(text: string) {
      const wrappedText = wrapText(removeAccents(text), cols);
      if (profile.capabilities.underline) {
        buffer.push(
          `${Commands.UNDERLINE_ON}${wrappedText}${Commands.UNDERLINE_OFF}`,
        );
      } else {
        buffer.push(wrappedText);
      }
      return api;
    },

    br(lines = 1) {
      buffer.push("\n".repeat(lines));
      return api;
    },

    hr(width?: number, type: "dashed" | "solid" | "double" = "dashed") {
      const chars = {
        dashed: "-",
        solid: "_",
        double: "=",
      };

      const effectiveWidth = Math.min(width ?? cols, cols);
      const line = chars[type].repeat(effectiveWidth);
      buffer.push(`\n${line}\n`);
      return api;
    },

    table(columns: TableColumn[], rows: Array<Array<string | number>>) {
      const maxWidth = cols;

      // Calculate fixed and flexible widths
      const fixedWidth = columns.reduce(
        (sum, col) => sum + (col.width ?? 0),
        0,
      );
      const flexColumns = columns.filter((c) => !c.width);
      const totalFlex = flexColumns.reduce((sum, c) => sum + (c.flex ?? 1), 0);
      const remainingWidth = Math.max(maxWidth - fixedWidth, 0);

      const computedColumns = columns.map((col) => {
        if (col.width) {
          return { ...col, computedWidth: col.width };
        }

        const flex = col.flex ?? 1;
        const proportionalWidth = Math.floor(
          (remainingWidth * flex) / totalFlex,
        );

        return {
          ...col,
          computedWidth: Math.max(proportionalWidth, 4),
        };
      });

      // Normalize overflow
      const totalComputed = computedColumns.reduce(
        (sum, c) => sum + c.computedWidth,
        0,
      );

      if (totalComputed > maxWidth) {
        const scale = maxWidth / totalComputed;
        computedColumns.forEach((col) => {
          col.computedWidth = Math.max(
            4,
            Math.floor(col.computedWidth * scale),
          );
        });
      }

      const lines: string[] = [];

      // Header
      const header = computedColumns
        .map((col) => alignCell(col.title, col.computedWidth, col.align))
        .join("");

      lines.push(header);
      lines.push("-".repeat(Math.min(maxWidth, header.length)));

      // Rows with multiline wrapping
      rows.forEach((row) => {
        const wrappedCells = computedColumns.map((col, index) => {
          const value = row[index] ?? "";
          return wrapCell(String(value), col.computedWidth);
        });

        const maxLines = Math.max(...wrappedCells.map((c) => c.length));

        for (let lineIndex = 0; lineIndex < maxLines; lineIndex++) {
          const line = computedColumns
            .map((col, colIndex) => {
              const cellLine = wrappedCells[colIndex][lineIndex] ?? "";
              return alignCell(cellLine, col.computedWidth, col.align);
            })
            .join("");

          lines.push(line);
        }
      });

      buffer.push(lines.join("\n"));
      return api;
    },

    row(label: string, value: string, width?: number) {
      buffer.push(createRow(label, value, width ?? cols));
      return api;
    },

    rows(items: RowData[], width?: number) {
      buffer.push(
        items
          .map((item) => createRow(item.label, item.value, width ?? cols))
          .join("\n"),
      );
      return api;
    },

    productLine(
      quantity: number | string,
      name: string,
      price?: number | string,
      width?: number,
    ) {
      buffer.push(createProductLine(quantity, name, price, width ?? cols));
      return api;
    },

    money(label: string, value: number, width?: number) {
      const formatted = `R$ ${value.toFixed(2).replace(".", ",")}`;
      buffer.push(createRow(label, formatted, width ?? cols));
      return api;
    },

    initialize() {
      buffer.push(Commands.INITIALIZE);
      buffer.push(Commands.SELECT_CHARSET);
      return api;
    },

    cut(full = true, feedLines?: number) {
      const extraFeed = profile.quirks.needsExtraFeedBeforeCut ?? 3;
      const totalFeed = feedLines ?? extraFeed;

      buffer.push(Commands.FEED(totalFeed));

      if (profile.capabilities.cut) {
        if (profile.quirks.alternativeCutCommand) {
          buffer.push(profile.quirks.alternativeCutCommand);
        } else if (!full && !profile.capabilities.partialCut) {
          buffer.push(Commands.CUT_FULL);
        } else {
          buffer.push(full ? Commands.CUT_FULL : Commands.CUT_PARTIAL);
        }
      }
      return api;
    },

    feed(lines = 1) {
      buffer.push("\n".repeat(lines));
      return api;
    },

    beep() {
      if (profile.capabilities.beep) {
        buffer.push(Commands.BEEP);
      }
      return api;
    },

    qrCode(data: string, size = 6) {
      if (profile.capabilities.qrCode) {
        // QR Code implementation varies by manufacturer
        // This is a placeholder for future implementation
        console.warn("QR Code support not yet implemented");
      }
      return api;
    },

    build(): string {
      let result = buffer.join("");
      result = applyQuirks(result, profile);
      return result;
    },
  };

  if (profile.quirks.needsInitBeforeEveryPrint) {
    api.initialize();
  }

  return api;
}

/**
 * Utility helpers exported for advanced use cases
 */
export const helpers = {
  removeAccents,
  wrapText,
  createRow,
  createProductLine,
};
