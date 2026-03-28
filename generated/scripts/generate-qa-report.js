const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, LevelFormat, TableOfContents
} = require('/Users/samisabir-idrissi/.nvm/versions/node/v20.19.4/lib/node_modules/docx');
const fs = require('fs');

const CONTENT_WIDTH = 9360; // US Letter with 1" margins

// ── Helpers ─────────────────────────────────────────────────────────────────

const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

function headerCell(text, fill = "1F4E79", width = 1560) {
  return new TableCell({
    borders: cellBorders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 20, font: "Arial" })]
    })]
  });
}

function dataCell(text, width = 1560, fill = "FFFFFF", bold = false, color = "333333", align = AlignmentType.LEFT) {
  return new TableCell({
    borders: cellBorders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, bold, color, size: 20, font: "Arial" })]
    })]
  });
}

function sectionHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 300, after: 120 },
    children: [new TextRun({ text, bold: true, font: "Arial", size: 28 })]
  });
}

function subHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 24 })]
  });
}

function labelValueParagraph(label, value) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: `${label}: `, bold: true, font: "Arial", size: 20 }),
      new TextRun({ text: value, font: "Arial", size: 20, color: "555555" })
    ]
  });
}

function spacer(size = 120) {
  return new Paragraph({ spacing: { after: size }, children: [] });
}

