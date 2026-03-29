# Copilot PO/BA Toolkit

A collection of AI agent skills for **Product Owners**, **Business Analysts**, and **Tech Leads** working in SAFe/Agile environments. These skills work with GitHub Copilot CLI, Claude Code, and VS Code Agent Mode.

## What This Is

This toolkit gives your product team AI-powered workflows for two things:

1. **Professional document generation** — create Word docs, PowerPoint decks, and Excel workbooks from natural language prompts
2. **Agile delivery workflows** — generate feature briefs, decompose epics, refine user stories, plan PIs, and create retrospective reports
3. **Visual diagrams** — generate draw.io diagrams (dependency maps, story hierarchies, BPMN process flows, sequence diagrams, C4 architecture) from your agile artifacts

Every skill is a portable `SKILL.md` file that teaches the AI agent how to perform a specialized task. Just describe what you need in plain English and the agent produces the output.

---

## Document Generation Skills

### Excel Workbooks (.xlsx)

Generate professional Excel workbooks with styled headers, formulas, conditional formatting, charts, frozen panes, data validation, and multi-sheet layouts.

**Powered by**: Python + openpyxl

```
> Create an Excel workbook tracking Q1 OKR progress with a dashboard sheet,
  team metrics, and a burndown chart. Include conditional formatting for
  status columns and formulas for completion percentages.
```

**What you get**:
- Multi-sheet workbooks with cross-sheet formulas
- Conditional formatting (color scales, data bars, icon sets)
- Data validation (dropdown lists)
- Charts (bar, pie, line)
- Frozen panes and auto-filters
- Financial model conventions (blue font = inputs, black = formulas)
- Print-ready with headers, footers, and page setup

### PowerPoint Presentations (.pptx)

Generate polished slide decks with varied layouts, professional color palettes, styled tables, charts, and design-forward aesthetics.

**Powered by**: Node.js + pptxgenjs

```
> Create a 10-slide deck presenting our AI adoption strategy to the
  executive team. Include a comparison table, key metrics with big
  number callouts, and a phased timeline. Use a professional dark theme.
```

**What you get**:
- Curated color palettes (not generic blue)
- Varied slide layouts (two-column, card grids, stat callouts, tables)
- Embedded charts and styled tables
- Speaker notes support
- Professional typography pairings
- Built-in QA workflow with visual inspection

### Word Documents (.docx)

Generate professional Word documents with headings, tables, bullet lists, headers/footers, page numbers, and table of contents.

**Powered by**: Node.js + docx

```
> Generate a Word document summarizing our Q1 engineering review with
  an executive summary, team accomplishments table, risk register,
  and recommendations section.
```

**What you get**:
- Properly styled headings (H1-H3) with body text that doesn't inherit heading styles
- Bullet and numbered lists (with numbering that restarts correctly between sections)
- Styled tables with header shading
- Headers, footers, and page numbers
- Document metadata (title, author, description)
- US Letter page setup with configurable margins

---

## Agile Delivery Skills

### Feature Brief Generator

Turn vague business requirements from Aha! or Jira into structured, actionable feature briefs with technical analysis from the codebase.

```
> Read the Aha! requirement at requirements/portfolio-risk-alerts.md
  and generate a feature brief. Analyze the payments-service codebase
  for technical context.
```

**What you get**:
- Business context (restated clearly, ambiguity removed)
- Technical analysis (affected systems, key files, existing patterns from codebase scan)
- Scope boundaries (in scope vs out of scope)
- Risks and dependencies
- Open questions for PO, architecture, and stakeholders
- Recommended approach with complexity estimate (S/M/L/XL)

**Input**: Pasted text, markdown file, or Jira ticket (via Jira MCP)

### Epic Decomposer

Break a feature brief into a structured epic folder with user stories, tasks, and spikes — ready to push to Jira.

```
> Take the feature brief for portfolio risk alerts and decompose it
  into epics and user stories with acceptance criteria, sizing, and
  priorities. Use our team conventions.
```

**What you get**:
- Epic overview with story map table
- Individual story files with Given/When/Then acceptance criteria
- Edge cases and negative scenarios for each story
- Sizing (1, 2, 3, 5) and priority (P1-P4)
- Dependency mapping between stories
- Spike templates with research questions and timebox
- Definition of Done checklist per story

