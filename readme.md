# 🧾 ESC/POS Ticket Builder

[![npm version](https://img.shields.io/npm/v/escpos-ticket-builder.svg)](https://www.npmjs.com/package/escpos-ticket-builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A flexible and type-safe ESC/POS thermal printer receipt builder for Node.js and TypeScript. Build beautiful receipts with support for multiple printer profiles, quirks handling, and a fluent API.

## ✨ Features

- 🎯 **Type-Safe**: Full TypeScript support with comprehensive type definitions
- 🔧 **Flexible**: Works with multiple printer brands (Elgin, Bematech, Daruma, Epson, etc.)
- 🎨 **Rich Formatting**: Headers, tables, QR codes, text alignment, and more
- 🔌 **Profile-Based**: Pre-configured profiles for popular printers + custom profile support
- 🐛 **Quirks Handling**: Built-in workarounds for printer-specific issues
- 📦 **Zero Dependencies**: Lightweight and production-ready

## 📦 Installation

```bash
npm install escpos-ticket-builder
```

```bash
yarn add escpos-ticket-builder
```

```bash
pnpm add escpos-ticket-builder
```

## 🚀 Quick Start

```typescript
import { receipt } from "escpos-ticket-builder";

const ticket = receipt()
  .center()
  .h1("MY STORE")
  .text("123 Main St, City")
  .br()
  .hr()
  .left()
  .productLine(2, "Coffee", 5.5)
  .productLine(1, "Croissant", 3.0)
  .hr()
  .money("TOTAL", 14.0)
  .br(2)
  .center()
  .text("Thank you!")
  .cut()
  .build();

// Send to printer
console.log(ticket); // ESC/POS command string
```

## 📚 Documentation

### Basic Usage

#### Creating a Receipt

```typescript
import { receipt } from "escpos-ticket-builder";

const ticket = receipt().text("Hello, World!").build();
```

#### Text Alignment

```typescript
receipt()
  .left()
  .text("Left aligned")
  .center()
  .text("Center aligned")
  .right()
  .text("Right aligned")
  .build();
```

#### Headers

```typescript
receipt()
  .h1("Large Header") // Extra large text
  .h2("Medium Header") // Large text
  .h3("Small Header") // Double width text
  .build();
```

#### Text Formatting

```typescript
receipt()
  .strong()
  .text("Bold text")
  .endStrong()
  .underline("Underlined text")
  .build();
```

### Advanced Features

#### Product Lines

```typescript
receipt()
  .productLine(2, "Coffee", 5.5)
  // Output: 2x Coffee....................R$ 5,50

  .productLine(1, "Croissant")
  // Output: 1x Croissant
  .build();
```

#### Key-Value Rows

```typescript
// Single row
receipt().row("Order", "#12345").row("Date", "2024-01-27").build();

// Multiple rows
receipt()
  .rows([
    { label: "Customer", value: "John Doe" },
    { label: "Phone", value: "(11) 98765-4321" },
    { label: "Address", value: "123 Main St" },
  ])
  .build();
```

#### Money Formatting

```typescript
receipt()
  .money("Subtotal", 10.0)
  .money("Tax", 1.5)
  .money("TOTAL", 11.5)
  .build();

// Output:
// Subtotal: R$ 10,00
// Tax: R$ 1,50
// TOTAL: R$ 11,50
```

#### Tables

```typescript
receipt()
  .table(
    [
      { title: "Item", flex: 2 },
      { title: "Qty", width: 5, align: "right" },
      { title: "Price", width: 10, align: "right" },
    ],
    [
      ["Coffee", "2", "R$ 5.50"],
      ["Croissant", "1", "R$ 3.00"],
      ["Orange Juice", "1", "R$ 4.00"],
    ],
  )
  .build();
```

#### Horizontal Rules

```typescript
receipt()
  .hr() // Dashed line (default)
  .hr(40, "solid") // Solid line with custom width
  .hr(40, "double") // Double line
  .build();
```

#### Line Breaks and Spacing

```typescript
receipt()
  .text("Line 1")
  .br() // Single line break
  .text("Line 2")
  .br(3) // Three line breaks
  .text("Line 3")
  .build();
```

#### Paper Cutting

```typescript
receipt()
  .text("Receipt content")
  .cut() // Full cut with default feed
  .build();

receipt()
  .text("Receipt content")
  .cut(false) // Partial cut
  .build();

receipt()
  .text("Receipt content")
  .cut(true, 5) // Full cut with 5 feed lines
  .build();
```

#### Beep

```typescript
receipt()
  .text("Order ready!")
  .beep() // Trigger printer beep/buzzer
  .build();
```

### Printer Profiles

#### Using Pre-configured Profiles

```typescript
import { receipt, profiles } from "escpos-ticket-builder";

// Generic ESC/POS (default)
const ticket1 = receipt(profiles.generic).text("Using generic profile").build();

// Elgin i9
const ticket2 = receipt(profiles.elginI9)
  .text("Using Elgin i9 profile")
  .build();

// Bematech MP-4200 TH
const ticket3 = receipt(profiles.bematechMP4200)
  .text("Using Bematech profile")
  .build();

// Daruma DR800
const ticket4 = receipt(profiles.darumaDR800)
  .text("Using Daruma profile")
  .build();

// 58mm printer
const ticket5 = receipt(profiles.printer58mm)
  .text("Using 58mm printer profile")
  .build();
```

#### Creating Custom Profiles

```typescript
import { receipt, PrinterProfile } from "escpos-ticket-builder";

const customProfile: PrinterProfile = {
  name: "My Custom Printer",
  cols: 48,
  capabilities: {
    align: true,
    bold: true,
    underline: true,
    doubleWidth: true,
    doubleHeight: true,
    cut: true,
    partialCut: false,
    qrCode: false,
    beep: true,
  },
  quirks: {
    needsExtraFeedBeforeCut: 5,
    brokenBoldCommand: false,
    elginNeedsCRLF: false,
  },
};

const ticket = receipt(customProfile).text("Using custom profile").build();
```

### Profile Configuration

#### Capabilities

| Capability     | Description                                      |
| -------------- | ------------------------------------------------ |
| `align`        | Support for text alignment (left, center, right) |
| `bold`         | Support for bold text                            |
| `underline`    | Support for underlined text                      |
| `doubleWidth`  | Support for double width text                    |
| `doubleHeight` | Support for double height text                   |
| `cut`          | Support for paper cutting                        |
| `partialCut`   | Support for partial paper cutting                |
| `qrCode`       | Support for QR code printing                     |
| `beep`         | Support for beep/buzzer                          |

#### Quirks

| Quirk                       | Description                            |
| --------------------------- | -------------------------------------- |
| `maxLineLength`             | Override maximum characters per line   |
| `elginNeedsCRLF`            | Use CRLF (`\r\n`) instead of LF (`\n`) |
| `brokenBoldCommand`         | Disable bold if command is broken      |
| `needsInitBeforeEveryPrint` | Call initialize() automatically        |
| `needsExtraFeedBeforeCut`   | Extra feed lines before cutting        |
| `alternativeCutCommand`     | Custom cut command string              |

## 🎯 Real-World Examples

### Restaurant Receipt

```typescript
import { receipt } from "escpos-ticket-builder";

const restaurantReceipt = receipt()
  .initialize()
  .center()
  .h1("RESTAURANT XYZ")
  .text("Rua Example, 123")
  .text("Tel: (11) 1234-5678")
  .text("CNPJ: 12.345.678/0001-90")
  .br()
  .hr()
  .left()
  .row("Mesa", "15")
  .row("Garcom", "João")
  .row("Data", "27/01/2024 14:30")
  .hr()
  .productLine(2, "X-Burger", 25.0)
  .productLine(1, "Batata Frita", 12.0)
  .productLine(2, "Refrigerante", 8.0)
  .productLine(1, "Sobremesa", 15.0)
  .hr()
  .money("Subtotal", 93.0)
  .money("Taxa Servico (10%)", 9.3)
  .strong()
  .money("TOTAL", 102.3)
  .endStrong()
  .hr()
  .center()
  .text("Obrigado pela preferencia!")
  .text("Volte sempre!")
  .br(2)
  .beep()
  .cut()
  .build();
```

### Retail Receipt

```typescript
import { receipt } from "escpos-ticket-builder";

const retailReceipt = receipt()
  .center()
  .h2("LOJA ABC")
  .text("Shopping Center - Loja 123")
  .br()
  .hr()
  .left()
  .table(
    [
      { title: "Item", flex: 2 },
      { title: "Qtd", width: 5, align: "center" },
      { title: "Valor", width: 12, align: "right" },
    ],
    [
      ["Camiseta Azul", "2", "R$ 59,90"],
      ["Calça Jeans", "1", "R$ 129,90"],
      ["Meia (Kit 3)", "1", "R$ 19,90"],
    ],
  )
  .hr()
  .right()
  .money("Subtotal", 269.6)
  .money("Desconto", -26.96)
  .strong()
  .money("TOTAL", 242.64)
  .endStrong()
  .br()
  .left()
  .rows([
    { label: "Forma Pagamento", value: "Cartao Credito" },
    { label: "Parcelas", value: "3x R$ 80,88" },
    { label: "CPF", value: "123.456.789-00" },
  ])
  .br()
  .center()
  .text("Troca em ate 30 dias")
  .text("www.lojaabc.com.br")
  .cut()
  .build();
```

### Delivery Order

```typescript
import { receipt } from "escpos-ticket-builder";

const deliveryOrder = receipt()
  .center()
  .h1("PEDIDO #1234")
  .br()
  .left()
  .strong()
  .text("CLIENTE:")
  .endStrong()
  .text("Maria Silva")
  .text("(11) 98765-4321")
  .br()
  .strong()
  .text("ENDERECO:")
  .endStrong()
  .text("Rua das Flores, 456")
  .text("Apto 302 - Jardim Paulista")
  .text("São Paulo - SP - 01234-567")
  .br()
  .hr()
  .strong()
  .text("PEDIDO:")
  .endStrong()
  .productLine(1, "Pizza Margherita G", 45.0)
  .productLine(2, "Refrigerante 2L", 12.0)
  .productLine(1, "Borda Catupiry", 8.0)
  .hr()
  .money("Subtotal", 77.0)
  .money("Taxa Entrega", 5.0)
  .strong()
  .money("TOTAL", 82.0)
  .endStrong()
  .br()
  .row("Pagamento", "Dinheiro")
  .row("Troco para", "R$ 100,00")
  .br()
  .center()
  .text("Tempo estimado: 40-50 min")
  .cut()
  .build();
```

## 🔌 Integration Examples

### Sending to USB Printer (Node.js)

```typescript
import { receipt } from "escpos-ticket-builder";
import { SerialPort } from "serialport";

const ticket = receipt().text("Hello from USB printer!").cut().build();

const port = new SerialPort({ path: "/dev/usb/lp0", baudRate: 9600 });
port.write(ticket, (err) => {
  if (err) {
    console.error("Error:", err);
  } else {
    console.log("Printed successfully!");
  }
});
```

### Sending to Network Printer

```typescript
import { receipt } from "escpos-ticket-builder";
import * as net from "net";

const ticket = receipt().text("Hello from network printer!").cut().build();

const client = new net.Socket();
client.connect(9100, "192.168.1.100", () => {
  client.write(ticket);
  client.end();
});
```

### Converting to Base64

```typescript
import { receipt } from "escpos-ticket-builder";

const ticket = receipt().text("Hello, World!").build();

const base64 = Buffer.from(ticket, "utf-8").toString("base64");
console.log(base64);
```

## 🛠️ Utility Functions

The library also exports utility functions for advanced use cases:

```typescript
import { helpers } from "escpos-ticket-builder";

// Remove accents from text
const clean = helpers.removeAccents("São Paulo"); // 'Sao Paulo'

// Wrap text to fit width
const wrapped = helpers.wrapText("This is a long text that needs wrapping", 20);

// Create formatted row
const row = helpers.createRow("Label", "Value", 48);

// Create product line
const product = helpers.createProductLine(2, "Coffee", 5.5, 48);
```

## 🧪 Testing

```typescript
import { receipt, profiles } from "escpos-ticket-builder";

// Test with different profiles
const testProfiles = [
  profiles.generic,
  profiles.elginI9,
  profiles.bematechMP4200,
];

testProfiles.forEach((profile) => {
  const ticket = receipt(profile)
    .center()
    .h1("TEST RECEIPT")
    .text(profile.name)
    .cut()
    .build();

  console.log(`Testing with ${profile.name}:`);
  console.log(ticket);
});
```

## 📄 License

MIT © [Your Name]

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Issues

If you find a bug or have a feature request, please open an issue on [GitHub](https://github.com/yourusername/escpos-ticket-builder/issues).

## 📮 Support

- 📧 Email: your.email@example.com
- 🐦 Twitter: [@yourusername](https://twitter.com/yourusername)
- 💬 Discord: [Join our community](#)

## 🙏 Acknowledgments

Built with ❤️ for the thermal printer community.

---

**Made with 🧾 by [Your Name](https://yourwebsite.com)**