// ── Document ─────────────────────────────────────────────────────────────────

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 20, color: "333333" } }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "1F4E79" },
        paragraph: { spacing: { before: 300, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 1 }
      }
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
          children: [
            new TextRun({ text: "Daily QA Test Result Report  |  ", font: "Arial", size: 18, color: "888888" }),
            new TextRun({ text: "[Team / Project Name]", font: "Arial", size: 18, color: "888888", italics: true })
          ]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" } },
          children: [
            new TextRun({ text: "CONFIDENTIAL  |  Page ", font: "Arial", size: 16, color: "AAAAAA" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "AAAAAA" }),
            new TextRun({ text: " of ", font: "Arial", size: 16, color: "AAAAAA" }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 16, color: "AAAAAA" })
          ]
        })]
      })
    },
    children: [

      // ── Cover Banner ─────────────────────────────────────────────────────
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 480, after: 120 },
        children: [new TextRun({ text: "Daily QA Test Result Report", bold: true, font: "Arial", size: 56, color: "1F4E79" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: "[Project / Release Name]", font: "Arial", size: 28, color: "2E75B6", italics: true })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
        children: [new TextRun({ text: "Date: [YYYY-MM-DD]", font: "Arial", size: 22, color: "888888" })]
      }),

      // ── Report Metadata ───────────────────────────────────────────────────
      sectionHeading("1. Report Information"),
      new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [2800, 6560],
        rows: [
          new TableRow({ children: [headerCell("Field", "1F4E79", 2800), headerCell("Details", "1F4E79", 6560)] }),
          new TableRow({ children: [dataCell("Report Date", 2800, "EBF3FB", true), dataCell("[YYYY-MM-DD]", 6560)] }),
          new TableRow({ children: [dataCell("Sprint / Release", 2800, "EBF3FB", true), dataCell("[Sprint X / v1.0.0]", 6560)] }),
          new TableRow({ children: [dataCell("QA Engineer(s)", 2800, "EBF3FB", true), dataCell("[Name(s)]", 6560)] }),
          new TableRow({ children: [dataCell("Test Environment", 2800, "EBF3FB", true), dataCell("[Staging / QA / Production]", 6560)] }),
          new TableRow({ children: [dataCell("Build / Version", 2800, "EBF3FB", true), dataCell("[Build #  or  Git SHA]", 6560)] }),
          new TableRow({ children: [dataCell("Test Cycle", 2800, "EBF3FB", true), dataCell("[Regression / Smoke / Full]", 6560)] }),
        ]
      }),
      spacer(),

      // ── Test Summary ──────────────────────────────────────────────────────
      sectionHeading("2. Test Execution Summary"),
      new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [1560, 1560, 1560, 1560, 1560, 1560],
        rows: [
          new TableRow({
            children: [
              headerCell("Total", "1F4E79", 1560),
              headerCell("Passed", "1A7A4A", 1560),
              headerCell("Failed", "C00000", 1560),
              headerCell("Blocked", "BF5F00", 1560),
              headerCell("Skipped", "555555", 1560),
              headerCell("Pass Rate", "1F4E79", 1560),
            ]
          }),
          new TableRow({
            children: [
              dataCell("0", 1560, "FFFFFF", true, "333333", AlignmentType.CENTER),
              dataCell("0", 1560, "E8F5E9", true, "1A7A4A", AlignmentType.CENTER),
              dataCell("0", 1560, "FDECEA", true, "C00000", AlignmentType.CENTER),
              dataCell("0", 1560, "FFF3E0", true, "BF5F00", AlignmentType.CENTER),
              dataCell("0", 1560, "F5F5F5", true, "555555", AlignmentType.CENTER),
              dataCell("0%", 1560, "EBF3FB", true, "1F4E79", AlignmentType.CENTER),
            ]
          })
        ]
      }),
      spacer(),

      // ── Detailed Results ──────────────────────────────────────────────────
      sectionHeading("3. Detailed Test Results"),
      new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [780, 2200, 3200, 1040, 1040, 1100],
        rows: [
          new TableRow({
            children: [
              headerCell("TC #", "1F4E79", 780),
              headerCell("Test Suite", "1F4E79", 2200),
              headerCell("Test Case / Scenario", "1F4E79", 3200),
              headerCell("Status", "1F4E79", 1040),
              headerCell("Priority", "1F4E79", 1040),
              headerCell("Notes", "1F4E79", 1100),
            ]
          }),
          ...[1, 2, 3, 4, 5].map(i =>
            new TableRow({
              children: [
                dataCell(`TC-00${i}`, 780, i % 2 === 0 ? "F7FBFF" : "FFFFFF"),
                dataCell("[Suite Name]", 2200, i % 2 === 0 ? "F7FBFF" : "FFFFFF"),
                dataCell("[Test case description]", 3200, i % 2 === 0 ? "F7FBFF" : "FFFFFF"),
                dataCell("[Pass/Fail]", 1040, i % 2 === 0 ? "F7FBFF" : "FFFFFF"),
                dataCell("[High/Med/Low]", 1040, i % 2 === 0 ? "F7FBFF" : "FFFFFF"),
                dataCell("[Optional note]", 1100, i % 2 === 0 ? "F7FBFF" : "FFFFFF"),
              ]
            })
          )
        ]
      }),
      spacer(),

      // ── Defects / Issues ──────────────────────────────────────────────────
      sectionHeading("4. Defects / Issues Found"),
      new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [900, 3000, 1260, 1200, 1500, 1500],
        rows: [
          new TableRow({
            children: [
              headerCell("Bug ID", "C00000", 900),
              headerCell("Summary", "C00000", 3000),
              headerCell("Severity", "C00000", 1260),
              headerCell("Priority", "C00000", 1200),
              headerCell("Status", "C00000", 1500),
              headerCell("Assigned To", "C00000", 1500),
            ]
          }),
          ...[1, 2].map(i =>
            new TableRow({
              children: [
                dataCell(`BUG-00${i}`, 900, i % 2 === 0 ? "FFF5F5" : "FFFFFF"),
                dataCell("[Short description of defect]", 3000, i % 2 === 0 ? "FFF5F5" : "FFFFFF"),
                dataCell("[Critical/Major/Minor]", 1260, i % 2 === 0 ? "FFF5F5" : "FFFFFF"),
                dataCell("[High/Med/Low]", 1200, i % 2 === 0 ? "FFF5F5" : "FFFFFF"),
                dataCell("[New/Open/Resolved]", 1500, i % 2 === 0 ? "FFF5F5" : "FFFFFF"),
                dataCell("[Developer Name]", 1500, i % 2 === 0 ? "FFF5F5" : "FFFFFF"),
              ]
            })
          )
        ]
      }),
      spacer(),

      // ── Environment Info ──────────────────────────────────────────────────
      sectionHeading("5. Environment & Configuration"),
      new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [2800, 6560],
        rows: [
          new TableRow({ children: [headerCell("Component", "2E75B6", 2800), headerCell("Details", "2E75B6", 6560)] }),
          new TableRow({ children: [dataCell("OS / Platform", 2800, "EBF3FB", true), dataCell("[e.g. macOS 14, Windows 11, Ubuntu 22.04]", 6560)] }),
          new TableRow({ children: [dataCell("Browser(s)", 2800, "EBF3FB", true), dataCell("[e.g. Chrome 124, Firefox 125, Safari 17]", 6560)] }),
          new TableRow({ children: [dataCell("API Version", 2800, "EBF3FB", true), dataCell("[e.g. v2.4.1]", 6560)] }),
          new TableRow({ children: [dataCell("Database", 2800, "EBF3FB", true), dataCell("[e.g. PostgreSQL 16.2]", 6560)] }),
          new TableRow({ children: [dataCell("Test Framework", 2800, "EBF3FB", true), dataCell("[e.g. Playwright, Cypress, JUnit]", 6560)] }),
          new TableRow({ children: [dataCell("CI/CD Pipeline", 2800, "EBF3FB", true), dataCell("[e.g. GitHub Actions run #1234]", 6560)] }),
        ]
      }),
      spacer(),

      // ── Observations ─────────────────────────────────────────────────────
      sectionHeading("6. Observations & Risks"),
      subHeading("Key Observations"),
      ...[
        "[ Add observation 1 ]",
        "[ Add observation 2 ]",
        "[ Add observation 3 ]"
      ].map(text => new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 80 },
        children: [new TextRun({ text, font: "Arial", size: 20, color: "555555" })]
      })),
      spacer(80),
      subHeading("Risks / Blockers"),
      ...[
        "[ Add risk or blocker 1 ]",
        "[ Add risk or blocker 2 ]"
      ].map(text => new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 80 },
        children: [new TextRun({ text, font: "Arial", size: 20, color: "555555" })]
      })),
      spacer(),

      // ── Recommendations ───────────────────────────────────────────────────
      sectionHeading("7. Recommendations & Next Steps"),
      ...[
        "[ Action item 1 — Owner — Due date ]",
        "[ Action item 2 — Owner — Due date ]",
        "[ Action item 3 — Owner — Due date ]"
      ].map(text => new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { after: 80 },
        children: [new TextRun({ text, font: "Arial", size: 20 })]
      })),
      spacer(),

      // ── Sign-off ──────────────────────────────────────────────────────────
      sectionHeading("8. Sign-off"),
      new Table({
        width: { size: CONTENT_WIDTH, type: WidthType.DXA },
        columnWidths: [2340, 2340, 2340, 2340],
        rows: [
          new TableRow({
            children: [
              headerCell("Role", "1F4E79", 2340),
              headerCell("Name", "1F4E79", 2340),
              headerCell("Signature", "1F4E79", 2340),
              headerCell("Date", "1F4E79", 2340),
            ]
          }),
          new TableRow({
            children: [
              dataCell("QA Lead", 2340, "EBF3FB", true),
              dataCell("", 2340),
              dataCell("", 2340),
              dataCell("", 2340),
            ]
          }),
          new TableRow({
            children: [
              dataCell("Dev Lead", 2340, "EBF3FB", true),
              dataCell("", 2340),
              dataCell("", 2340),
              dataCell("", 2340),
            ]
          }),
          new TableRow({
            children: [
              dataCell("Product Owner", 2340, "EBF3FB", true),
              dataCell("", 2340),
              dataCell("", 2340),
              dataCell("", 2340),
            ]
          }),
        ]
      }),
      spacer(),

      // ── Additional Notes ──────────────────────────────────────────────────
      sectionHeading("9. Additional Notes"),
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: "[ Use this section for any additional context, attachments, or references. ]", font: "Arial", size: 20, color: "888888", italics: true })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("daily-qa-report-template.docx", buffer);
  console.log("Created: daily-qa-report-template.docx");
});