**Output structure**:
```
epics/2026-03-28-portfolio-risk-alerts/
├── epic-overview.md
├── 1.0-setup-risk-engine.md
├── 1.1-risk-calculation-api.md
├── 1.2-spike-evaluate-ml-models.md
├── 2.0-advisor-dashboard-alerts.md
└── ...
```

### Story Refiner

Improve draft user stories for sprint refinement prep. Runs an INVEST criteria check, fixes acceptance criteria, flags vague language, and recommends splits for oversized stories.

```
> Refine the draft stories at stories/sprint-14-backlog.md for our
  refinement meeting. Flag anything vague and recommend splits for
  stories sized above 5.
```

**What you get**:
- INVEST scorecard (Independent, Negotiable, Valuable, Estimable, Small, Testable)
- Acceptance criteria rewritten in Given/When/Then format
- Vague language flagged with specific replacements ("should be secure" → "TLS 1.3 + token-based auth")
- Split recommendations for stories > 5 points
- Edge cases and negative scenarios added
- Batch refinement summary table

### PI Planning Workbook

Generate a pre-populated Excel workbook for SAFe PI Planning with team capacity, feature breakdown, risk matrix, and sprint plan.

```
> Generate a PI planning workbook for PI 26.3. We have 7 team members,
  8 two-week sprints, and 5 features to plan. Use the inputs at
  pi-planning/pi-26-3-inputs.md.
```

**What you get (5 sheets)**:
- **PI Summary** — KPI cards, PI objectives with business value scoring
- **Team Capacity** — per-member availability, sprint-by-sprint capacity formulas
- **Feature Breakdown** — features mapped to sprints, load balancing, variance tracking
- **Risk & Dependencies** — ROAM matrix (Resolved/Owned/Accepted/Mitigated)
- **Sprint Plan** — story-level sprint assignments with capacity tracking

All calculations are live Excel formulas. Conditional formatting flags over-capacity automatically.

### PI Retro Report

Turn raw retrospective notes into a professional report for leadership — as a Word document or PowerPoint deck.

```
> Generate a PI retro report from the notes at retro/pi-26-2-notes.md.
  Create a Word document with categorized findings, metrics, action
  items with owners, and recommendations.
```

