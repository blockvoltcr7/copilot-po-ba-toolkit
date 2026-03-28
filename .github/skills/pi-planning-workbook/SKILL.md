---
name: pi-planning-workbook
description: >
  Generate a PI Planning Excel workbook with team capacity, feature breakdown,
  risk matrix, and sprint plan. Use this skill when a Product Owner, Tech Lead,
  or Scrum Master says "generate PI planning workbook", "create capacity plan",
  "PI planning spreadsheet", "sprint capacity", or needs to prepare for a PI
  planning session with structured Excel artifacts. Produces a multi-sheet
  workbook using the xlsx-generator skill (openpyxl/Python).
license: MIT
---

# PI Planning Workbook Generator

Generate a comprehensive PI Planning Excel workbook for SAFe teams.

## Input

The user should provide (or be asked for):

1. **PI details**: PI name/number, start date, end date, number of sprints (4-8)
2. **Team members**: names, roles, availability percentage per sprint
3. **Features/Epics**: list of features to plan (from epic-decomposer output, Jira, or manual list)
4. **Historical velocity** (optional): average points per sprint from previous PIs

If not provided, use sensible defaults and mark cells as input cells (blue font) for the team to fill in.

## Team Conventions

- **Sprint length**: Always 2 weeks
- **PI length**: Variable — 4 to 8 sprints (configurable)
- **Sizing**: Story points (1, 2, 3, 5)
- **Priority**: P1 through P4

## Output

Generate a Python script using **openpyxl** (following the xlsx-generator skill patterns) that creates a multi-sheet workbook.

Save script to `generated/scripts/generate-pi-planning.py`
Save output to `generated/output/pi-planning-YYYY-MM-DD.xlsx`

## Workbook Structure

### Sheet 1 — PI Summary

```
Row 1:  [Merged] PI [X.X] Planning Workbook — [Team Name]
Row 2:  [blank]
Row 3:  PI Name: [input]    Start Date: [input]    End Date: [input]
Row 4:  Sprints: [formula: count]    Sprint Length: 2 weeks
Row 5:  [blank]
Row 6:  [Merged] Key Metrics
Row 7:  | Metric              | Value                           |
Row 8:  | Total Team Capacity  | =SUM from Team Capacity sheet  |
Row 9:  | Committed Points     | =SUM from Feature Breakdown    |
Row 10: | Available Buffer     | =Capacity - Committed          |
Row 11: | Load Factor          | =Committed / Capacity (%)      |
Row 12: | Features Planned     | =COUNTA from Feature Breakdown |
Row 13: | Avg Velocity (prev)  | [input - blue font]            |
Row 14: [blank]
Row 15: [Merged] PI Objectives
Row 16: | # | Objective | Business Value (1-10) | Committed | Notes |
Row 17: | 1 | [input]   | [input]               | [Yes/No dropdown] | |
        ... (5-8 rows for objectives)

Totals: Avg Business Value = AVERAGE formula
```

**Formatting**:
- Input cells: blue font (team convention for editable values)
- Formula cells: black font
- Conditional formatting on Load Factor: green (<85%), yellow (85-100%), red (>100%)
- Merged headers with dark fill

### Sheet 2 — Team Capacity

```
Header Row: | Name | Role | [Sprint 1 dates] | [Sprint 2 dates] | ... | [Sprint N dates] | PI Total |

Data rows (one per team member):
| [Name] | [Role] | [availability %] | [availability %] | ... | [availability %] | =AVG |

Capacity row:
| CAPACITY | | =Count*Velocity*Avail% | =... | ... | =... | =SUM |

Summary:
- Team size: =COUNTA
- Avg availability: =AVERAGE
- PI capacity (points): =SUM of capacity row
```

**Column generation**: The number of sprint columns MUST be dynamic based on the PI length. Generate the correct number of sprint columns (4-8) with actual date ranges.

**Formatting**:
- Availability cells: blue font (input)
- Capacity formula cells: black font, bold
- Conditional formatting on availability: red if < 50%, yellow if 50-80%, green if > 80%
- Frozen first 2 columns (Name, Role) and header row

### Sheet 3 — Feature Breakdown

```
Header Row: | Feature/Epic | Priority | Total Points | [Sprint 1] | [Sprint 2] | ... | [Sprint N] | Status |

Data rows:
| [Feature name] | [P1-P4 dropdown] | =SUM(sprint columns) | [points input] | ... | [points input] | [dropdown] |

Summary rows:
| Sprint Totals | | | =SUM | =SUM | ... | =SUM | |
| Sprint Capacity | | | =from Sheet 2 | =... | ... | =... | |
| Variance | | | =Capacity-Total | =... | ... | =... | |
```

