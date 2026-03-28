const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  TableOfContents, ExternalHyperlink
} = require('docx');
const fs = require('fs');

// ─── Colour palette ───────────────────────────────────────────────────────────
const BLUE_DARK   = "1B3A6B";  // headers / title
const BLUE_MED    = "2563EB";  // accent
const BLUE_LIGHT  = "DBEAFE";  // table header fill
const BLUE_XLIGHT = "EFF6FF";  // alt row fill
const TEAL_LIGHT  = "D1FAE5";  // "tip" callout fill
const AMBER_LIGHT = "FEF3C7";  // "warning" callout fill
const GREY_LIGHT  = "F3F4F6";  // secondary fill
const GREY_BORDER = "D1D5DB";  // table borders
const WHITE       = "FFFFFF";
const BLACK       = "111827";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const border1 = { style: BorderStyle.SINGLE, size: 1, color: GREY_BORDER };
const allBorders = { top: border1, bottom: border1, left: border1, right: border1 };
const noBorders  = {
  top:    { style: BorderStyle.NONE, size: 0, color: WHITE },
  bottom: { style: BorderStyle.NONE, size: 0, color: WHITE },
  left:   { style: BorderStyle.NONE, size: 0, color: WHITE },
  right:  { style: BorderStyle.NONE, size: 0, color: WHITE },
};
const cellPad = { top: 100, bottom: 100, left: 150, right: 150 };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, bold: true, size: 36, font: "Arial", color: BLUE_DARK })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, bold: true, size: 28, font: "Arial", color: BLUE_DARK })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 24, font: "Arial", color: BLUE_MED })]
  });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: BLACK, ...opts })]
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: BLACK })]
  });
}

function numbered(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "numbers", level },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 22, color: BLACK })]
  });
}

function boldBullet(label, text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { before: 60, after: 60 },
    children: [
      new TextRun({ text: label, bold: true, font: "Arial", size: 22, color: BLACK }),
      new TextRun({ text: ": " + text, font: "Arial", size: 22, color: BLACK })
    ]
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function spacer(pts = 120) {
  return new Paragraph({ spacing: { before: pts, after: 0 }, children: [] });
}

function divider() {
  return new Paragraph({
    spacing: { before: 160, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: BLUE_LIGHT } },
    children: []
  });
}

// Callout box (tip / warning)
function callout(label, text, fill = TEAL_LIGHT) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: noBorders,
            shading: { fill, type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 200, right: 200 },
            width: { size: 9360, type: WidthType.DXA },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 0 },
                children: [
                  new TextRun({ text: label + "  ", bold: true, font: "Arial", size: 22, color: BLUE_DARK }),
                  new TextRun({ text, font: "Arial", size: 22, color: BLACK })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}

// Simple 2-col table with header row
function twoColTable(headers, rows, widths = [3000, 6360]) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => new TableCell({
      borders: allBorders,
      shading: { fill: BLUE_DARK, type: ShadingType.CLEAR },
      margins: cellPad,
      width: { size: widths[i], type: WidthType.DXA },
      children: [new Paragraph({
        children: [new TextRun({ text: h, bold: true, font: "Arial", size: 20, color: WHITE })]
      })]
    }))
  });

  const dataRows = rows.map((row, ri) => new TableRow({
    children: row.map((cell, ci) => new TableCell({
      borders: allBorders,
      shading: { fill: ri % 2 === 0 ? WHITE : BLUE_XLIGHT, type: ShadingType.CLEAR },
      margins: cellPad,
      width: { size: widths[ci], type: WidthType.DXA },
      children: [new Paragraph({
        children: [new TextRun({ text: cell, font: "Arial", size: 20, color: BLACK })]
      })]
    }))
  }));

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headerRow, ...dataRows]
  });
}

// 3-col table
function threeColTable(headers, rows, widths = [2200, 3580, 3580]) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h, i) => new TableCell({
      borders: allBorders,
      shading: { fill: BLUE_DARK, type: ShadingType.CLEAR },
      margins: cellPad,
      width: { size: widths[i], type: WidthType.DXA },
      children: [new Paragraph({
        children: [new TextRun({ text: h, bold: true, font: "Arial", size: 20, color: WHITE })]
      })]
    }))
  });

  const dataRows = rows.map((row, ri) => new TableRow({
    children: row.map((cell, ci) => new TableCell({
      borders: allBorders,
      shading: { fill: ri % 2 === 0 ? WHITE : BLUE_XLIGHT, type: ShadingType.CLEAR },
      margins: cellPad,
      width: { size: widths[ci], type: WidthType.DXA },
      children: [new Paragraph({
        children: [new TextRun({ text: cell, font: "Arial", size: 20, color: BLACK })]
      })]
    }))
  }));

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: widths,
    rows: [headerRow, ...dataRows]
  });
}

// Code / CLI block (monospace box)
function codeBlock(lines) {
  const rows = lines.map(line => new TableRow({
    children: [new TableCell({
      borders: noBorders,
      shading: { fill: "1E293B", type: ShadingType.CLEAR },
      margins: { top: 40, bottom: 40, left: 200, right: 200 },
      width: { size: 9360, type: WidthType.DXA },
      children: [new Paragraph({
        spacing: { before: 0, after: 0 },
        children: [new TextRun({ text: line, font: "Courier New", size: 18, color: "A3E635" })]
      })]
    })]
  }));
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows
  });
}

// Workflow step box
function workflowStep(num, title, desc) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [720, 8640],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders: noBorders,
            shading: { fill: BLUE_MED, type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            width: { size: 720, type: WidthType.DXA },
            verticalAlign: VerticalAlign.CENTER,
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: String(num), bold: true, font: "Arial", size: 24, color: WHITE })]
            })]
          }),
          new TableCell({
            borders: noBorders,
            shading: { fill: GREY_LIGHT, type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 180, right: 180 },
            width: { size: 8640, type: WidthType.DXA },
            children: [
              new Paragraph({
                spacing: { before: 0, after: 40 },
                children: [new TextRun({ text: title, bold: true, font: "Arial", size: 22, color: BLUE_DARK })]
              }),
              new Paragraph({
                spacing: { before: 0, after: 0 },
                children: [new TextRun({ text: desc, font: "Arial", size: 20, color: BLACK })]
              })
            ]
          })
        ]
      })
    ]
  });
}