**What you get**:
- Findings categorized (What Went Well / What Didn't / Action Items)
- Grouped by themes (Collaboration, Process, Technical, etc.)
- Action items with owners and deadlines
- Metrics summary (velocity, completion rate, defects, carryover)
- Recurring theme detection across PIs
- Recommendations for next PI

---

## Visual Diagram Skills

### draw.io Agile Diagrams (.drawio)

Generate draw.io diagram files from your agile artifacts — no CLI tools or platform dependencies required. Output is a `.drawio` XML file you open in draw.io (web or desktop).

**Powered by**: Python (standard library only)

```
> Generate a dependency map from the epic folder at
  epics/2026-03-28-portfolio-risk-alerts/. Show which
  stories block each other, color-coded by priority.
```

**Diagram types**:

| Diagram | Input | Use Case |
|---------|-------|----------|
| **Dependency Map** | Epic folder (story files) | PI Planning — visualize story blocking relationships |
| **Story Hierarchy Tree** | Epic overview | Stakeholder communication — show Epic > Story breakdown |
| **BPMN Process Flow** | Text or acceptance criteria | Refinement — clarify business workflows |
| **Sequence Diagram** | Feature brief or text | Design review — show system interactions |
| **C4 Context Diagram** | Feature brief | Architecture — show system boundary and actors |

**What you get**:
- Raw `.drawio` XML file — opens in app.diagrams.net, draw.io desktop, VS Code extension, or Confluence
- Professional color palette with priority-based coloring (P1=red, P2=orange, P3=blue, P4=gray)
- Grid-aligned layout ready for manual adjustment in draw.io
- No pip install, no npm install, no CLI dependencies — works on any platform including Windows

---

## How It Works

```
┌──────────────────────────────────────────────────────┐
│                   Your Prompt                         │
│  "Create an Excel workbook tracking Q1 OKRs..."      │
└─────────────────────┬────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────┐
│              Agent Skill Discovery                    │
│  Agent reads skill names + descriptions               │
│  Matches "Excel workbook" → xlsx-generator skill      │
└─────────────────────┬────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────┐
│            SKILL.md Injected into Context             │
│  Agent now has API patterns, rules, and gotchas       │
└─────────────────────┬────────────────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────────────────┐
│             Agent Writes & Executes Code              │
│  1. Installs dependencies (if needed)                 │
│  2. Writes a generator script                         │
│  3. Executes it                                       │
│  4. Verifies the output file                          │
└─────────────────────┬────────────────────────────────┘
                      │
                      ▼
                 📄 output.xlsx
```

---

## Agile Delivery Pipeline

The agile skills chain together into a complete workflow:

```
Aha! / Jira (vague requirement)
        │
        ▼
  Feature Brief Generator ──→ docs/feature-briefs/
        │
        ▼
  Epic Decomposer ──→ epics/YYYY-MM-DD-feature/
        │
        ├──→ Story Refiner (sprint refinement prep)
        ├──→ Jira MCP (push to board)
        └──→ PI Planning Workbook ──→ generated/output/
                                            │
                                      [Execute the PI]
                                            │
                                            ▼
                                   PI Retro Report ──→ generated/output/
```

---

## Installation

### Option A: Clone this repo (project-level skills)

```bash
git clone <repo-url>
cd copilot-po-ba-toolkit
```

Skills are automatically discovered from `.github/skills/` by GitHub Copilot CLI, Claude Code, and VS Code Agent Mode.

### Option B: Copy individual skills to your project

```bash
# Copy just the skills you need into any repo
cp -r .github/skills/xlsx-generator your-repo/.github/skills/
cp -r .github/skills/epic-decomposer your-repo/.github/skills/
```

### Option C: Install globally (available in all projects)

```bash
# For Copilot CLI
cp -r .github/skills/* ~/.copilot/skills/

# For Claude Code
cp -r .github/skills/* ~/.claude/skills/
```

## Prerequisites

- **Node.js** (for docx and pptx generation)
- **Python 3** (for xlsx and draw.io diagram generation)
- **npm packages**: `docx`, `pptxgenjs` (installed automatically by the agent)
- **pip packages**: `openpyxl` (installed automatically by the agent)
- **draw.io diagrams**: No additional dependencies — uses Python standard library only

## Project Structure

```
copilot-po-ba-toolkit/
├── .github/
│   ├── copilot-instructions.md          # File organization conventions
│   └── skills/
│       ├── xlsx-generator/              # Excel workbooks
│       ├── pptx-generator/              # PowerPoint presentations
│       ├── docx-generator/              # Word documents
│       ├── drawio-agile-diagrams/       # draw.io diagrams (.drawio)
│       ├── feature-brief-generator/     # Aha!/Jira → feature brief
│       ├── epic-decomposer/             # Feature brief → epics & stories
│       ├── story-refiner/               # Draft stories → refined stories
│       ├── pi-planning-workbook/        # PI planning Excel workbook
│       └── pi-retro-report/             # Retrospective report generator
├── test-data/                           # Sample inputs for testing
│   ├── aha-requirements/
│   ├── draft-stories/
│   ├── retro-notes/
│   └── pi-planning/
├── generated/
│   ├── scripts/                         # Generator scripts (.js, .py)
│   └── output/                          # Output files (.docx, .pptx, .xlsx)
├── docs/
│   ├── feature-briefs/                  # Generated feature briefs
│   └── plans/                           # Design docs and implementation plans
└── epics/                               # Generated epic folders
```

## Team Conventions

These skills are configured for SAFe teams with the following conventions:

| Convention | Value |
|-----------|-------|
| Sizing | Fibonacci subset: 1, 2, 3, 5 |
| Priority | P1 (critical) through P4 (low) |
| Sprint length | 2 weeks |
| PI length | Variable (4-8 sprints) |
| Story types | Story, Task, Spike, Bug |
| Acceptance criteria | Given / When / Then |
| Financial models | Blue font = inputs, Black font = formulas |

To customize these conventions for your team, edit the relevant `SKILL.md` files.

## Compatibility

These skills work across all platforms that support the Agent Skills standard:

| Platform | Supported |
|----------|-----------|
| GitHub Copilot CLI | Yes |
| Claude Code | Yes |
| VS Code Agent Mode | Yes |
| GitHub Copilot Coding Agent | Yes |

## License

MIT
