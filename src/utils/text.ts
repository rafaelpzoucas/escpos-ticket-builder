/**
 * Remove accents and special characters from text
 * @param text - Text to process
 * @returns Text without accents
 */
export function removeAccents(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[ªº°]/g, "");
}

/**
 * Wrap text to fit within a maximum width
 * @param text - Text to wrap
 * @param maxWidth - Maximum characters per line
 * @returns Wrapped text with line breaks
 */
export function wrapText(text: string, maxWidth: number): string {
  const words = text.split(" ");
  let result = "";
  let currentLine = "";

  words.forEach((word) => {
    if (currentLine.length === 0) {
      currentLine = word;
    } else if (currentLine.length + word.length + 1 <= maxWidth) {
      currentLine += " " + word;
    } else {
      result += currentLine + "\n";
      currentLine = word;
    }
  });

  if (currentLine.length > 0) {
    result += currentLine;
  }

  return result;
}

/**
 * Create a row with label and value
 * @param label - Row label
 * @param value - Row value
 * @param width - Total row width
 * @returns Formatted row string
 */
export function createRow(label: string, value: string, width: number): string {
  const cleanLabel = removeAccents(String(label).trim());
  const cleanValue = removeAccents(String(value).trim());
  const combined = `${cleanLabel}: ${cleanValue}`;

  if (combined.length <= width) {
    const padding = width - combined.length;
    return cleanLabel + ": " + cleanValue + " ".repeat(padding);
  }

  return `${cleanLabel}:\n${cleanValue}`;
}

/**
 * Create a product line with quantity, name, and optional price
 * @param quantity - Product quantity
 * @param name - Product name
 * @param price - Optional price (number or string)
 * @param width - Line width
 * @returns Formatted product line
 */
export function createProductLine(
  quantity: number | string,
  name: string,
  price?: number | string,
  width: number = 48,
): string {
  const cleanName = removeAccents(String(name).trim());
  const qtyText = `${quantity}x`;

  if (price === undefined || price === null || price === "") {
    const text = `${qtyText} ${cleanName}`;
    return text + " ".repeat(Math.max(0, width - text.length));
  }

  const priceText =
    typeof price === "number"
      ? `R$ ${price.toFixed(2).replace(".", ",")}`
      : `R$ ${price}`;

  const leftPart = `${qtyText} ${cleanName}`;
  const rightPart = priceText;
  const dotsNeeded = width - leftPart.length - rightPart.length;

  if (dotsNeeded <= 1) {
    return `${leftPart}\n${" ".repeat(width - rightPart.length)}${rightPart}`;
  }

  const dots = ".".repeat(dotsNeeded);
  return `${leftPart}${dots}${rightPart}`;
}
