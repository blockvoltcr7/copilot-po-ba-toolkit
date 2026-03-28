---
name: docx-generator
description: >
  Generate professional Word (.docx) documents programmatically using Node.js
  and the docx npm package. Use this skill when asked to create Word documents,
  reports, memos, letters, proposals, or any .docx file. Also use when asked
  to generate formatted documents with headings, tables, bullet lists, headers,
  footers, page numbers, or table of contents.
license: MIT
---

# Word Document Generation Skill

Generate .docx files using the `docx` npm package (docx-js) in Node.js.

## Workflow

1. Run `npm init -y && npm install docx` in the working directory (if no `package.json` exists, init first — otherwise `npm install` may install in a parent directory)
2. Write a complete Node.js script using the patterns below
3. Execute it with `node <script>.js`
4. Verify the output file exists and log its size for confirmation

## Setup Pattern

```javascript
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
        BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
        ExternalHyperlink, FootnoteReferenceRun, TabStopType,
        TabStopPosition, ImageRun, PageOrientation,
        TableOfContents, Bookmark, InternalHyperlink } = require('docx');

const doc = new Document({
  // Document metadata — shows in file properties
  title: "Document Title",
  description: "Brief description of the document",
  creator: "Author Name",
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } }, // 12pt
    paragraphStyles: [
      // IMPORTANT: Always define Normal explicitly to prevent style inheritance issues
      { id: "Normal", name: "Normal",
        run: { font: "Arial", size: 24 },
        paragraph: { spacing: { after: 120 } } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 180, after: 180 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal",
        quickFormat: true,
        run: { size: 26, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 120, after: 120 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 }, // US Letter in DXA
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } // 1 inch
      }
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        children: [new TextRun({ text: "Document Title", bold: true, size: 20 })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun("Page "), new TextRun({ children: [PageNumber.CURRENT] })]
      })] })
    },
    children: [
      // IMPORTANT: Always set style: "Normal" on body paragraphs
      new Paragraph({
        style: "Normal",
        children: [new TextRun({ text: "Body text here", font: "Arial", size: 24 })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("output.docx", buffer);
  console.log("Document created successfully");
});
```

## Critical Rules

These rules MUST be followed — violating them produces broken documents:

- **Never use `\n` for line breaks** — use separate Paragraph elements
- **Never use unicode bullets** (`•`, `\u2022`) — use `LevelFormat.BULLET` with numbering config
- **Set page size explicitly** — docx-js defaults to A4, not US Letter
- **Tables need DUAL widths** — set `columnWidths` on table AND `width` on each cell
- **Always use `WidthType.DXA`** — never `WidthType.PERCENTAGE` (breaks in Google Docs)
- **Table width = sum of columnWidths** — for US Letter with 1" margins: 9360 DXA
- **Use `ShadingType.CLEAR`** — never `SOLID` for table cell shading
- **Override built-in styles** — use exact IDs: `"Heading1"`, `"Heading2"`, etc.
- **Include `outlineLevel`** in heading styles — 0 for H1, 1 for H2, etc. (required for TOC)
- **PageBreak must be inside a Paragraph** — standalone creates invalid XML
- **ImageRun requires `type`** — always specify png/jpg/etc.
- **Body paragraphs MUST set `style: "Normal"`** — without it, paragraphs after headings inherit heading styles (bold, large font). Always set `style: "Normal"` on non-heading paragraphs and explicitly set `font` and `size` on their TextRuns.
- **Always define `"Normal"` in `paragraphStyles`** — don't rely on implicit defaults. Define it explicitly with `font`, `size`, and `spacing` to ensure consistent body text across all renderers (Word, Pages, Google Docs).
- **Always set document metadata** — include `title`, `description`, and `creator` in the Document constructor. Without these, file properties show "Unknown".
- **Use separate numbering references to restart numbering** — all paragraphs sharing the same `reference` continue one sequence. To restart at 1 in a new section, define a new reference (e.g., `"numbers-section2"`).
- **Never use tables as dividers** — cells have minimum height; use paragraph borders instead