**Formatting**:
- Sprint point allocation cells: blue font (input)
- Totals/formulas: black font, bold
- Conditional formatting on Variance: red if negative (over-allocated), green if positive
- Status dropdown: Not Started / In Progress / Complete / At Risk
- Priority dropdown: P1 / P2 / P3 / P4
- Auto-filter on all columns

### Sheet 4 — Risk & Dependencies

**ROAM Matrix**:
```
Header: | Risk/Dependency | Category | ROAM Status | Owner | Impact | Mitigation | Target Date |

ROAM Status dropdown: Resolved / Owned / Accepted / Mitigated
Category dropdown: Technical / Resource / External / Process / Cross-Team
Impact dropdown: High / Medium / Low
```

**Summary at top**:
```
| ROAM Status | Count        |
| Resolved    | =COUNTIF     |
| Owned       | =COUNTIF     |
| Accepted    | =COUNTIF     |
| Mitigated   | =COUNTIF     |
| TOTAL       | =SUM         |
```

**Formatting**:
- Conditional formatting on ROAM Status: green=Resolved, blue=Owned, yellow=Accepted, orange=Mitigated
- Conditional formatting on Impact: red=High, yellow=Medium, green=Low
- Frozen header row

### Sheet 5 — Sprint Plan

```
For each sprint (as separate sections within the sheet):

--- Sprint [N]: [Start Date] - [End Date] ---
| Story | Epic/Feature | Size | Owner | Status |
| [story title] | [parent feature] | [1/2/3/5] | [name dropdown] | [dropdown] |
...
| Sprint Total | | =SUM | | |
| Capacity | | =from Sheet 2 | | |
| Remaining | | =Capacity - Total | | |
```

**Status dropdown**: To Do / In Progress / Done / Blocked / Carried Over
**Formatting**:
- Conditional formatting on Remaining: red if negative, green if positive
- Section headers for each sprint with merged cells and colored background
- Frozen header

## Formulas — Critical Requirements

**All values that CAN be formulas MUST be formulas**:
- Total capacity = SUM of individual sprint capacities
- Sprint capacity = team members * velocity * average availability
- Load factor = committed / capacity
- Variance = capacity - committed per sprint
- ROAM counts = COUNTIF formulas
- Sprint totals = SUM formulas

**Cross-sheet references**:
- PI Summary pulls totals from Team Capacity and Feature Breakdown
- Feature Breakdown pulls capacity from Team Capacity
- Sprint Plan pulls capacity from Team Capacity

**Use blue font for ALL input cells** — this is the financial model convention for cells the user should edit.
**Use black font for ALL formula cells** — these should not be manually edited.

## Print Setup

- **Orientation**: Landscape
- **Margins**: 0.5 inches all sides
- **Repeat rows**: Header row on each page
- **Footer**: "PI [X.X] Planning — [Team Name] — Confidential" + page numbers
- **Print area**: Set to data range (exclude empty rows/columns)

## Critical Rules

- **Sprint columns must be dynamic** — never hardcode 6 sprints. Use the PI length input to generate the correct number (4-8).
- **Blue font for inputs, black for formulas** — always. This tells the team which cells to edit.
- **Every sheet needs frozen panes** — freeze the header row and any label columns.
- **Conditional formatting on all variance/status fields** — the workbook should visually flag problems without the user having to scan numbers.
- **Data validation (dropdowns) on all categorical fields** — Priority, Status, ROAM, Impact. Don't let the team type free text in these fields.
- **Formulas, never hardcoded values** — follow the xlsx skill's critical rule about using Excel formulas.

## After Generation

Tell the user:
> "PI Planning workbook saved to `generated/output/pi-planning-YYYY-MM-DD.xlsx`.
>
> Sheets: PI Summary, Team Capacity, Feature Breakdown, Risk & Dependencies, Sprint Plan.
> [N] sprint columns generated for your [X]-week PI.
>
> Next steps:
> 1. Fill in team member availability (blue cells on Team Capacity sheet)
> 2. Allocate feature points to sprints (blue cells on Feature Breakdown)
> 3. Review capacity vs commitment on PI Summary
> 4. Log risks on the Risk & Dependencies sheet"
