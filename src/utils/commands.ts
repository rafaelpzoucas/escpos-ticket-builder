/**
 * ESC/POS control characters
 */
export const ESC = "\x1B";
export const GS = "\x1D";

/**
 * Common ESC/POS commands
 */
export const Commands = {
  /** Initialize printer */
  INITIALIZE: `${ESC}@`,

  /** Select character code table (Latin-1) */
  SELECT_CHARSET: `${ESC}R\x00`,

  /** Alignment commands */
  ALIGN_LEFT: (code: number) => `${ESC}a${String.fromCharCode(code)}`,
  ALIGN_CENTER: (code: number) => `${ESC}a${String.fromCharCode(code)}`,
  ALIGN_RIGHT: (code: number) => `${ESC}a${String.fromCharCode(code)}`,

  /** Text size commands */
  SET_SIZE: (size: number) => `${GS}!${String.fromCharCode(size)}`,
  RESET_SIZE: `${GS}!${String.fromCharCode(0x00)}`,

  /** Bold commands */
  BOLD_ON: `${ESC}E\x01`,
  BOLD_OFF: `${ESC}E\x00`,

  /** Underline commands */
  UNDERLINE_ON: `${ESC}-\x01`,
  UNDERLINE_OFF: `${ESC}-\x00`,

  /** Cut commands */
  CUT_FULL: `${GS}V${String.fromCharCode(0)}`,
  CUT_PARTIAL: `${GS}V${String.fromCharCode(1)}`,

  /** Feed commands */
  FEED: (lines: number) => `${ESC}d${String.fromCharCode(lines)}`,

  /** Beep command */
  BEEP: `${ESC}B\x03\x02`,
};