## DXA Unit Reference

1440 DXA = 1 inch. Key values:

| Measurement | DXA |
|---|---|
| US Letter width | 12,240 |
| US Letter height | 15,840 |
| 1 inch margin | 1,440 |
| Content width (1" margins) | 9,360 |
| Half content width | 4,680 |

## Bullet and Numbered Lists

```javascript
// CORRECT — always use numbering config
const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "\u2022",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "\u25E6",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
        ] },
      { reference: "numbers",
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "%1.",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        ] },
    ]
  },
  sections: [{
    children: [
      new Paragraph({
        style: "Normal",
        numbering: { reference: "bullets", level: 0 },
        children: [new TextRun({ text: "Bullet item", font: "Arial", size: 24 })]
      }),
      new Paragraph({
        style: "Normal",
        numbering: { reference: "numbers", level: 0 },
        children: [new TextRun({ text: "Numbered item", font: "Arial", size: 24 })]
      }),
    ]
  }]
});
```

**Important:** Same reference = continues numbering. Different reference = restarts.
To restart numbering (e.g., a new numbered list in a different section), define a separate
reference in the numbering config (e.g., `"numbers-section2"`).

## Tables

```javascript
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [3120, 3120, 3120], // Must sum to 9360
  rows: [
    // Header row with shading
    new TableRow({
      children: [
        new TableCell({
          borders,
          width: { size: 3120, type: WidthType.DXA },
          shading: { fill: "2E75B6", type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({
            children: [new TextRun({ text: "Header", bold: true, color: "FFFFFF" })]
          })]
        }),
        // ... more cells
      ]
    }),
    // Data rows
    new TableRow({
      children: [
        new TableCell({
          borders,
          width: { size: 3120, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({ children: [new TextRun("Data")] })]
        }),
        // ... more cells
      ]
    }),
  ]
})
```

## Headers and Footers

```javascript
headers: {
  default: new Header({
    children: [new Paragraph({
      children: [new TextRun({ text: "Report Title", bold: true })]
    })]
  })
},
footers: {
  default: new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun("Page "),
        new TextRun({ children: [PageNumber.CURRENT] }),
        new TextRun(" of "),
        new TextRun({ children: [PageNumber.TOTAL_PAGES] }),
      ]
    })]
  })
}
```

## Page Breaks

```javascript
// Must be inside a Paragraph
new Paragraph({ children: [new PageBreak()] })

// Or use pageBreakBefore
new Paragraph({ pageBreakBefore: true, children: [new TextRun("New page")] })
```

## Hyperlinks

```javascript
new Paragraph({
  children: [new ExternalHyperlink({
    children: [new TextRun({ text: "Click here", style: "Hyperlink" })],
    link: "https://example.com",
  })]
})
```

## Table of Contents

```javascript
// Headings MUST use HeadingLevel only — no custom styles on heading paragraphs
new TableOfContents("Table of Contents", {
  hyperlink: true,
  headingStyleRange: "1-3"
})
```

## Images

```javascript
new Paragraph({
  children: [new ImageRun({
    type: "png", // REQUIRED: png, jpg, jpeg, gif, bmp, svg
    data: fs.readFileSync("image.png"),
    transformation: { width: 200, height: 150 },
    altText: { title: "Title", description: "Desc", name: "Name" }
  })]
})
```

## Tab Stops (for aligned text on same line)

```javascript
new Paragraph({
  children: [
    new TextRun("Left text"),
    new TextRun("\tRight text"),
  ],
  tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
})
```

## Landscape Orientation

```javascript
// Pass portrait dimensions — docx-js swaps internally
size: {
  width: 12240,   // SHORT edge as width
  height: 15840,  // LONG edge as height
  orientation: PageOrientation.LANDSCAPE
}
// Content width = 15840 - left margin - right margin
```

## Complete Example: Professional Report

See `report-template.js` in this skill directory for a full
working example that generates a multi-section report with headings,
bullet lists, tables, headers, footers, and page numbers.