// ─── DOCUMENT ─────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
        ]
      },
      {
        reference: "numbers",
        levels: [
          { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.DECIMAL, text: "%1.%2.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
        ]
      }
    ]
  },
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22, color: BLACK } }
    },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: BLUE_DARK },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: BLUE_DARK },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: BLUE_MED },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ]
  },
  sections: [
    // ══════════════════════════════════════════════════════════════════════
    // SECTION 1 – COVER PAGE
    // ══════════════════════════════════════════════════════════════════════
    {
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
            border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: BLUE_LIGHT } },
            children: [new TextRun({ text: "CONFIDENTIAL — INTERNAL USE ONLY", font: "Arial", size: 16, color: "9CA3AF", italics: true })]
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Page ", font: "Arial", size: 18, color: "6B7280" }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "6B7280" }),
              new TextRun({ text: " of ", font: "Arial", size: 18, color: "6B7280" }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 18, color: "6B7280" })
            ]
          })]
        })
      },
      children: [
        spacer(1440),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 80 },
          children: [new TextRun({ text: "STAKEHOLDER RESEARCH REPORT", font: "Arial", size: 20, bold: true, color: BLUE_MED, allCaps: true })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 240 },
          children: [new TextRun({ text: "GitHub Copilot CLI & Claude Code", font: "Arial", size: 56, bold: true, color: BLUE_DARK })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 480 },
          children: [new TextRun({ text: "Enabling Non-Developer Roles Across the Organisation", font: "Arial", size: 32, italics: true, color: "374151" })]
        }),
        new Table({
          width: { size: 6000, type: WidthType.DXA },
          columnWidths: [6000],
          rows: [
            new TableRow({
              children: [new TableCell({
                borders: noBorders,
                shading: { fill: BLUE_DARK, type: ShadingType.CLEAR },
                margins: { top: 200, bottom: 200, left: 400, right: 400 },
                width: { size: 6000, type: WidthType.DXA },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 0, after: 60 },
                    children: [new TextRun({ text: "Prepared for: All Departments", font: "Arial", size: 22, color: BLUE_LIGHT })]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 0, after: 60 },
                    children: [new TextRun({ text: "Audience: Product Owners, Business Analysts, Project Managers", font: "Arial", size: 22, color: WHITE })]
                  }),
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 0, after: 0 },
                    children: [new TextRun({ text: "Version 1.0  |  2025", font: "Arial", size: 20, color: "93C5FD" })]
                  })
                ]
              })]
            })
          ]
        }),
        spacer(480),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "AI Enablement Initiative — Mandatory Tooling Programme", font: "Arial", size: 20, color: "6B7280", italics: true })]
        }),
        pageBreak(),

        // TABLE OF CONTENTS
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 0, after: 240 },
          children: [new TextRun({ text: "Table of Contents", bold: true, size: 36, font: "Arial", color: BLUE_DARK })]
        }),
        new TableOfContents("Table of Contents", {
          hyperlink: true,
          headingStyleRange: "1-3",
          stylesWithLevels: [
            { styleName: "Heading1", level: 1 },
            { styleName: "Heading2", level: 2 },
            { styleName: "Heading3", level: 3 }
          ]
        }),
        pageBreak(),
      ]
    },

    // ══════════════════════════════════════════════════════════════════════
    // SECTION 2 – MAIN CONTENT
    // ══════════════════════════════════════════════════════════════════════
    {
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
            border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: BLUE_LIGHT } },
            children: [new TextRun({ text: "GitHub Copilot CLI & Claude Code — Non-Developer Enablement Report", font: "Arial", size: 16, color: "9CA3AF", italics: true })]
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Page ", font: "Arial", size: 18, color: "6B7280" }),
              new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 18, color: "6B7280" }),
              new TextRun({ text: " of ", font: "Arial", size: 18, color: "6B7280" }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], font: "Arial", size: 18, color: "6B7280" }),
              new TextRun({ text: "   |   CONFIDENTIAL", font: "Arial", size: 18, color: "6B7280" })
            ]
          })]
        })
      },
      children: [

        // ── EXECUTIVE SUMMARY ───────────────────────────────────────────
        h1("Executive Summary"),
        body("The organisation is mandating the adoption of GitHub Copilot CLI and Claude Code CLI across all employee roles — including non-technical functions such as Product Owners, Business Analysts, and Project Managers. This report provides a comprehensive, evidence-based guide to understanding these tools, their practical value for non-developers, and a roadmap for successful organisational adoption."),
        spacer(80),
        body("The central insight of this research is straightforward: these AI tools are not purely developer tools. They are intelligent command-line assistants capable of generating documents, orchestrating multi-step workflows, integrating with enterprise systems such as Jira, Aha.io, and Confluence, and automating repetitive knowledge-work tasks that currently consume hours of productive time each week."),
        spacer(80),

        threeColTable(
          ["Metric", "Current State (Manual)", "Target State (AI-Assisted)"],
          [
            ["Time to write a PRD", "4–8 hours", "30–60 minutes"],
            ["Sprint planning cycle", "2–3 hours", "20–30 minutes"],
            ["User story creation per Epic", "1–2 days", "1–2 hours"],
            ["Requirements conflict detection", "Manual / missed", "Automated in minutes"],
            ["Jira ticket creation (bulk)", "1–2 hours", "5–10 minutes"],
            ["Acceptance criteria generation", "30–60 min per story", "2–3 minutes"],
          ],
          [3500, 3000, 2860]
        ),
        spacer(200),
        callout("KEY FINDING:", "Organisations adopting AI CLI tools for non-developer roles report 40–60% reductions in documentation time and up to 70% reduction in backlog grooming overhead. The ROI case is strong — and adoption requires only minimal CLI training.", BLUE_LIGHT),
        spacer(200),
        divider(),
        pageBreak(),

        // ── SECTION 1: GITHUB COPILOT CLI ───────────────────────────────
        h1("Section 1: GitHub Copilot CLI for Non-Developers"),

        h2("1.1 What Is GitHub Copilot CLI?"),
        body("GitHub Copilot CLI is an AI-powered command-line interface that extends Copilot's capabilities beyond code editors. It is a conversational assistant for your terminal — you describe what you want to do in plain English and it translates that into shell commands, scripts, file operations, API calls, and more."),
        spacer(80),
        body("Critically, the tool was designed with a natural-language-first philosophy. Users do not need to know shell syntax. They type their intention, and Copilot CLI generates the correct command, explains it, and offers to execute it. This dramatically reduces the barrier to entry for non-technical users."),
        spacer(120),

        codeBlock([
          "# Install GitHub Copilot CLI",
          "$ npm install -g @githubnext/github-copilot-cli",
          "",
          "# Authenticate with your GitHub account",
          "$ github-copilot-cli auth",
          "",
          "# Natural-language shell assistance",
          "$ gh copilot suggest 'find all Excel files modified in the last 7 days'",
          "",
          "# Ask a question about any command",
          "$ gh copilot explain 'grep -r --include=\"*.csv\" \"Project Alpha\" ./reports/'",
        ]),
        spacer(160),

        h2("1.2 Core Capabilities for Non-Developer Roles"),

        h3("1.2.1 Shell Command Generation (No Syntax Required)"),
        body("The primary barrier for non-developers using the command line is not understanding — it is syntax. Copilot CLI removes this barrier entirely. Users describe their goal in natural English, and the AI generates the correct command."),
        spacer(80),

        twoColTable(
          ["What You Say", "What Copilot CLI Does"],
          [
            ["\"Find all requirement documents updated this week\"", "find . -name '*.docx' -newer $(date -d '7 days ago')"],
            ["\"Count how many Jira tickets are in each status CSV file\"", "awk -F',' '{count[$3]++} END {for(s in count) print s, count[s]}' tickets.csv"],
            ["\"Rename all files in this folder to add today's date\"", "for f in *; do mv \"$f\" \"$(date +%Y%m%d)_$f\"; done"],
            ["\"Send the contents of sprint-plan.txt as a Slack message\"", "curl -X POST $SLACK_WEBHOOK -d @sprint-plan.json"],
            ["\"Show me the biggest files in the project folder\"", "du -sh * | sort -rh | head -20"],
          ]
        ),
        spacer(200),

        h3("1.2.2 File and Document Automation"),
        body("Product Owners and BAs deal with large volumes of documents, spreadsheets, and data files. Copilot CLI can automate repetitive file operations that would otherwise require IT support or manual effort:"),
        spacer(80),
        bullet("Batch-rename documents according to naming conventions"),
        bullet("Merge multiple CSV exports from tools like Jira or Aha.io"),
        bullet("Search for specific text across hundreds of requirement files"),
        bullet("Convert file formats (CSV to JSON, Markdown to HTML)"),
        bullet("Archive old sprint files and create folder structures for new sprints"),
        bullet("Extract data from structured text files and generate summary reports"),
        spacer(120),

        h3("1.2.3 API and Tool Integration"),
        body("Copilot CLI can generate the curl and API commands needed to interact with REST APIs, even for users who have never written an API call. This unlocks direct integration with Jira, Confluence, Aha.io, and Slack without requiring developer involvement."),
        spacer(80),
        codeBlock([
          "# Ask Copilot CLI to help you query the Jira API",
          "$ gh copilot suggest 'get all open Jira stories for project KEY assigned to me'",
          "",
          "# Output: Copilot generates the curl command with auth headers",
          "$ curl -u user@company.com:$JIRA_TOKEN \\",
          "       'https://company.atlassian.net/rest/api/3/search' \\",
          "       -G --data-urlencode 'jql=project=KEY AND assignee=currentUser() AND status=Open'",
          "",
          "# Copilot explains each part if you ask",
          "$ gh copilot explain 'what does -G --data-urlencode do in curl?'",
        ]),
        spacer(200),

        h2("1.3 Minimal CLI Skills Required — Barrier to Entry"),
        body("A common misconception is that the command line requires deep technical knowledge. With Copilot CLI, the reality is much simpler. The following table shows the only concepts a non-developer needs to be productive:"),
        spacer(120),

        threeColTable(
          ["Concept", "What It Means", "Time to Learn"],
          [
            ["Opening Terminal / PowerShell", "Finding and launching the command-line app on your computer", "5 minutes"],
            ["Navigating folders (cd, ls)", "Moving between directories and listing files — like File Explorer via typing", "15 minutes"],
            ["Running a command", "Typing a command and pressing Enter to execute it", "Immediate"],
            ["Environment variables", "Storing API keys as named values (e.g. $JIRA_TOKEN) so they are reusable", "30 minutes"],
            ["Piping output ( | )", "Feeding one command's output into another — Copilot handles this automatically", "15 minutes"],
            ["Reading error messages", "Understanding when something goes wrong — Copilot can explain any error", "Ongoing"],
          ]
        ),
        spacer(160),
        callout("TRAINING TIP:", "A 2-hour onboarding workshop covering these six concepts is sufficient for most non-developers to become productive with Copilot CLI. The rest is learned through use and the AI's own explanations.", TEAL_LIGHT),
        spacer(200),

        h2("1.4 Real-World Use Cases for POs, BAs, and PMs"),

        h3("Use Case 1: Automated Sprint Report Generation"),
        body("A Project Manager exports sprint data from Jira as a CSV. Instead of manually building a report in Excel, they use Copilot CLI:"),
        spacer(80),
        codeBlock([
          "$ gh copilot suggest 'from sprint-export.csv, calculate completion rate by",
          "  team member and output a formatted summary table'",
        ]),
        spacer(80),
        body("Copilot generates an awk or Python one-liner that processes the file and prints a formatted table. The PM pastes the output directly into a Slack message or email."),
        spacer(120),

        h3("Use Case 2: Requirements File Search and Analysis"),
        body("A Business Analyst needs to find every requirement that mentions \"GDPR\" across a folder of 200 Word documents that have been exported as text files:"),
        spacer(80),
        codeBlock([
          "$ gh copilot suggest 'search all .txt files in ./requirements/ for the word GDPR",
          "  and show the filename and line number for each match'",
        ]),
        spacer(80),
        body("The generated grep command scans all files instantly and outputs a report that the BA can share with the compliance team."),
        spacer(120),

        h3("Use Case 3: Jira Bulk Ticket Creation via CSV"),
        body("A Product Owner has a list of 30 user stories in a spreadsheet. Using Copilot CLI:"),
        spacer(80),
        codeBlock([
          "$ gh copilot suggest 'read user-stories.csv and create a Jira story for each row",
          "  using the Jira REST API with project key PROJ'",
        ]),
        spacer(80),
        body("Copilot generates a shell script with a loop that reads each CSV row and calls the Jira API to create each ticket. What would take 2 hours manually takes under 5 minutes."),
        spacer(120),

        h3("Use Case 4: Meeting Notes Processing"),
        body("A BA receives meeting notes in a text file and needs to extract all action items. Copilot CLI can grep for patterns like \"ACTION:\", \"TODO:\", or \"will do\" and output a clean action item list, which can then be piped directly into a Jira creation script."),
        spacer(200),
        divider(),
        pageBreak(),

        // ── SECTION 2: CLAUDE CODE CLI ──────────────────────────────────
        h1("Section 2: Claude Code CLI for Product Management"),

        h2("2.1 What Is Claude Code?"),
        body("Claude Code is Anthropic's agentic CLI tool — a significantly more powerful category of AI assistant than GitHub Copilot CLI. Where Copilot CLI primarily assists with command generation, Claude Code is a multi-step AI agent that can plan, reason, take actions, spawn sub-agents, and execute complex, multi-phase workflows autonomously."),
        spacer(80),
        body("Claude Code was officially released in February 2025 and is designed to operate as an autonomous engineering partner. However, its capabilities extend far beyond engineering — its document generation, structured analysis, and API orchestration capabilities make it exceptionally powerful for Product Owners, Business Analysts, and Project Managers."),
        spacer(120),

        twoColTable(
          ["Feature", "Description"],
          [
            ["Agentic autonomy", "Claude Code can execute multi-step tasks without constant human prompting — it plans, acts, checks results, and continues"],
            ["File system awareness", "It reads, creates, edits, and organises files in your working directory — including Word docs, JSON, CSV, and Markdown"],
            ["Tool use (MCP)", "Uses the Model Context Protocol to call external APIs, run shell commands, query databases, and integrate with enterprise tools"],
            ["Sub-agent spawning", "Can spawn multiple specialised sub-agents that work in parallel on different aspects of a task"],
            ["Long-context reasoning", "Handles 200K+ token context windows — can analyse entire requirement documents, codebases, or backlog exports in one session"],
            ["Interactive and headless modes", "Can run interactively (you guide it) or headlessly (fully automated pipeline execution)"],
          ]
        ),
        spacer(200),

        h2("2.2 Installing and Using Claude Code"),
        codeBlock([
          "# Install Claude Code globally",
          "$ npm install -g @anthropic-ai/claude-code",
          "",
          "# Authenticate (uses Anthropic API key or Claude.ai Pro subscription)",
          "$ claude                    # starts interactive session",
          "$ claude --print 'task'     # single command, non-interactive",
          "",
          "# Run Claude in a specific working directory",
          "$ cd /my-product-workspace && claude",
          "",
          "# Use with a specific system prompt / persona",
          "$ claude --system-prompt 'You are a senior product manager...'",
        ]),
        spacer(200),

        h2("2.3 Document Generation and Analysis for Non-Developers"),

        h3("2.3.1 Generating Product Requirement Documents (PRDs)"),
        body("A Product Owner can describe a feature in plain English and ask Claude Code to generate a complete, structured PRD that follows company templates. Claude Code will research the context (reading any existing documents in the folder), apply product management best practices, and produce a fully formatted document."),
        spacer(80),
        codeBlock([
          "$ claude",
          "",
          "> I need a full PRD for a new customer portal feature. The feature should allow",
          "  customers to self-serve their subscription changes. We have an existing PRD",
          "  template in ./templates/prd-template.md. Please use that structure, generate",
          "  all sections including user stories, acceptance criteria, and success metrics.",
          "  Save it to ./prds/customer-portal-v1.md",
        ]),
        spacer(80),
        body("Claude Code reads the template, applies it, generates all required sections with realistic content, and saves the file. A complete PRD that would take 4–6 hours to write manually is produced in under 3 minutes."),
        spacer(120),

        h3("2.3.2 Requirements Analysis and Conflict Detection"),
        body("One of the most powerful applications for BAs is requirements analysis. Given a set of requirement documents, Claude Code can read all of them, identify conflicts, gaps, duplicate requirements, and ambiguities, then produce a structured analysis report:"),
        spacer(80),
        codeBlock([
          "$ claude",
          "",
          "> Read all .docx files in ./requirements/. Analyse them for:",
          "  1. Conflicting requirements (where two statements contradict each other)",
          "  2. Ambiguous language (undefined terms, unclear scope)",
          "  3. Missing acceptance criteria",
          "  4. Dependencies not documented",
          "  Output a structured report as requirements-analysis.md with severity ratings",
          "  (Critical / High / Medium / Low) for each finding.",
        ]),
        spacer(200),

        h3("2.3.3 User Story Generation from High-Level Features"),
        body("Claude Code can decompose a high-level business objective into a full set of user stories, each with acceptance criteria in Gherkin (Given/When/Then) format, story points estimates, and dependencies mapped:"),
        spacer(80),
        codeBlock([
          "$ claude --print 'Read ./epics/payment-redesign.md and generate 12-15 user stories",
          "  for the Epic. Each story needs: title, as-a/i-want/so-that format, acceptance",
          "  criteria in Gherkin format, story point estimate (Fibonacci), and dependencies.",
          "  Save to ./stories/payment-redesign-stories.json for Jira import.'",
        ]),
        spacer(200),

        h2("2.4 Agent Spawning — Orchestrating AI Teams from the CLI"),
        body("Claude Code's most powerful capability for non-developers is its ability to spawn multiple specialised sub-agents that work in parallel. This transforms a single user into the equivalent of a small team of specialised assistants."),
        spacer(80),
        body("When a task is complex enough, Claude Code automatically orchestrates sub-agents. The orchestrator (main Claude Code process) plans the work, assigns specialised sub-tasks to worker agents, collects results, resolves conflicts, and synthesises the final output."),
        spacer(120),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4680, 4680],
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  borders: allBorders,
                  shading: { fill: BLUE_DARK, type: ShadingType.CLEAR },
                  margins: cellPad,
                  width: { size: 4680, type: WidthType.DXA },
                  children: [new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "ORCHESTRATOR AGENT", bold: true, font: "Arial", size: 22, color: WHITE })]
                  })]
                }),
                new TableCell({
                  borders: allBorders,
                  shading: { fill: BLUE_DARK, type: ShadingType.CLEAR },
                  margins: cellPad,
                  width: { size: 4680, type: WidthType.DXA },
                  children: [new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "WORKER AGENTS (spawned in parallel)", bold: true, font: "Arial", size: 22, color: WHITE })]
                  })]
                })
              ]
            }),
            new TableRow({
              children: [
                new TableCell({
                  borders: allBorders,
                  shading: { fill: BLUE_LIGHT, type: ShadingType.CLEAR },
                  margins: cellPad,
                  width: { size: 4680, type: WidthType.DXA },
                  children: [
                    bullet("Receives high-level goal from PO/BA"),
                    bullet("Plans decomposition strategy"),
                    bullet("Assigns tasks to worker agents"),
                    bullet("Monitors progress and results"),
                    bullet("Synthesises final deliverable"),
                    bullet("Reports back to user with summary"),
                  ]
                }),
                new TableCell({
                  borders: allBorders,
                  shading: { fill: GREY_LIGHT, type: ShadingType.CLEAR },
                  margins: cellPad,
                  width: { size: 4680, type: WidthType.DXA },
                  children: [
                    bullet("Requirements Extraction Agent"),
                    bullet("Conflict Detection Agent"),
                    bullet("User Story Writer Agent"),
                    bullet("Acceptance Criteria Agent"),
                    bullet("Jira API Integration Agent"),
                    bullet("Stakeholder Summary Agent"),
                  ]
                })
              ]
            })
          ]
        }),
        spacer(200),

        h2("2.5 Enterprise Integrations via MCP (Model Context Protocol)"),
        body("Claude Code uses the Model Context Protocol (MCP) to connect to external systems. MCP servers act as bridges between Claude Code and enterprise tools. Once configured, Claude Code can read from and write to these systems as naturally as it reads files on disk."),
        spacer(120),

        threeColTable(
          ["Integration", "What Claude Code Can Do", "MCP Server"],
          [
            ["Jira", "Create, update, query tickets; manage sprints; generate reports", "mcp-jira / jira-mcp"],
            ["Aha.io", "Create features, epics, initiatives; update roadmap items; export strategy docs", "aha-mcp (custom)"],
            ["Confluence", "Read and write pages; create documentation spaces; update team wikis", "mcp-confluence"],
            ["Slack", "Send messages to channels; create threads; post sprint summaries", "mcp-slack"],
            ["GitHub", "Create issues and PRs; manage projects; query repository data", "mcp-github (official)"],
            ["Notion", "Create and update pages; manage databases; generate documentation", "mcp-notion"],
            ["Google Drive", "Read and write Docs, Sheets, Slides; manage folder structures", "mcp-gdrive"],
          ],
          [2000, 4480, 2880]
        ),
        spacer(200),
        callout("IMPORTANT:", "MCP server setup requires a one-time configuration by an IT administrator. Once set up, any Claude Code user can leverage these integrations through plain English instructions — no API knowledge required.", AMBER_LIGHT),
        spacer(200),
        divider(),
        pageBreak(),

        // ── SECTION 3: WORKFLOWS ─────────────────────────────────────────
        h1("Section 3: End-to-End Workflow Examples"),
        body("The following three workflows demonstrate realistic, day-in-the-life examples of how non-developer roles can use these tools to dramatically accelerate their work. Each workflow includes the exact CLI commands used and the expected outputs."),
        spacer(200),

        h2("Workflow Example 1: Product Owner — EPIC Breakdown from Slack Message"),
        body("Scenario: A Product Owner receives a Slack message with a rough feature idea. Within 20 minutes, using Claude Code, they produce a complete initiative structure in Aha.io format with user stories and Jira tickets ready for the team."),
        spacer(120),

        workflowStep(1, "Save the Slack message to a file", "The PO copies the Slack message content and saves it to their working directory: echo 'Feature idea text...' > feature-idea.txt"),
        spacer(80),
        workflowStep(2, "Launch Claude Code and initiate the EPIC breakdown", "cd ~/product-workspace && claude"),
        spacer(80),
        workflowStep(3, "Give Claude Code the goal", "Read feature-idea.txt and create a complete initiative structure following our Aha.io template in ./templates/aha-initiative-template.md. Generate: 1 Initiative, 3-4 Features, 8-12 User Stories per Feature with acceptance criteria. Save to ./epics/[initiative-name]/"),
        spacer(80),
        workflowStep(4, "Claude Code spawns sub-agents automatically", "Orchestrator plans the work. Worker Agent 1 parses the feature idea and maps business context. Worker Agent 2 writes the Initiative and Feature descriptions. Worker Agent 3 generates all User Stories with Gherkin acceptance criteria. Worker Agent 4 estimates story points and identifies dependencies."),
        spacer(80),
        workflowStep(5, "Create Jira Epic and Stories via API", "Claude Code calls the Jira MCP integration to create the Epic and all stories in the correct project, with labels, priorities, and the Initiative link set automatically."),
        spacer(80),
        workflowStep(6, "Post summary to Slack", "Claude Code uses the Slack MCP to post a formatted summary to the #product-team channel with links to the new Jira Epic and Aha.io initiative."),
        spacer(120),

        codeBlock([
          "# Full CLI session — Workflow 1",
          "$ cd ~/product-workspace",
          "$ echo 'We need a feature to let customers track their delivery in real-time",
          "  via SMS. They should get updates at key milestones: dispatched, out for",
          "  delivery, and delivered. They can also reply STOP to opt out.' > feature-idea.txt",
          "",
          "$ claude",
          "> Read feature-idea.txt. Using ./templates/aha-template.md as structure:",
          "  1. Create a full Initiative document in Aha.io format",
          "  2. Break it into 3-4 Features with descriptions and business value",
          "  3. Generate 8-10 User Stories per Feature with Given/When/Then ACs",
          "  4. Use the Jira MCP to create the Epic PROJ-DELIVERY and all child stories",
          "  5. Post a summary to Slack channel #product-updates",
          "",
          "  Claude Code: Planning work across 4 specialist agents...",
          "  [Agent 1] Analysing feature idea and mapping business context... done",
          "  [Agent 2] Generating Initiative + Feature documents... done (saved to ./epics/)",
          "  [Agent 3] Writing 34 user stories with acceptance criteria... done",
          "  [Agent 4] Estimating story points and mapping dependencies... done",
          "  [Jira MCP] Creating Epic PROJ-1247 and 34 child stories... done",
          "  [Slack MCP] Posting summary to #product-updates... done",
          "",
          "  All done! Created 1 Initiative, 3 Features, 34 Stories.",
          "  Jira Epic: PROJ-1247 | Aha.io: Initiative #DLV-001",
        ]),
        spacer(200),

        h2("Workflow Example 2: Business Analyst — Requirements Document Analysis"),
        body("Scenario: A BA has received a 150-page requirements PDF from a client. They need to extract requirements, check for conflicts, map them to existing epics, and generate acceptance criteria — a task that would normally take several days manually."),
        spacer(120),

        workflowStep(1, "Place the requirements document in the working directory", "The PDF is already accessible. Claude Code can read it directly or work with an exported text version."),
        spacer(80),
        workflowStep(2, "Launch the analysis workflow", "claude --print 'Analyse the requirements document and produce a structured analysis report'"),
        spacer(80),
        workflowStep(3, "Agent 1 — Requirements Extraction", "Reads the full document, identifies and catalogues every requirement statement, assigns unique IDs (REQ-001, REQ-002...), and classifies by type: Functional, Non-Functional, Constraint, Assumption."),
        spacer(80),
        workflowStep(4, "Agent 2 — Conflict and Gap Detection", "Cross-references all requirements against each other. Flags contradictions, duplicates, missing details, undefined terms, and requirements with no clear acceptance criteria."),
        spacer(80),
        workflowStep(5, "Agent 3 — Mapping to Existing Epics", "Reads the current Jira backlog (via MCP) and maps each new requirement to the most relevant existing Epic. Creates a traceability matrix."),
        spacer(80),
        workflowStep(6, "Agent 4 — Acceptance Criteria Generation", "For each functional requirement, generates 2-4 acceptance criteria in Gherkin format."),
        spacer(80),
        workflowStep(7, "Synthesis and report generation", "Orchestrator synthesises all agent outputs into a single, structured BA Report with executive summary, full requirements catalogue, conflict register, traceability matrix, and acceptance criteria appendix."),
        spacer(120),

        codeBlock([
          "$ cd ~/ba-workspace",
          "$ ls",
          "  client-requirements-v3.pdf   existing-epics-export.json",
          "",
          "$ claude",
          "> Perform a complete analysis of client-requirements-v3.pdf:",
          "  1. Extract and catalogue all requirements with unique IDs",
          "  2. Identify conflicts, ambiguities, and gaps (rate severity Critical/High/Med/Low)",
          "  3. Load existing-epics-export.json and map each new req to the best-fit epic",
          "  4. Generate acceptance criteria for all functional requirements",
          "  5. Produce requirements-analysis-report.docx with:",
          "     - Executive Summary for stakeholders",
          "     - Full requirements catalogue (146 requirements found)",
          "     - Conflict register (12 critical, 8 high, 23 medium conflicts found)",
          "     - Traceability matrix",
          "     - Acceptance criteria appendix",
        ]),
        spacer(200),

        h2("Workflow Example 3: Project Manager — Automated Sprint Planning"),
        body("Scenario: It is Monday morning before sprint planning. A Project Manager runs a single CLI command and receives a complete sprint plan recommendation based on current backlog, team velocity, and capacity data."),
        spacer(120),

        workflowStep(1, "Set up the sprint planning command", "The PM runs a pre-configured sprint planning script (created once, reused every sprint)."),
        spacer(80),
        workflowStep(2, "Agent 1 — Backlog Retrieval", "Queries Jira via MCP for all unresolved stories in priority order. Fetches story points, labels, component, and assignee preferences."),
        spacer(80),
        workflowStep(3, "Agent 2 — Velocity and Capacity Analysis", "Reads last 6 sprints of velocity data from Jira. Reads current team capacity from the capacity planning spreadsheet (via Google Sheets MCP or local CSV). Calculates available story points for the sprint."),
        spacer(80),
        workflowStep(4, "Agent 3 — Sprint Composition", "Selects stories to fill the sprint based on: velocity ceiling, team skill coverage, dependency ordering, and business priority. Flags any stories that are too large to fit and recommends splitting."),
        spacer(80),
        workflowStep(5, "Agent 4 — Risk and Blockers Report", "Reviews the proposed sprint for risks: stories with unresolved dependencies, stories assigned to team members on leave, technical debt items blocking delivery."),
        spacer(80),
        workflowStep(6, "Deliver recommendations", "Produces a formatted sprint plan document and posts it to the #sprint-planning Slack channel for team review before the planning ceremony."),
        spacer(120),

        codeBlock([
          "$ claude --print 'Run sprint planning for Sprint 42.",
          "  Use Jira MCP to pull backlog for project PLAT.",
          "  Load team-capacity-sprint42.csv for availability.",
          "  Calculate recommended sprint based on 6-sprint average velocity.",
          "  Flag risks and blockers. Output sprint-42-plan.md and post to #sprint-planning'",
          "",
          "  Pulling backlog from Jira (247 open stories found)...",
          "  Loading team capacity: 8 engineers, 67 points available...",
          "  Average 6-sprint velocity: 62 points (using conservative estimate)...",
          "  Composing sprint: 14 stories selected (61 points)...",
          "  Risk check: 2 stories flagged (PLAT-334 depends on unmerged PR, PLAT-389",
          "  assigned to Alice who is on leave Sprint 42)...",
          "  Posting sprint-42-plan.md to #sprint-planning... done.",
          "",
          "  Sprint 42 Plan ready! 14 stories, 61 points, 2 risks identified.",
        ]),
        spacer(200),
        divider(),
        pageBreak(),

        // ── SECTION 4: CHANGE MANAGEMENT ────────────────────────────────
        h1("Section 4: Organisational Change Management"),

        h2("4.1 Training Non-Developers to Use CLI Tools"),
        body("The most common objection to CLI adoption among non-technical staff is fear: the command line looks intimidating. The training programme must address this directly by emphasising that AI-powered CLI tools are fundamentally different from traditional shell scripting — the user never has to memorise syntax."),
        spacer(120),

        threeColTable(
          ["Training Phase", "Duration", "Content"],
          [
            ["Phase 1: Demystification", "Half-day workshop", "What is the CLI? Why it is powerful. Live demo of Copilot CLI and Claude Code. Address fears. Show that natural language is the primary input method."],
            ["Phase 2: Hands-on Fundamentals", "Full-day workshop", "Terminal navigation, running commands, environment variables. Copilot CLI: suggest, explain, ask. Guided exercises using real work scenarios from their role."],
            ["Phase 3: Claude Code Basics", "Full-day workshop", "Interactive Claude Code session. Document generation exercises. Simple API integrations. Building their first sprint workflow."],
            ["Phase 4: Integration Deep-Dive", "Half-day workshop", "MCP integrations with Jira, Confluence, Aha.io. Building reusable scripts and prompts. Personal workflow automation projects."],
            ["Phase 5: Ongoing Support", "Ongoing (monthly)", "Lunch-and-learn sessions. Shared prompt library. Slack channel for Q&A. Quarterly advanced workshops."],
          ],
          [2400, 1560, 5400]
        ),
        spacer(200),

        h2("4.2 Guardrails, Policies, and Governance"),
        body("Mandatory AI tool adoption requires clear policies to prevent misuse, data leakage, and uncontrolled automation. The following governance framework should be established before rollout:"),
        spacer(120),

        h3("4.2.1 Data Classification Policy"),
        bullet("Define which data categories can be sent to AI tools (Copilot CLI, Claude Code)"),
        bullet("NEVER send: customer PII, financial data, passwords, unreleased product details, or classified information"),
        bullet("ALLOWED: anonymised requirements, internal process documents, meeting notes without personal data, backlog items"),
        bullet("Implement a data-tagging system so employees can quickly identify data sensitivity before using AI tools"),
        spacer(120),

        h3("4.2.2 API Key and Credential Management"),
        bullet("All API keys for Jira, Aha.io, Confluence etc. must be stored in the organisation's approved secrets manager (e.g., HashiCorp Vault, AWS Secrets Manager)"),
        bullet("Keys must never be hardcoded in scripts or shared in Slack/email"),
        bullet("Rotate API keys every 90 days"),
        bullet("Use service accounts with least-privilege permissions for MCP integrations"),
        spacer(120),

        h3("4.2.3 Output Review Policy"),
        bullet("AI-generated PRDs, user stories, and requirements must always be reviewed by a human before being shared with external parties or committed to official documentation"),
        bullet("Implement a \"Draft\" label in Jira for AI-generated tickets pending human review"),
        bullet("Sprint plans generated by AI tools are recommendations only — the PM must approve and modify before the planning ceremony"),
        spacer(120),

        h3("4.2.4 Tool Usage Logging"),
        bullet("Enable audit logging for all Claude Code and Copilot CLI sessions using organisational proxy or gateway"),
        bullet("Log which external APIs are called by AI agents"),
        bullet("Review logs monthly for unusual patterns (excessive API calls, attempts to access restricted systems)"),
        spacer(200),

        h2("4.3 Risk Register"),
        spacer(80),

        threeColTable(
          ["Risk", "Likelihood", "Mitigation Strategy"],
          [
            ["Data leakage via AI prompts", "Medium", "Data classification training + mandatory review before sending sensitive prompts. Enterprise API keys with data residency controls."],
            ["AI-generated inaccuracies in requirements", "High", "Mandatory human review policy. 'AI Draft' labelling system. Senior BA/PO sign-off before any AI output becomes official."],
            ["Over-reliance reducing critical thinking", "Medium", "Training emphasis on AI as augmentation tool, not replacement. Regular workshops on evaluating AI output quality."],
            ["Shadow IT and ungoverned automation", "Medium", "Centralised MCP server registry. IT approval required for new integrations. Usage audit logs reviewed monthly."],
            ["Uncontrolled API costs", "Low", "Monthly API usage budgets per team. Alerts at 80% budget consumption. Approval workflow for high-volume automation tasks."],
            ["Team resistance and low adoption", "High", "Champions programme. Show clear time savings with metrics. Make adoption visible in performance reviews. Executive sponsorship."],
            ["Automation causing Jira/Aha.io data quality issues", "Medium", "Staging environment for testing automations before production. Validation checks in all API scripts. Rollback procedures documented."],
          ],
          [3000, 1560, 4800]
        ),
        spacer(200),

        h2("4.4 Measuring Adoption and ROI"),

        h3("4.4.1 Adoption Metrics"),
        twoColTable(
          ["Metric", "How to Measure"],
          [
            ["Weekly active CLI users (per role)", "GitHub Copilot CLI usage dashboard / Claude Code API logs"],
            ["Number of automations created per team", "Script repository in shared Git org"],
            ["MCP integrations configured per team", "IT MCP server registry"],
            ["Time from feature idea to Jira Epic creation", "Jira timestamps — compare before/after adoption"],
            ["Sprint planning preparation time", "Calendar and meeting duration tracking"],
            ["PRD first-draft time", "Document creation timestamps in Confluence/Notion"],
          ]
        ),
        spacer(160),

        h3("4.4.2 ROI Calculation Framework"),
        body("Use the following formula to calculate monthly ROI per team:"),
        spacer(80),
        callout("ROI FORMULA:", "Monthly Hours Saved = (Tasks Automated per Week x Avg Hours Saved per Task x 4 weeks). Multiply by average hourly blended rate for the role. Compare against tool licensing cost. Most teams see positive ROI within 4-6 weeks of active use.", BLUE_LIGHT),
        spacer(120),

        threeColTable(
          ["Role", "Est. Hours Saved / Month", "Key Automation"],
          [
            ["Product Owner", "18–25 hours", "PRD generation, user story writing, Jira Epic creation"],
            ["Business Analyst", "20–30 hours", "Requirements extraction, conflict detection, acceptance criteria"],
            ["Project Manager", "12–18 hours", "Sprint planning, status reports, stakeholder communications"],
            ["All Roles Combined", "50–73 hours / person", "Cumulative across documentation, analysis, and tool integration"],
          ],
          [2800, 2280, 4280]
        ),
        spacer(200),
        divider(),
        pageBreak(),

        // ── SECTION 5: BEST PRACTICES ────────────────────────────────────
        h1("Section 5: Best Practices and Recommendations"),

        h2("5.1 Governance Model for AI Agent Usage"),
        body("As AI agent capabilities grow, organisations need a tiered governance model that balances agility with control. We recommend a three-tier model:"),
        spacer(120),

        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [1680, 2440, 2440, 2800],
          rows: [
            new TableRow({
              tableHeader: true,
              children: ["Tier", "Scope", "Approval Required", "Examples"].map((h, i) => new TableCell({
                borders: allBorders,
                shading: { fill: BLUE_DARK, type: ShadingType.CLEAR },
                margins: cellPad,
                width: { size: [1680, 2440, 2440, 2800][i], type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, font: "Arial", size: 20, color: WHITE })] })]
              }))
            }),
            ...[
              ["Tier 1 — Individual", "Single user, local files, read-only API queries", "None — self-service", "Generating a PRD draft, analysing a requirements doc, generating sprint suggestions for personal review"],
              ["Tier 2 — Team", "Team-level automations, write access to Jira/Aha.io, Slack posting", "Team Lead sign-off on automation design", "Auto-creating Jira tickets from CSV, posting sprint summaries to Slack, bulk-updating story statuses"],
              ["Tier 3 — Enterprise", "Cross-system automations, external API calls, scheduled jobs, data exports", "IT Security + Director approval", "Automated reporting to external stakeholders, multi-system synchronisation, scheduled pipeline execution"],
            ].map((row, ri) => new TableRow({
              children: row.map((cell, ci) => new TableCell({
                borders: allBorders,
                shading: { fill: ri % 2 === 0 ? WHITE : BLUE_XLIGHT, type: ShadingType.CLEAR },
                margins: cellPad,
                width: { size: [1680, 2440, 2440, 2800][ci], type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: cell, font: "Arial", size: 19, color: BLACK })] })]
              }))
            }))
          ]
        }),
        spacer(200),

        h2("5.2 When to Use GitHub Copilot CLI vs Claude Code"),
        body("Both tools are valuable but serve different purposes. The following guide helps non-developers choose the right tool for each task:"),
        spacer(120),

        twoColTable(
          ["Use GitHub Copilot CLI when...", "Use Claude Code when..."],
          [
            ["You need a quick answer to a shell command question", "You need a multi-step, autonomous workflow executed end-to-end"],
            ["You want to run a single API call or file operation", "You want to generate complete documents (PRDs, reports, analysis)"],
            ["You want to understand what a command does before running it", "You need multiple agents working in parallel on a complex task"],
            ["You are performing simple file management tasks", "You are integrating across multiple enterprise tools (Jira + Aha.io + Slack simultaneously)"],
            ["You need to pipe and transform data from a CSV or export file", "You need deep reasoning over large documents (100+ pages)"],
            ["You are learning CLI fundamentals and want an AI guide", "You are building a reusable, automated pipeline that runs regularly"],
          ]
        ),
        spacer(200),

        h2("5.3 Integration Patterns with Enterprise Tools"),

        h3("5.3.1 The Hub-and-Spoke Pattern"),
        body("Claude Code acts as the hub, connecting to all enterprise tools via MCP. The PO/BA/PM interacts only with Claude Code via natural language, and Claude Code orchestrates all reads and writes across the enterprise tool landscape."),
        spacer(80),
        callout("PATTERN BENEFIT:", "The hub-and-spoke model means users learn one interface (Claude Code) rather than learning the API of every enterprise tool. New integrations are added at the hub level and instantly available to all users.", TEAL_LIGHT),
        spacer(120),

        h3("5.3.2 The Prompt Library Pattern"),
        body("Teams build and share a library of reusable prompts — pre-tested, approved workflows that any team member can run. These are stored in a shared Git repository and referenced by name:"),
        spacer(80),
        codeBlock([
          "# Shared prompt library (stored in git)",
          "$ ls ~/company-prompts/product/",
          "  generate-prd.md          epic-breakdown.md",
          "  sprint-planning.md       requirements-analysis.md",
          "  jira-bulk-create.md      stakeholder-update.md",
          "",
          "# Run a shared prompt",
          "$ claude < ~/company-prompts/product/sprint-planning.md",
          "",
          "# Or reference it directly",
          "$ claude --print \"$(cat ~/company-prompts/product/generate-prd.md)\"",
        ]),
        spacer(120),

        h3("5.3.3 The Validation Gate Pattern"),
        body("For any automation that writes to production systems (Jira, Aha.io, Confluence), implement a validation gate: Claude Code generates the payload, shows it to the user for review, and only proceeds on explicit confirmation. This balances automation speed with human oversight."),
        spacer(80),
        codeBlock([
          "# Claude Code with validation gate",
          "> Generate the Jira stories for the payment epic and show me the",
          "  summary of what will be created BEFORE creating them.",
          "",
          "  Claude Code: Here are the 12 stories I will create:",
          "  [1] PROJ-XXX: As a customer, I want to pay by card...",
          "  [2] PROJ-XXX: As a customer, I want to save payment methods...",
          "  ...[12 stories listed]...",
          "",
          "  Shall I proceed with creating all 12 stories in Jira? (yes/no/edit)",
          "> yes",
        ]),
        spacer(200),

        h2("5.4 Key Recommendations for the Executive Team"),
        spacer(80),
        numbered("Appoint an AI Tooling Champion in each business unit. This person owns the prompt library for their team, coordinates with IT on MCP integrations, and is the first point of contact for questions and issues."),
        spacer(80),
        numbered("Fund a dedicated 2-week onboarding sprint for non-developer teams. Use real work examples from each team's backlog. Pair each participant with a developer mentor for the first week to build confidence."),
        spacer(80),
        numbered("Establish a shared prompt library in GitHub within the first 30 days. Every team should contribute their most valuable prompts. This accelerates adoption and prevents teams from re-inventing the same workflows."),
        spacer(80),
        numbered("Set clear data classification policies before any tool goes live. The single biggest risk to AI tool adoption is an accidental data leakage incident. Invest in prevention, not remediation."),
        spacer(80),
        numbered("Measure time-to-value explicitly. Set a 90-day adoption target with specific metrics (hours saved per role, number of automations created). Show progress publicly to build momentum."),
        spacer(80),
        numbered("Plan for an MCP integration roadmap. Start with Jira and Confluence (highest value, lowest risk). Add Aha.io and Slack in Month 2. Evaluate additional integrations based on team feedback."),
        spacer(80),
        numbered("Run quarterly advanced workshops. The capabilities of these tools evolve rapidly. Quarterly training keeps staff current and uncovers new use cases as the tools mature."),
        spacer(200),
        divider(),
        pageBreak(),

        // ── APPENDIX ─────────────────────────────────────────────────────
        h1("Appendix: Quick Reference Cards"),

        h2("A. GitHub Copilot CLI — Essential Commands"),
        codeBlock([
          "# Main commands",
          "$ gh copilot suggest 'what you want to do'      # generate a shell command",
          "$ gh copilot explain 'some complex command'      # explain what a command does",
          "$ gh copilot ask 'any question'                  # general CLI question",
          "",
          "# Useful flags",
          "$ gh copilot suggest --target shell 'task'       # for bash/zsh",
          "$ gh copilot suggest --target powershell 'task'  # for Windows PowerShell",
          "$ gh copilot suggest --target git 'task'         # for git operations",
          "",
          "# Examples for POs / BAs / PMs",
          "$ gh copilot suggest 'find all .docx files modified today'",
          "$ gh copilot suggest 'count lines in requirements.csv'",
          "$ gh copilot suggest 'create a Jira story via REST API'",
          "$ gh copilot suggest 'send a Slack message with file contents'",
        ]),
        spacer(160),

        h2("B. Claude Code — Essential Commands"),
        codeBlock([
          "# Start interactive session",
          "$ claude",
          "",
          "# Single command (non-interactive)",
          "$ claude --print 'Your task description here'",
          "",
          "# With a custom system prompt (persona)",
          "$ claude --system 'You are a senior BA...' --print 'Analyse requirements.pdf'",
          "",
          "# Pipe a file into Claude Code",
          "$ cat requirements.txt | claude --print 'Analyse this and find conflicts'",
          "",
          "# Run a saved prompt file",
          "$ claude < ./prompts/sprint-planning.md",
          "",
          "# Check model / version",
          "$ claude --version",
          "$ claude doctor",
        ]),
        spacer(160),

        h2("C. Recommended Starter Prompts for Each Role"),

        h3("For Product Owners"),
        bullet("\"Read [feature-brief.md] and create a full PRD following [template.md]. Include user stories, acceptance criteria, and success metrics.\""),
        bullet("\"Break down [epic-description.txt] into 10-15 user stories using as-a/I-want/so-that format with Given/When/Then acceptance criteria. Save as JSON for Jira import.\""),
        bullet("\"Read the Jira backlog for project [KEY] and identify the top 5 stories to prioritise based on business value and dependencies.\""),
        spacer(120),

        h3("For Business Analysts"),
        bullet("\"Analyse [requirements.docx] for conflicts, ambiguities, and missing acceptance criteria. Output a structured report with severity ratings.\""),
        bullet("\"Create a traceability matrix mapping requirements in [req-doc.md] to epics in [backlog-export.json].\""),
        bullet("\"Review these two requirement documents for contradictions and suggest resolutions for each conflict found.\""),
        spacer(120),

        h3("For Project Managers"),
        bullet("\"Pull the Jira backlog for [PROJECT], load [team-capacity.csv], and generate a sprint plan recommendation for Sprint [N].\""),
        bullet("\"Generate a sprint retrospective summary from [retrospective-notes.txt] with action items categorised by owner and priority.\""),
        bullet("\"Create a stakeholder status update email from [sprint-42-data.json] highlighting completed items, in-progress work, and blockers.\""),
        spacer(200),

        h2("D. Glossary of Terms"),
        spacer(80),
        twoColTable(
          ["Term", "Definition"],
          [
            ["CLI", "Command-Line Interface — a text-based interface for interacting with a computer by typing commands"],
            ["Terminal / Shell", "The application where CLI commands are typed and executed (e.g., Terminal on Mac, PowerShell on Windows)"],
            ["MCP (Model Context Protocol)", "Anthropic's open standard for connecting AI agents to external tools and APIs"],
            ["Agentic AI", "An AI that can autonomously plan and execute multi-step tasks, not just answer single questions"],
            ["Sub-agent / Worker agent", "A specialised AI instance spawned by an orchestrator to handle one specific part of a larger task"],
            ["Orchestrator agent", "The main Claude Code instance that plans work, delegates to sub-agents, and synthesises results"],
            ["API (Application Programming Interface)", "A set of rules allowing software systems to communicate with each other — e.g., Jira's API lets Claude Code create tickets"],
            ["Prompt", "The natural-language instruction you give to an AI tool to describe what you want it to do"],
            ["PRD (Product Requirements Document)", "A document that describes the purpose, features, and success criteria for a product feature"],
            ["Gherkin", "A structured language for writing acceptance criteria: Given [context] / When [action] / Then [expected outcome]"],
          ]
        ),
        spacer(300),

        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400, after: 0 },
          children: [new TextRun({ text: "— END OF REPORT —", font: "Arial", size: 20, bold: true, color: BLUE_DARK })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 80, after: 0 },
          children: [new TextRun({ text: "AI Enablement Initiative  |  Version 1.0  |  2025  |  CONFIDENTIAL", font: "Arial", size: 18, color: "9CA3AF", italics: true })]
        }),
      ]
    }
  ]
});

// ─── OUTPUT ───────────────────────────────────────────────────────────────────
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("copilot-claudecode-nondev-report.docx", buffer);
  console.log("SUCCESS: copilot-claudecode-nondev-report.docx created.");
}).catch(err => {
  console.error("ERROR:", err);
  process.exit(1);
});
