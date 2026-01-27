import { PrinterProfile } from "../types";

/**
 * Generic ESC/POS profile with full capabilities
 * Works with most modern thermal printers (Epson, Star, etc.)
 */
export const genericProfile: PrinterProfile = {
  name: "Generic ESC/POS",
  cols: 48,
  capabilities: {
    align: true,
    bold: true,
    underline: true,
    doubleWidth: true,
    doubleHeight: true,
    cut: true,
    partialCut: true,
    qrCode: true,
    beep: true,
  },
  quirks: {
    needsExtraFeedBeforeCut: 3,
  },
};

/**
 * Elgin i9 profile with known quirks
 */
export const elginI9Profile: PrinterProfile = {
  name: "Elgin i9",
  cols: 48,
  capabilities: {
    align: true,
    bold: false, // Bold is broken on Elgin i9
    underline: true,
    doubleWidth: true,
    doubleHeight: true,
    cut: true,
    partialCut: false,
    qrCode: true,
    beep: true,
  },
  quirks: {
    elginNeedsCRLF: true,
    brokenBoldCommand: true,
    needsInitBeforeEveryPrint: true,
    needsExtraFeedBeforeCut: 5,
  },
};

/**
 * Bematech MP-4200 TH profile
 */
export const bematechMP4200Profile: PrinterProfile = {
  name: "Bematech MP-4200 TH",
  cols: 48,
  capabilities: {
    align: true,
    bold: true,
    underline: true,
    doubleWidth: true,
    doubleHeight: true,
    cut: true,
    partialCut: true,
    qrCode: false,
    beep: true,
  },
  quirks: {
    needsExtraFeedBeforeCut: 4,
  },
};

/**
 * Daruma DR800 profile
 */
export const darumaDR800Profile: PrinterProfile = {
  name: "Daruma DR800",
  cols: 48,
  capabilities: {
    align: true,
    bold: true,
    underline: true,
    doubleWidth: true,
    doubleHeight: true,
    cut: true,
    partialCut: true,
    qrCode: true,
    beep: true,
  },
  quirks: {
    needsExtraFeedBeforeCut: 3,
  },
};

/**
 * 58mm printer profile (smaller paper width)
 */
export const printer58mmProfile: PrinterProfile = {
  name: "Generic 58mm",
  cols: 32,
  capabilities: {
    align: true,
    bold: true,
    underline: true,
    doubleWidth: true,
    doubleHeight: true,
    cut: true,
    partialCut: true,
    qrCode: true,
    beep: true,
  },
  quirks: {
    needsExtraFeedBeforeCut: 3,
  },
};

/**
 * Get the default printer profile
 * @returns Generic ESC/POS profile
 */
export function getDefaultProfile(): PrinterProfile {
  return genericProfile;
}

/**
 * Available printer profiles
 */
export const profiles = {
  generic: genericProfile,
  elginI9: elginI9Profile,
  bematechMP4200: bematechMP4200Profile,
  darumaDR800: darumaDR800Profile,
  printer58mm: printer58mmProfile,
};
